
from pathlib import Path

import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


# Polygon-based line crops created by DBNet

CROP_DIR = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\data\outputs\exam_test\Student_1\page_03_dbnet_lines"
)

OUTPUT_FILE = CROP_DIR / "trocr_results.txt"


MODEL_NAME = "microsoft/trocr-base-handwritten"


def main():
    if not CROP_DIR.exists():
        raise FileNotFoundError(f"Crop folder not found: {CROP_DIR}")

    crop_paths = sorted(CROP_DIR.glob("line_*.png"))

    if not crop_paths:
        raise FileNotFoundError(
            f"No line crops found in {CROP_DIR}"
        )

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")
    print(f"Number of crops: {len(crop_paths)}")
    print(f"Loading model: {MODEL_NAME}")

    processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
    model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)
    model.to(device)
    model.eval()

    results = []

    for index, crop_path in enumerate(crop_paths, start=1):
        try:
            image = Image.open(crop_path).convert("RGB")
            pixel_values = processor(
                images=image,
                return_tensors="pt"
            ).pixel_values.to(device)

            with torch.inference_mode():
                generated_ids = model.generate(
                    pixel_values,
                    max_new_tokens=128
                )

            text = processor.batch_decode(
                generated_ids,
                skip_special_tokens=True
            )[0]

            results.append(
                f"{crop_path.name}\n{text}\n"
            )

            print(f"\n[{index}/{len(crop_paths)}] {crop_path.name}")
            print(f"Recognized text: {text}")

        except Exception as error:
            print(f"\nError processing {crop_path.name}: {error}")
            results.append(
                f"{crop_path.name}\n[ERROR: {error}]\n"
            )

    OUTPUT_FILE.write_text(
        "\n".join(results),
        encoding="utf-8"
    )

    print(f"\nResults saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
