
from pathlib import Path
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


# --------------------------------------------------
# PATHS AND MODEL
# --------------------------------------------------

DATA_DIR = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\Social_Science_processed"
)

MODEL_NAME = "microsoft/trocr-base-handwritten"

MAX_NEW_TOKENS = 128


# --------------------------------------------------
# OCR ONE IMAGE
# --------------------------------------------------

def recognize_text(image_path, processor, model, device):
    """Recognize handwritten text in one detected text crop."""

    image = Image.open(image_path).convert("RGB")

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values.to(device)

    with torch.inference_mode():
        generated_ids = model.generate(
            pixel_values,
            max_new_tokens=MAX_NEW_TOKENS
        )

    text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    return text.strip()


# --------------------------------------------------
# PROCESS ALL CROPS FROM ONE PAGE
# --------------------------------------------------

def process_page(crop_dir, processor, model, device):
    crop_paths = sorted(crop_dir.glob("line_*.png"))

    page_name = crop_dir.name.replace("_dbnet_lines", "")
    output_file = crop_dir / "trocr_results.txt"

    print(f"\n{'-' * 55}")
    print(f"Page: {page_name}")
    print(f"Text crops found: {len(crop_paths)}")
    print("-" * 55)

    if not crop_paths:
        print("No line crops found. Skipping this page.")
        return []

    page_results = []

    with open(output_file, "w", encoding="utf-8") as file:
        for index, crop_path in enumerate(crop_paths, start=1):
            print(
                f"[{index}/{len(crop_paths)}] "
                f"Recognizing {crop_path.name}..."
            )

            try:
                recognized_text = recognize_text(
                    crop_path,
                    processor,
                    model,
                    device
                )

                print(f"  OCR: {recognized_text}")

                result = {
                    "page": page_name,
                    "crop": crop_path.name,
                    "text": recognized_text
                }

                page_results.append(result)

                file.write(f"{crop_path.name}\n")
                file.write(f"{recognized_text}\n\n")
                file.flush()

            except Exception as error:
                print(f"  ERROR: {error}")

                file.write(f"{crop_path.name}\n")
                file.write(f"[OCR ERROR: {error}]\n\n")
                file.flush()

    print(f"Saved page results: {output_file}")

    return page_results


# --------------------------------------------------
# MAIN: PROCESS ALL PDF PAGES
# --------------------------------------------------

def main():
    if not DATA_DIR.exists():
        raise FileNotFoundError(
            f"Input folder does not exist: {DATA_DIR}\n"
            "Run PDF preprocessing first."
        )

    page_dirs = sorted(
        path
        for path in DATA_DIR.glob("page_*_dbnet_lines")
        if path.is_dir()
    )

    if not page_dirs:
        raise FileNotFoundError(
            f"No DBNet page folders found in {DATA_DIR}\n"
            "Run run_dbnet_all_pages.py first."
        )

    # Use GPU if available; otherwise use CPU.
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    print("=" * 60)
    print("TrOCR - ALL PAGES")
    print("=" * 60)
    print(f"Page folders: {len(page_dirs)}")
    print(f"Device: {device}")
    print(f"Model: {MODEL_NAME}")

    if device.type == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("GPU not detected. TrOCR will run on CPU.")

    # Load the processor and model only once.
    print("\nLoading TrOCR model...")
    processor = TrOCRProcessor.from_pretrained(MODEL_NAME)

    model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)
    model.to(device)
    model.eval()

    print("Model loaded successfully.")

    combined_results = []
    total_pages = len(page_dirs)

    for page_index, crop_dir in enumerate(page_dirs, start=1):
        print(f"\nProcessing page folder {page_index}/{total_pages}")

        page_results = process_page(
            crop_dir,
            processor,
            model,
            device
        )

        combined_results.extend(page_results)

    # Save one combined text file for all pages.
    combined_file = DATA_DIR / "all_pages_trocr_results.txt"

    with open(combined_file, "w", encoding="utf-8") as file:
        for result in combined_results:
            file.write(
                f"PAGE: {result['page']}\n"
                f"CROP: {result['crop']}\n"
                f"TEXT: {result['text']}\n"
                f"{'-' * 40}\n"
            )

    print("\n" + "=" * 60)
    print("TrOCR PROCESSING COMPLETED")
    print(f"Pages processed: {total_pages}")
    print(f"Successful OCR crops: {len(combined_results)}")
    print(f"Combined results: {combined_file}")
    print("=" * 60)


if __name__ == "__main__":
    main()
