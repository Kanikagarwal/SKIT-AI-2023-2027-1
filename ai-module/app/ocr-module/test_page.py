import os
import sys
import cv2

# Import modules from app/ocr_module/
from preprocessing import ImagePreprocessor
from line_segmentation import LineSegmenter


def main():
    print("=" * 65)
    print("🚀 PIPELINE TEST: ImagePreprocessor + LineSegmenter")
    print("=" * 65)

    # 1. Path to your handwritten notebook photo in data/
    image_path = "C:/Users/Lenovo/Desktop/EvalAI/ai-module/data/page.jpg" 

    # Verify your image exists
    if not os.path.exists(image_path):
        print(f"\n❌ ERROR: Image file not found at '{image_path}'")
        print(" 👉 Please place your image in the 'data/' folder and update 'image_path' above.")
        sys.exit(1)

    # Create output directory for results
    output_dir = "data/outputs"
    os.makedirs(output_dir, exist_ok=True)

    # 2. Run ImagePreprocessor
    print(f"\n[1/2] Loading and preprocessing '{image_path}'...")
    preprocessor = ImagePreprocessor(target_width=1200, enable_deskew=True)
    cleaned_page = preprocessor.process([image_path], handwriting_mode=True)
    
    preprocessed_save_path = os.path.join(output_dir, "01_preprocessed_page.png")
    cv2.imwrite(preprocessed_save_path, cleaned_page)
    print("  ✅ ImagePreprocessor finished!")
    print(f"  📁 Saved preprocessed page to: '{preprocessed_save_path}'")

    # 3. Run LineSegmenter
    print("\n[2/2] Running LineSegmenter...")
    segmenter = LineSegmenter(min_line_height=15, padding=5)

    # Erase background notebook lines & extract bounding boxes
    bboxes, clean_page_no_rules = segmenter.process(cleaned_page, remove_lines=True)
    print(f"  ✅ LineSegmenter detected {len(bboxes)} text line(s).")

    # Crop individual line image slices
    line_crops = segmenter.crop_lines(clean_page_no_rules, bboxes)
    for i, crop in enumerate(line_crops, start=1):
        crop_path = os.path.join(output_dir, f"line_crop_{i}.png")
        cv2.imwrite(crop_path, crop)

    # Save visual verification overlay
    overlay_path = os.path.join(output_dir, "02_line_segmentation_overlay.png")
    segmenter.draw_visual_overlay(clean_page_no_rules, bboxes, output_path=overlay_path)

    print(f"  📁 Saved green overlay to: '{overlay_path}'")
    print(f"  📁 Saved {len(line_crops)} cropped line images into '{output_dir}/'")

    print("\n" + "=" * 65)
    print("🎉 TEST COMPLETED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    main()