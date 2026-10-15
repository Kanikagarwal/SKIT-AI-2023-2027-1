
import json
import cv2
import numpy as np
from pathlib import Path

folder = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\data\outputs\exam_test\Student_1"
)

image_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\IMG_20261006_162510_preprocessed.png"
)
json_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\IMG_20261006_162510_preprocessed_segmentation.json"
)
output_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\IMG_20261006_162510_preprocessed_visualization.png"
)

image = cv2.imread(str(image_path))
if image is None:
    raise FileNotFoundError(f"Could not read image: {image_path}")

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Draw each detected baseline and its boundary.
for index, line in enumerate(data.get("lines", []), start=1):
    baseline = np.array(line.get("baseline", []), dtype=np.int32)
    boundary = np.array(line.get("boundary", []), dtype=np.int32)

    if len(boundary) >= 3:
        cv2.polylines(
            image, [boundary.reshape((-1, 1, 2))],
            True, (0, 200, 0), 2
        )

    if len(baseline) >= 2:
        cv2.polylines(
            image, [baseline.reshape((-1, 1, 2))],
            False, (0, 0, 255), 4
        )

        x, y = baseline[0]
        cv2.putText(
            image, str(index), (int(x), max(25, int(y) - 8)),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2
        )

cv2.imwrite(str(output_path), image)

print(f"Detected lines: {len(data.get('lines', []))}")
print(f"Visualization saved to: {output_path}")
