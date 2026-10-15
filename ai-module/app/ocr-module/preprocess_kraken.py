
import cv2
from pathlib import Path
from preprocessing import ImagePreprocessor

input_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\IMG_20261006_162510.jpg"
)

output_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\IMG_20261006_162510_preprocessed.png"
)

preprocessor = ImagePreprocessor(
    target_width=1200,
    enable_deskew=True
)

processed = preprocessor.process_single_image(str(input_path))

output_path.parent.mkdir(parents=True, exist_ok=True)

if not cv2.imwrite(str(output_path), processed):
    raise RuntimeError("Could not save the preprocessed image.")

print("Preprocessing completed.")
print(f"Image size: {processed.shape[1]} x {processed.shape[0]}")
print(f"Saved to: {output_path}")
