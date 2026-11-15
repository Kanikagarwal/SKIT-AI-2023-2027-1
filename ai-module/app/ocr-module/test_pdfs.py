
from pathlib import Path
import json
import re
import time

import paddle
from paddleocr import PaddleOCRVL

from dbnet import run_dbnet_fallback


# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

def make_json_serializable(value):
    """Convert Paddle output values into JSON-compatible values."""

    if isinstance(value, dict):
        return {
            str(key): make_json_serializable(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [make_json_serializable(item) for item in value]

    if hasattr(value, "tolist"):
        return value.tolist()

    if hasattr(value, "__dict__"):
        return make_json_serializable(vars(value))

    if isinstance(value, (str, int, float, bool)) or value is None:
        return value

    return str(value)


def get_value(obj, key, default=None):
    """Read a field from either a dictionary or an object."""

    if isinstance(obj, dict):
        return obj.get(key, default)

    return getattr(obj, key, default)


def extract_text_from_item(item):
    """Extract recognized text from one PaddleOCR-VL result item."""

    if isinstance(item, str):
        return item.strip()

    if isinstance(item, dict):
        # Common text fields in PaddleOCR-VL outputs
        for key in (
            "block_content",
            "text",
            "content",
            "recognized_text",
            "markdown_text",
        ):
            value = item.get(key)

            if isinstance(value, str) and value.strip():
                return value.strip()

        return ""

    for key in (
        "block_content",
        "text",
        "content",
        "recognized_text",
        "markdown_text",
    ):
        value = get_value(item, key)

        if isinstance(value, str) and value.strip():
            return value.strip()

    return ""


def extract_ocr_text(result):
    """
    Extract text from PaddleOCR-VL output.

    Supports parsing_res_list and markdown_texts,
    including dictionary and object-based results.
    """

    extracted_parts = []

    if result is None:
        return ""

    # PaddleOCR-VL commonly returns a list of result objects.
    result_items = result if isinstance(result, (list, tuple)) else [result]

    for result_item in result_items:

        # 1. Extract structured parsing results
        parsing_results = get_value(
            result_item,
            "parsing_res_list",
            []
        )

        if parsing_results:
            for item in parsing_results:
                text = extract_text_from_item(item)

                if text:
                    extracted_parts.append(text)

        # 2. Extract Markdown output if structured text is unavailable
        if not extracted_parts:
            markdown_texts = get_value(
                result_item,
                "markdown_texts",
                []
            )

            if isinstance(markdown_texts, str):
                markdown_texts = [markdown_texts]

            if isinstance(markdown_texts, (list, tuple)):
                for item in markdown_texts:
                    text = extract_text_from_item(item)

                    if text:
                        extracted_parts.append(text)

        # 3. Some result versions expose a direct text field
        if not extracted_parts:
            direct_text = get_value(result_item, "text", "")

            if isinstance(direct_text, str) and direct_text.strip():
                extracted_parts.append(direct_text.strip())

    # Preserve the OCR order. Do not correct the student's writing.
    return "\n".join(extracted_parts).strip()


def save_json(data, output_path):
    """Save JSON with UTF-8 support."""

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(
            make_json_serializable(data),
            file,
            ensure_ascii=False,
            indent=4
        )


def get_page_number(filename):
    """Extract page number from names such as page_01_preprocessed.png."""

    match = re.search(r"page[_-]?(\d+)", filename, re.IGNORECASE)

    if match:
        return int(match.group(1))

    return None


def get_page_images(input_dir):
    """Find preprocessed page images in the input directory."""

    input_dir = Path(input_dir)

    extensions = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}

    images = [
        path for path in input_dir.iterdir()
        if path.is_file()
        and path.suffix.lower() in extensions
        and "preprocessed" in path.stem.lower()
    ]

    return sorted(
        images,
        key=lambda path: (
            get_page_number(path.name)
            if get_page_number(path.name) is not None
            else 999999
        )
    )


# --------------------------------------------------
# PADDLEOCR-VL INITIALIZATION
# --------------------------------------------------

def initialize_ocr_engine(device="gpu"):
    """Initialize PaddleOCR-VL once for the complete pipeline."""

    if device.startswith("gpu") and not paddle.is_compiled_with_cuda():
        raise RuntimeError(
            "GPU was requested, but PaddlePaddle was not compiled with CUDA. "
            "Use device='cpu' or install a compatible GPU version."
        )

    paddle.set_device(device)

    print(f"Initializing PaddleOCR-VL on {device}...")

    ocr_engine = PaddleOCRVL()

    print("PaddleOCR-VL initialized successfully.")

    return ocr_engine


def run_vl_on_image(ocr_engine, image_path):
    """Run PaddleOCR-VL on one image."""

    result = ocr_engine.predict(str(image_path))

    recognized_text = extract_ocr_text(result)

    return {
        "text": recognized_text,
        "raw_result": make_json_serializable(result)
    }


# --------------------------------------------------
# STAGE 1: FULL-PAGE OCR
# --------------------------------------------------

def run_full_page_ocr(
    input_dir,
    output_dir,
    ocr_engine
):
    """
    Run PaddleOCR-VL on every complete page.

    Pages with empty recognized text are added to empty_pages.json
    for DBNet fallback.
    """

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)

    full_page_dir = output_dir / "full_page_ocr"
    full_page_dir.mkdir(parents=True, exist_ok=True)

    page_images = get_page_images(input_dir)

    if not page_images:
        raise FileNotFoundError(
            f"No preprocessed page images found in: {input_dir}"
        )

    full_page_results = []
    empty_pages = []

    print(f"\nTotal pages found: {len(page_images)}")
    print("\nStarting full-page OCR...\n")

    for index, image_path in enumerate(page_images, start=1):

        page_number = get_page_number(image_path.name)

        if page_number is None:
            page_number = index

        print(
            f"Full-page OCR: {index}/{len(page_images)} "
            f"| {image_path.name}"
        )

        try:
            result = run_vl_on_image(
                ocr_engine,
                image_path
            )

            recognized_text = result["text"]

            page_result = {
                "page_number": page_number,
                "page_name": image_path.name,
                "input_path": str(image_path),
                "source": "full_page",
                "status": "success" if recognized_text else "empty",
                "text": recognized_text
            }

            full_page_results.append(page_result)

            # Fallback is triggered ONLY when text is empty.
            if not recognized_text.strip():

                empty_pages.append({
                    "page_number": page_number,
                    "page_name": image_path.name,
                    "input_path": str(image_path),
                    "status": "empty"
                })

                print("  -> Empty text. Added for DBNet fallback.")

            else:
                print("  -> Full-page OCR successful.")

        except Exception as error:

            print(f"  -> OCR error: {error}")

            # An OCR exception is not silently treated as empty text.
            raise RuntimeError(
                f"Full-page OCR failed for {image_path.name}"
            ) from error

    save_json(
        full_page_results,
        full_page_dir / "full_page_ocr.json"
    )

    with open(
        full_page_dir / "full_page_ocr.jsonl",
        "w",
        encoding="utf-8"
    ) as file:

        for item in full_page_results:
            file.write(
                json.dumps(item, ensure_ascii=False) + "\n"
            )

    save_json(
        empty_pages,
        full_page_dir / "empty_pages.json"
    )

    print("\nFull-page OCR completed.")
    print(f"Pages processed: {len(full_page_results)}")
    print(f"Pages needing DBNet fallback: {len(empty_pages)}")

    return full_page_results, empty_pages


# --------------------------------------------------
# STAGE 2: DBNET FALLBACK + CROP OCR
# --------------------------------------------------

def find_dbnet_crop_directory(dbnet_output_dir, page_number):
    """Find the DBNet crop directory for a particular page."""

    dbnet_output_dir = Path(dbnet_output_dir)

    expected_name = f"page_{page_number:02d}_dbnet_lines"

    expected_dir = dbnet_output_dir / expected_name

    if expected_dir.exists():
        return expected_dir

    # Fallback matching for different page-folder naming formats.
    for folder in dbnet_output_dir.iterdir():

        if not folder.is_dir():
            continue

        folder_page_number = get_page_number(folder.name)

        if folder_page_number == page_number:
            return folder

    return None


def run_dbnet_crop_ocr(
    empty_pages,
    input_dir,
    output_dir,
    device,
    ocr_engine,
    batch_size=2,
    crop_padding=3,
    save_visualizations=False,
    resume=True
):
    """
    Run DBNet only on pages where full-page OCR returned empty text.

    Then run PaddleOCR-VL on the detected DBNet crops.
    """

    if not empty_pages:
        print("\nNo empty pages. DBNet fallback is not required.")
        return {}

    output_dir = Path(output_dir)

    dbnet_output_dir = output_dir / "dbnet_fallback"

    empty_pages_json = (
        output_dir
        / "full_page_ocr"
        / "empty_pages.json"
    )

    save_json(empty_pages, empty_pages_json)

    print("\nStarting DBNet fallback...")

    # Run the existing DBNet implementation.
    run_dbnet_fallback(
        input_dir=Path(input_dir),
        output_dir=dbnet_output_dir,
        empty_pages_json=empty_pages_json,
        device=device,
        batch_size=batch_size,
        crop_padding=crop_padding,
        save_visualizations=save_visualizations,
        resume=resume
    )

    fallback_results = {}

    print("\nStarting PaddleOCR-VL on DBNet crops...\n")

    for page in empty_pages:

        page_number = page["page_number"]

        crop_dir = find_dbnet_crop_directory(
            dbnet_output_dir,
            page_number
        )

        if crop_dir is None:
            print(
                f"Warning: DBNet crop directory not found "
                f"for page {page_number}"
            )

            fallback_results[page_number] = {
                "page_number": page_number,
                "source": "dbnet_crop",
                "status": "no_crops",
                "text": "",
                "crops": []
            }

            continue

        crop_images = sorted(
            crop_dir.glob("line_*.png")
        )

        crop_results = []
        page_text_parts = []

        print(
            f"DBNet crop OCR: Page {page_number} "
            f"| Total crops: {len(crop_images)}"
        )

        for crop_index, crop_path in enumerate(
            crop_images,
            start=1
        ):

            try:
                result = run_vl_on_image(
                    ocr_engine,
                    crop_path
                )

                crop_text = result["text"]

                crop_results.append({
                    "crop_number": crop_index,
                    "crop_name": crop_path.name,
                    "crop_path": str(crop_path),
                    "text": crop_text,
                    "status": "success" if crop_text else "empty"
                })

                if crop_text:
                    page_text_parts.append(crop_text)

            except Exception as error:

                raise RuntimeError(
                    f"Crop OCR failed for {crop_path}"
                ) from error

        # Preserve crop order while joining the recognized text.
        combined_text = "\n".join(page_text_parts).strip()

        fallback_results[page_number] = {
            "page_number": page_number,
            "source": "dbnet_crop",
            "status": "success" if combined_text else "empty",
            "text": combined_text,
            "crops": crop_results
        }

        print(
            f"  -> Page {page_number}: "
            f"{len(crop_results)} crops processed."
        )

    save_json(
        fallback_results,
        output_dir / "dbnet_fallback_ocr.json"
    )

    return fallback_results


# --------------------------------------------------
# STAGE 3: BUILD FINAL OCR OUTPUT
# --------------------------------------------------

def build_final_output(
    full_page_results,
    fallback_results,
    output_path
):
    """
    Use full-page text whenever it is non-empty.

    Use DBNet crop text only when full-page text is empty.
    Never concatenate both OCR outputs.
    """

    final_results = []

    for page in full_page_results:

        page_number = page["page_number"]
        full_page_text = page.get("text", "").strip()

        if full_page_text:

            final_text = full_page_text
            source = "full_page"
            status = "success"

        else:

            fallback = fallback_results.get(
                page_number,
                {}
            )

            final_text = fallback.get("text", "").strip()
            source = "dbnet_crop"

            status = (
                "success"
                if final_text
                else "empty"
            )

        final_results.append({
            "page_number": page_number,
            "page_name": page["page_name"],
            "source": source,
            "status": status,
            "text": final_text
        })

    save_json(final_results, output_path)

    print("\nFinal OCR output created.")
    print(f"Total pages: {len(final_results)}")
    print(
        "Pages using full-page OCR:",
        sum(
            1 for page in final_results
            if page["source"] == "full_page"
        )
    )
    print(
        "Pages using DBNet fallback:",
        sum(
            1 for page in final_results
            if page["source"] == "dbnet_crop"
        )
    )
    print(
        "Pages still empty:",
        sum(
            1 for page in final_results
            if page["status"] == "empty"
        )
    )

    return final_results


# --------------------------------------------------
# MAIN PIPELINE FUNCTION
# --------------------------------------------------

def run_ocr_pipeline(
    input_dir,
    output_dir,
    device="gpu",
    batch_size=2,
    crop_padding=3,
    save_visualizations=False,
    resume=True,
    ocr_engine=None
):
    """
    Complete OCR pipeline.

    Parameters
    ----------
    input_dir:
        Directory containing preprocessed page images.

    output_dir:
        Directory where OCR results and DBNet crops will be saved.

    device:
        "gpu", "gpu:0", or "cpu".

    batch_size:
        DBNet batch size.

    crop_padding:
        Padding around detected DBNet text regions.

    save_visualizations:
        Whether DBNet visualizations should be saved.

    resume:
        Whether DBNet should reuse existing crop results.

    ocr_engine:
        Optional already-initialized PaddleOCRVL instance.
        Useful when the pipeline is called from a long-running API worker.
    """

    start_time = time.time()

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)

    if not input_dir.exists():
        raise FileNotFoundError(
            f"Input directory does not exist: {input_dir}"
        )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    print("=" * 55)
    print("EVALAI OCR PIPELINE")
    print("=" * 55)

    # Initialize PaddleOCR-VL only once.
    if ocr_engine is None:
        ocr_engine = initialize_ocr_engine(device)

    # STAGE 1: Full-page OCR
    full_page_results, empty_pages = run_full_page_ocr(
        input_dir=input_dir,
        output_dir=output_dir,
        ocr_engine=ocr_engine
    )

    # STAGE 2: DBNet fallback only for empty pages
    fallback_results = run_dbnet_crop_ocr(
        empty_pages=empty_pages,
        input_dir=input_dir,
        output_dir=output_dir,
        device=device,
        ocr_engine=ocr_engine,
        batch_size=batch_size,
        crop_padding=crop_padding,
        save_visualizations=save_visualizations,
        resume=resume
    )

    # STAGE 3: Final output
    final_output_path = output_dir / "final_ocr_output.json"

    final_results = build_final_output(
        full_page_results=full_page_results,
        fallback_results=fallback_results,
        output_path=final_output_path
    )

    total_time = time.time() - start_time

    summary = {
        "status": "completed",
        "total_pages": len(final_results),
        "full_page_pages": sum(
            1 for page in final_results
            if page["source"] == "full_page"
        ),
        "dbnet_fallback_pages": sum(
            1 for page in final_results
            if page["source"] == "dbnet_crop"
        ),
        "empty_pages": sum(
            1 for page in final_results
            if page["status"] == "empty"
        ),
        "output_file": str(final_output_path),
        "total_time_seconds": round(total_time, 2)
    }

    save_json(
        summary,
        output_dir / "pipeline_summary.json"
    )

    print("\n" + "=" * 55)
    print("OCR PIPELINE COMPLETED")
    print("=" * 55)
    print(json.dumps(summary, indent=4))

    return {
        "summary": summary,
        "results": final_results
    }


# --------------------------------------------------
# STANDALONE TESTING
# --------------------------------------------------

if __name__ == "__main__":

    # Replace these paths with your local test paths.
    INPUT_DIR = Path("data/ENGLISH_processed")
    OUTPUT_DIR = Path("data/outputs")

    run_ocr_pipeline(
        input_dir=INPUT_DIR,
        output_dir=OUTPUT_DIR,
        device="gpu",
        batch_size=2,
        crop_padding=3,
        save_visualizations=False,
        resume=True
    )
