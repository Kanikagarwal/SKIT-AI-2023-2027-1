from pathlib import Path
import json

import cv2
import numpy as np
from paddleocr import TextDetection

# --------------------------------------------------
# PATHS
# --------------------------------------------------

DATA_DIR = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\Social_Science_processed"
)

# One output folder per page will be created inside DATA_DIR.
# Example: page_01_dbnet_lines/

# --------------------------------------------------
# HELPER: CONVERT PADDLEOCR OUTPUT TO A DICTIONARY
# --------------------------------------------------

def get_result_dict(result):
    """
    PaddleOCR 3.x results may be result objects or dictionaries.
    Convert them into a dictionary so we can read dt_polys.
    """
    if isinstance(result, dict):
        return result

    # PaddleOCR result objects commonly expose a json property.
    json_data = getattr(result, "json", None)

    if callable(json_data):
        json_data = json_data()

    if isinstance(json_data, dict):
        return json_data

    raise TypeError(
        f"Unsupported PaddleOCR result type: {type(result)}"
    )

def extract_polygons(result):
    """
    Extract detected text polygons from PaddleOCR output.
    Handles the common PaddleOCR 3.x result structure.
    """
    data = get_result_dict(result)

    # Some versions wrap the actual result in "res".
    inner = data.get("res", data)

    if not isinstance(inner, dict):
        raise ValueError("Unexpected PaddleOCR result structure.")

    polygons = inner.get("dt_polys")

    if polygons is None:
        polygons = inner.get("polys")

    if polygons is None:
        print("Warning: No dt_polys field found.")
        print("Available keys:", list(inner.keys()))
        return []

    return list(polygons)

# --------------------------------------------------
# HELPER: ORDER POLYGON POINTS
# --------------------------------------------------

def order_points(points):
    """
    Return four points in top-left, top-right,
    bottom-right, bottom-left order.
    """
    points = np.asarray(points, dtype=np.float32).reshape(4, 2)

    sums = points.sum(axis=1)
    differences = np.diff(points, axis=1).reshape(-1)

    top_left = points[np.argmin(sums)]
    bottom_right = points[np.argmax(sums)]
    top_right = points[np.argmin(differences)]
    bottom_left = points[np.argmax(differences)]

    return np.array(
        [top_left, top_right, bottom_right, bottom_left],
        dtype=np.float32
    )

# --------------------------------------------------
# HELPER: CROP A TEXT REGION USING ITS POLYGON
# --------------------------------------------------

def crop_polygon(image, polygon, padding=3):
    """
    Perspective-crop a detected text region.
    Returns the crop, or None if the polygon is invalid.
    """
    points = np.asarray(polygon, dtype=np.float32).reshape(-1, 2)

    if len(points) != 4:
        # This script expects quadrilateral text detections.
        return None

    rect = order_points(points)

    top_left, top_right, bottom_right, bottom_left = rect

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
        dtype=np.float32
    )

    matrix = cv2.getPerspectiveTransform(rect, destination)

    crop = cv2.warpPerspective(
        image,
        matrix,
        (crop_width, crop_height),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )

    # Small white border helps keep handwriting near the crop edge.
    if padding > 0:
        crop = cv2.copyMakeBorder(
            crop,
            padding,
            padding,
            padding,
            padding,
            cv2.BORDER_CONSTANT,
            value=255 if crop.ndim == 2 else (255, 255, 255)
        )

    return crop

# --------------------------------------------------
# HELPER: SORT DETECTIONS TOP TO BOTTOM
# --------------------------------------------------

def sort_polygons(polygons):
    """
    Sort by vertical center, then horizontal position.
    This gives a reasonable reading order for mostly
    single-column handwritten answer sheets.
    """
    valid = []

    for polygon in polygons:
        try:
            points = np.asarray(polygon, dtype=np.float32).reshape(-1, 2)

            if len(points) < 4 or not np.isfinite(points).all():
                continue

            x_min = float(points[:, 0].min())
            y_min = float(points[:, 1].min())
            y_max = float(points[:, 1].max())
            center_y = (y_min + y_max) / 2.0

            valid.append((center_y, x_min, polygon))

        except (TypeError, ValueError):
            continue

    valid.sort(key=lambda item: (item[0], item[1]))

    return [item[2] for item in valid]

# --------------------------------------------------
# PROCESS ONE PAGE
# --------------------------------------------------

def process_page(detector, image_path):
    print(f"\nProcessing: {image_path.name}")

    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)

    if image is None:
        print(f"ERROR: Could not read {image_path}")
        return

    page_name = image_path.stem.replace("_preprocessed", "")

    output_dir = DATA_DIR / f"{page_name}_dbnet_lines"
    output_dir.mkdir(parents=True, exist_ok=True)

    visualization_path = (
        DATA_DIR / f"{page_name}_dbnet_visualization.png"
    )

    polygons_json_path = output_dir / "detected_polygons.json"

    # Run text detection.
    predictions = detector.predict(str(image_path))

    all_polygons = []

    for prediction in predictions:
        all_polygons.extend(extract_polygons(prediction))

    polygons = sort_polygons(all_polygons)

    # Create a color image for the detection visualization.
    visualization = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    saved_polygons = []
    crop_count = 0

    for polygon_index, polygon in enumerate(polygons, start=1):
        points = np.asarray(polygon, dtype=np.float32).reshape(-1, 2)

        if len(points) < 4 or not np.isfinite(points).all():
            continue

        # Draw the detection polygon.
        integer_points = np.round(points).astype(np.int32)
        cv2.polylines(
            visualization,
            [integer_points],
            isClosed=True,
            color=(0, 255, 0),
            thickness=2
        )

        crop = crop_polygon(image, polygon, padding=3)

        if crop is None or crop.size == 0:
            print(f"Skipping invalid detection {polygon_index}")
            continue

        crop_count += 1
        crop_path = output_dir / f"line_{crop_count:04d}.png"

        if not cv2.imwrite(str(crop_path), crop):
            print(f"WARNING: Could not save {crop_path.name}")
            crop_count -= 1
            continue

        saved_polygons.append(
            {
                "crop_file": crop_path.name,
                "polygon": points.tolist()
            }
        )

    # Save the visualization and polygon metadata.
    if not cv2.imwrite(str(visualization_path), visualization):
        print(f"WARNING: Could not save visualization {visualization_path}")

    with open(polygons_json_path, "w", encoding="utf-8") as file:
        json.dump(saved_polygons, file, indent=2)

    print(f"Detected polygons: {len(polygons)}")
    print(f"Saved text crops: {crop_count}")
    print(f"Crops folder: {output_dir}")
    print(f"Visualization: {visualization_path.name}")

# --------------------------------------------------
# MAIN: PROCESS EVERY PREPROCESSED PAGE
# --------------------------------------------------

def main():
    if not DATA_DIR.exists():
        raise FileNotFoundError(
            f"Input folder does not exist: {DATA_DIR}\n"
            "Run preprocess_pdf.py first."
        )

    image_paths = sorted(
        DATA_DIR.glob("page_*_preprocessed.png")
    )

    if not image_paths:
        raise FileNotFoundError(
            f"No preprocessed page images found in {DATA_DIR}"
        )

    print("=" * 60)
    print("DBNet / PaddleOCR TEXT DETECTION - ALL PAGES")
    print("=" * 60)
    print(f"Pages found: {len(image_paths)}")
    print(f"Input folder: {DATA_DIR}")

    # Initialize the detector once, then reuse it for all pages.
    print("\nLoading PaddleOCR text detector...")
    detector = TextDetection()

    for page_number, image_path in enumerate(image_paths, start=1):
        print(f"\n{'-' * 50}")
        print(f"PAGE {page_number}/{len(image_paths)}")
        print("-" * 50)

        try:
            process_page(detector, image_path)
        except Exception as error:
            print(f"ERROR processing {image_path.name}: {error}")
            print("Continuing to the next page.")

    print("\n" + "=" * 60)
    print("BATCH PROCESSING FINISHED")
    print(f"Check output folders in: {DATA_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
