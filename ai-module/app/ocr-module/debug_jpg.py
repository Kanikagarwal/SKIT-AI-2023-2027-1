import os
import cv2

from preprocessing import ImagePreprocessor
from line_segmentation import LineSegmenter


IMAGE_PATH = (
    "C:/Users/Lenovo/Desktop/EvalAI/"
    "ai-module/data/IMG_20261006_162510.jpg"
)

OUTPUT_DIR = (
    "C:/Users/Lenovo/Desktop/EvalAI/"
    "ai-module/data/outputs/debug_jpg"
)


def main():

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    print("=" * 70)
    print("DEBUG — PROJECTION-BASED LINE SEGMENTATION")
    print("=" * 70)

    # ==================================================
    # 1. INITIALIZE
    # ==================================================

    preprocessor = ImagePreprocessor(
        target_width=1200,
        enable_deskew=True
    )

    segmenter = LineSegmenter(
        min_line_height=15,
        padding=5
    )

    # ==================================================
    # 2. LOAD ORIGINAL IMAGE
    # ==================================================

    print("\n[1] Loading image...")

    original = cv2.imread(
        IMAGE_PATH,
        cv2.IMREAD_GRAYSCALE
    )

    if original is None:
        raise FileNotFoundError(
            f"Could not load image:\n{IMAGE_PATH}"
        )

    print(
        f"Original size: "
        f"{original.shape[1]} x {original.shape[0]}"
    )

    cv2.imwrite(
        os.path.join(
            OUTPUT_DIR,
            "01_original.png"
        ),
        original
    )

    # ==================================================
    # 3. PREPROCESSING
    # ==================================================

    print("\n[2] Preprocessing...")

    cleaned_page = preprocessor.process(
        [original],
        handwriting_mode=True
    )

    print(
        f"Processed size: "
        f"{cleaned_page.shape[1]} x "
        f"{cleaned_page.shape[0]}"
    )

    cv2.imwrite(
        os.path.join(
            OUTPUT_DIR,
            "02_preprocessed.png"
        ),
        cleaned_page
    )

    # ==================================================
    # 4. DENOISING
    # ==================================================

    print("\n[3] Denoising...")

    denoised = segmenter.denoise(
        cleaned_page
    )

    cv2.imwrite(
        os.path.join(
            OUTPUT_DIR,
            "03_denoised.png"
        ),
        denoised
    )

    # ==================================================
    # 5. ADAPTIVE THRESHOLD
    # ==================================================

    print("\n[4] Creating adaptive binary image...")

    binary = segmenter.create_binary(
        denoised
    )

    cv2.imwrite(
        os.path.join(
            OUTPUT_DIR,
            "04_adaptive_binary.png"
        ),
        binary
    )

    # ==================================================
    # 6. CONNECT TEXT
    # ==================================================

    print("\n[5] Connecting handwriting strokes...")

    connected = segmenter.connect_text(
        binary
    )

    cv2.imwrite(
        os.path.join(
            OUTPUT_DIR,
            "05_connected.png"
        ),
        connected
    )

    # ==================================================
    # 7. FIND LINE BANDS
    # ==================================================

    print("\n[6] Finding text-line bands...")

    line_bands = segmenter.find_line_bands(
        connected
    )

    print("\nDetected bands:")

    for i, band in enumerate(
        line_bands,
        start=1
    ):
        print(
            f"Band {i}: {band}"
        )

    # ==================================================
    # 8. MERGE CLOSE BANDS
    # ==================================================

    print("\n[7] Merging close bands...")

    merged_bands = segmenter.merge_close_bands(
        line_bands,
        max_gap=12
    )

    print("\nAfter merging:")

    for i, band in enumerate(
        merged_bands,
        start=1
    ):
        print(
            f"Band {i}: {band}"
        )

    # ==================================================
    # 9. CREATE BOUNDING BOXES
    # ==================================================

    print("\n[8] Creating bounding boxes...")

    bboxes = segmenter.create_bounding_boxes(
        cleaned_page,
        connected,
        merged_bands
    )

    print("\nBounding boxes:")

    for i, bbox in enumerate(
        bboxes,
        start=1
    ):
        print(
            f"Line {i}: {bbox}"
        )

    print(
        f"\nTotal lines detected: "
        f"{len(bboxes)}"
    )

    # ==================================================
    # 10. CREATE OVERLAY
    # ==================================================

    print("\n[9] Creating segmentation overlay...")

    overlay_path = os.path.join(
        OUTPUT_DIR,
        "06_segmentation_overlay.png"
    )

    segmenter.draw_visual_overlay(
        cleaned_page,
        bboxes,
        output_path=overlay_path
    )

    # ==================================================
    # 11. SAVE LINE CROPS
    # ==================================================

    print("\n[10] Saving line crops...")

    line_crops = segmenter.crop_lines(
        cleaned_page,
        bboxes
    )

    crops_dir = os.path.join(
        OUTPUT_DIR,
        "line_crops"
    )

    os.makedirs(
        crops_dir,
        exist_ok=True
    )

    for line_number, crop in enumerate(
        line_crops,
        start=1
    ):

        crop_path = os.path.join(
            crops_dir,
            f"line_{line_number:02d}.png"
        )

        cv2.imwrite(
            crop_path,
            crop
        )

    # ==================================================
    # 12. FINAL SUMMARY
    # ==================================================

    print("\n" + "=" * 70)
    print("DEBUG COMPLETED")
    print("=" * 70)

    print(
        f"\nOriginal image : "
        f"{original.shape[1]} x "
        f"{original.shape[0]}"
    )

    print(
        f"Processed image: "
        f"{cleaned_page.shape[1]} x "
        f"{cleaned_page.shape[0]}"
    )

    print(
        f"Initial bands  : "
        f"{len(line_bands)}"
    )

    print(
        f"Merged bands   : "
        f"{len(merged_bands)}"
    )

    print(
        f"Final boxes    : "
        f"{len(bboxes)}"
    )

    print("\nResults saved to:")
    print(OUTPUT_DIR)

    print("\nImportant files:")
    print("01_original.png")
    print("02_preprocessed.png")
    print("03_denoised.png")
    print("04_adaptive_binary.png")
    print("05_connected.png")
    print("06_segmentation_overlay.png")
    print("line_crops/")


if __name__ == "__main__":
    main()