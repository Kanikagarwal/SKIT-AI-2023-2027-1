from pathlib import Path

import cv2
import numpy as np
from paddleocr import TextDetection


image_path = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\data\outputs\exam_test\Student_1\page_03_preprocessed.png"
)

output_dir = image_path.parent / "page_03_dbnet_lines"
visualization_path = image_path.parent / "page_03_dbnet_visualization.png"

PADDING = 3

def order_corners(points):
    """Order four polygon corners: top-left, top-right,
    bottom-right, bottom-left.
    """
    points = np.asarray(points, dtype=np.float32).reshape(4, 2)

    sums = points.sum(axis=1)
    differences = points[:, 1] - points[:, 0]

    top_left = points[np.argmin(sums)]
    bottom_right = points[np.argmax(sums)]
    top_right = points[np.argmin(differences)]
    bottom_left = points[np.argmax(differences)]

    return np.array(
        [top_left, top_right, bottom_right, bottom_left],
        dtype=np.float32,
    )

def crop_polygon(image, polygon, padding=3):
    """Perspective-crop a quadrilateral detection."""
    corners = order_corners(polygon)

    top_left, top_right, bottom_right, bottom_left = corners

    width_top = np.linalg.norm(top_right - top_left)
    width_bottom = np.linalg.norm(bottom_right - bottom_left)
    height_left = np.linalg.norm(bottom_left - top_left)
    height_right = np.linalg.norm(bottom_right - top_right)

    crop_width = max(1, int(round(max(width_top, width_bottom))))
    crop_height = max(1, int(round(max(height_left, height_right))))

    destination = np.array(
        [
            [0, 0],
            [crop_width - 1, 0],
            [crop_width - 1, crop_height - 1],
            [0, crop_height - 1],
        ],
        dtype=np.float32,
    )

    transform = cv2.getPerspectiveTransform(corners, destination)

    cropped = cv2.warpPerspective(
        image,
        transform,
        (crop_width, crop_height),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )

    # Add a small white margin for OCR readability.
    if padding > 0:
        cropped = cv2.copyMakeBorder(
            cropped,
            padding,
            padding,
            padding,
            padding,
            cv2.BORDER_CONSTANT,
            value=(255, 255, 255),
        )

    return cropped

def main():
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Input image: {image_path}")
    print("Loading text detection model...")

    detector = TextDetection()

    print("Detecting text regions...")
    results = detector.predict(str(image_path))

    detections = []

    for result in results:
        if hasattr(result, "json"):
            data = result.json
            if callable(data):
                data = data()
        elif isinstance(result, dict):
            data = result
        else:
            continue

        if isinstance(data, dict) and "res" in data:
            data = data["res"]

        if not isinstance(data, dict):
            continue

        for polygon in data.get("dt_polys", []):
            points = np.asarray(polygon, dtype=np.float32).reshape(-1, 2)

            if len(points) != 4:
                print("Skipping a detection that does not have four corners.")
                continue

            detections.append({
                "points": points,
                "top": float(points[:, 1].min()),
                "left": float(points[:, 0].min()),
            })

    # Approximate reading order: top to bottom, then left to right.
    detections.sort(key=lambda item: (item["top"], item["left"]))

    visualization = image.copy()
    saved_count = 0

    for index, detection in enumerate(detections, start=1):
        polygon = detection["points"]

        crop = crop_polygon(image, polygon, padding=PADDING)

        if crop.size == 0:
            continue

        crop_path = output_dir / f"line_{index:03d}.png"

        if not cv2.imwrite(str(crop_path), crop):
            print(f"Failed to save crop: {crop_path}")
            continue

        cv2.polylines(
            visualization,
            [polygon.astype(np.int32).reshape(-1, 1, 2)],
            isClosed=True,
            color=(0, 255, 0),
            thickness=2,
        )

        saved_count += 1

    cv2.imwrite(str(visualization_path), visualization)

    print(f"\nDetected regions: {len(detections)}")
    print(f"Saved polygon crops: {saved_count}")
    print(f"Crop folder: {output_dir}")
    print(f"Visualization: {visualization_path}")

if __name__ == "__main__":
    main()
