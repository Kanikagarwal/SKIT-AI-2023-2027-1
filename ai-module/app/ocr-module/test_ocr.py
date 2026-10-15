
from pathlib import Path
import re

import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


# --------------------------------------------------
# 1. Input and output paths
# --------------------------------------------------

DATA_DIR = Path(
    r"C:/Users/Lenovo/Desktop/EvalAI/ai-module/data"
)

# Input regions:
# data/outputs/exam_test/Student_1/page_01_region_01.png
REGIONS_DIR = DATA_DIR / "outputs" / "exam_test"

# Output transcriptions
OUTPUT_DIR = DATA_DIR / "outputs" / "trocr_results"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# 2. Configure device
# --------------------------------------------------

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"Using device: {DEVICE}")


# --------------------------------------------------
# 3. Load TrOCR model once
# --------------------------------------------------

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("\nLoading TrOCR model...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)

model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)
model.to(DEVICE)
model.eval()

print("TrOCR model loaded successfully.")


# --------------------------------------------------
# 4. Process Student_1 through Student_5
# --------------------------------------------------

for student_num in range(1, 6):

    student_dir = REGIONS_DIR / f"Student_{student_num}"

    if not student_dir.exists():
        print(f"\nStudent folder not found: {student_dir}")
        continue

    # Find all PNG region images and sort by filename numbers
    region_paths = sorted(
        student_dir.glob("*.png"),
        key=lambda path: [
            int(part) if part.isdigit() else part.lower()
            for part in re.split(r"(\d+)", path.name)
        ]
    )

    if not region_paths:
        print(f"\nNo PNG region images found for Student_{student_num}.")
        continue

    print("\n" + "=" * 70)
    print(f"Processing Student_{student_num}")
    print(f"Number of regions: {len(region_paths)}")
    print("=" * 70)

    # Create output folder for this student
    student_output_dir = OUTPUT_DIR / f"Student_{student_num}"
    student_output_dir.mkdir(parents=True, exist_ok=True)

    combined_results = []

    # --------------------------------------------------
    # 5. Process each region separately
    # --------------------------------------------------

    for region_index, region_path in enumerate(region_paths, start=1):

        print(f"\nRegion {region_index}: {region_path.name}")

        try:
            # Load the input region image
            with Image.open(region_path) as source_image:
                image = source_image.convert("RGB")

            print(f"Image size: {image.size}")

            # Convert the image into TrOCR input tensors
            pixel_values = processor(
                images=image,
                return_tensors="pt"
            ).pixel_values.to(DEVICE)

            # Generate the handwritten transcription
            with torch.inference_mode():
                generated_ids = model.generate(
                    pixel_values,
                    max_new_tokens=256
                )

            text = processor.batch_decode(
                generated_ids,
                skip_special_tokens=True
            )[0]

            # Save this region's transcription
            output_path = (
                student_output_dir / f"{region_path.stem}.txt"
            )

            output_path.write_text(
                text,
                encoding="utf-8"
            )

            # Display result
            print("-" * 60)
            print("Recognized text:")
            print(text)
            print("-" * 60)

            combined_results.append(
                f"Input region: {region_path.name}\n"
                f"Recognized text:\n{text}\n"
                f"{'-' * 60}"
            )

        except Exception as error:
            error_message = (
                f"Error processing {region_path.name}: {error}"
            )

            print(error_message)
            combined_results.append(error_message)

    # --------------------------------------------------
    # 6. Save combined results for this student
    # --------------------------------------------------

    combined_path = student_output_dir / "all_regions.txt"

    combined_path.write_text(
        "\n\n".join(combined_results),
        encoding="utf-8"
    )

    print(f"\nStudent results saved in: {student_output_dir}")
    print(f"Combined transcription: {combined_path}")


# --------------------------------------------------
# 7. Finish
# --------------------------------------------------

print("\nAll students processed.")
print(f"Results saved in: {OUTPUT_DIR}")

