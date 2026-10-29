
from pathlib import Path
import json

from paddleocr import TextRecognition


# --------------------------------------------------
# PATHS AND MODEL
# --------------------------------------------------

DATA_DIR = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\English_processed"
)

MODEL_NAME = "en_PP-OCRv5_mobile_rec"


# --------------------------------------------------
# RECOGNIZE ONE IMAGE
# --------------------------------------------------

def recognize_text(image_path, recognizer):
    """Recognize text from one existing DBNet line crop."""

    outputs = recognizer.predict(
        input=str(image_path),
        batch_size=1
    )

    for output in outputs:
        result = output.json

        # PaddleOCR/PaddleX results normally contain a "res" dictionary.
        if isinstance(result, str):
            result = json.loads(result)

        if "res" in result:
            result = result["res"]

        text = result.get("rec_text", "")
        score = result.get("rec_score")

        return {
            "text": str(text).strip(),
            "confidence": (
                float(score) if score is not None else None
            )
        }

    return {"text": "", "confidence": None}


# --------------------------------------------------
# PROCESS ONE PAGE
# --------------------------------------------------

def process_page(crop_dir, recognizer):
    crop_paths = sorted(crop_dir.glob("line_*.png"))

    page_name = crop_dir.name.replace("_dbnet_lines", "")

    # Separate filenames: existing TrOCR results remain untouched.
    output_file = crop_dir / "paddleocr_results.txt"

    print("\n" + "-" * 55)
    print(f"Page: {page_name}")
    print(f"Text crops found: {len(crop_paths)}")
    print("-" * 55)

    if not crop_paths:
        print("No line crops found. Skipping.")
        return []

    page_results = []

    with open(output_file, "w", encoding="utf-8") as file:
        for index, crop_path in enumerate(crop_paths, start=1):
            print(
                f"[{index}/{len(crop_paths)}] "
                f"Recognizing {crop_path.name}..."
            )

            try:
                prediction = recognize_text(crop_path, recognizer)

                result = {
                    "page": page_name,
                    "crop": crop_path.name,
                    "text": prediction["text"],
                    "confidence": prediction["confidence"]
                }

                page_results.append(result)

                print(f"  OCR: {prediction['text']}")
                print(f"  Confidence: {prediction['confidence']}")

                file.write(f"{crop_path.name}\n")
                file.write(f"Text: {prediction['text']}\n")
                file.write(
                    f"Confidence: {prediction['confidence']}\n\n"
                )
                file.flush()

            except Exception as error:
                print(f"  ERROR: {error}")

                file.write(
                    f"{crop_path.name}\n"
                    f"[OCR ERROR: {error}]\n\n"
                )
                file.flush()

    print(f"Saved: {output_file}")
    return page_results


# --------------------------------------------------
# MAIN
# --------------------------------------------------

def main():
    if not DATA_DIR.exists():
        raise FileNotFoundError(
            f"Input folder does not exist: {DATA_DIR}"
        )

    page_dirs = sorted(
        path
        for path in DATA_DIR.glob("page_*_dbnet_lines")
        if path.is_dir()
    )

    if not page_dirs:
        raise FileNotFoundError(
            f"No DBNet page folders found in {DATA_DIR}"
        )

    combined_file = DATA_DIR / "all_pages_paddleocr_results.json"
    combined_text_file = DATA_DIR / "all_pages_paddleocr_results.txt"

    # Protect existing results from accidental overwriting.
    if combined_file.exists() or combined_text_file.exists():
        raise FileExistsError(
            "PaddleOCR output already exists. Rename or move the "
            "existing PaddleOCR output files before rerunning."
        )

    for page_dir in page_dirs:
        if (page_dir / "paddleocr_results.txt").exists():
            raise FileExistsError(
                f"Output already exists in {page_dir}. "
                "Rename it before rerunning."
            )

    print("=" * 60)
    print("PaddleOCR - ALL DBNet LINE CROPS")
    print("=" * 60)
    print(f"Pages: {len(page_dirs)}")
    print(f"Model: {MODEL_NAME}")

    print("\nLoading recognition model...")
    recognizer = TextRecognition(model_name=MODEL_NAME)
    print("Model loaded.")

    all_results = []

    for page_index, crop_dir in enumerate(page_dirs, start=1):
        print(f"\nPage folder {page_index}/{len(page_dirs)}")

        results = process_page(crop_dir, recognizer)
        all_results.extend(results)

    with open(combined_file, "w", encoding="utf-8") as file:
        json.dump(all_results, file, indent=2, ensure_ascii=False)

    with open(combined_text_file, "w", encoding="utf-8") as file:
        for result in all_results:
            file.write(f"PAGE: {result['page']}\n")
            file.write(f"CROP: {result['crop']}\n")
            file.write(f"TEXT: {result['text']}\n")
            file.write(f"CONFIDENCE: {result['confidence']}\n")
            file.write("-" * 40 + "\n")

    print("\n" + "=" * 60)
    print("PADDLEOCR COMPLETED")
    print(f"Pages processed: {len(page_dirs)}")
    print(f"Results saved: {len(all_results)}")
    print(f"Combined JSON: {combined_file}")
    print(f"Combined text: {combined_text_file}")
    print("=" * 60)


if __name__ == "__main__":
    main()
