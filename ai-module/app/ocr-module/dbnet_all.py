
from pathlib import Path
import json
import time

import cv2
import numpy as np
import paddle
from paddleocr import TextDetection


# ============================================================
# DEFAULT CONFIGURATION
# ============================================================

BATCH_SIZE = 2
CROP_PADDING = 3
SAVE_VISUALIZATIONS = False
RESUME = True


# ============================================================
# LOAD PADDLEOCR RESULT
# ============================================================

def get_result_dict(prediction):

    if hasattr(prediction, "json"):
        data = prediction.json
    else:
        data = prediction

    if isinstance(data, str):
        data = json.loads(data)

    if not isinstance(data, dict):
        return {}

    if "res" in data:
        data = data["res"]

    return data


def extract_polygons(prediction):

    data = get_result_dict(prediction)

    polygons = data.get("dt_polys", [])

    if polygons is None:
        return [], []

    polygons = np.asarray(polygons)

    if polygons.size == 0:
        return [], []

    polygons = polygons.reshape(-1, 4, 2)

    scores = data.get("dt_scores", [])

    if scores is None:
        scores = []

    if len(scores) != len(polygons):
        scores = [None] * len(polygons)

    return polygons, scores


# ============================================================
# ORDER QUADRILATERAL POINTS
# ============================================================

def order_points(points):

    points = np.asarray(points, dtype=np.float32)

    rect = np.zeros((4, 2), dtype=np.float32)

    sums = points.sum(axis=1)
    diffs = np.diff(points, axis=1).reshape(-1)

    rect[0] = points[np.argmin(sums)]
    rect[2] = points[np.argmax(sums)]

    rect[1] = points[np.argmin(diffs)]
    rect[3] = points[np.argmax(diffs)]

    return rect


# ============================================================
# SORT POLYGONS IN READING ORDER
# ============================================================

def sort_polygons(polygons, scores):

    items = []

    for polygon, score in zip(polygons, scores):

        polygon = np.asarray(
            polygon,
            dtype=np.float32
        )

        center_y = float(np.mean(polygon[:, 1]))
        center_x = float(np.mean(polygon[:, 0]))

        items.append(
            (center_y, center_x, polygon, score)
        )

    items.sort(
        key=lambda item: (
            item[0],
            item[1]
        )
    )

    return [
        (item[2], item[3])
        for item in items
    ]


# ============================================================
# CROP DETECTED TEXT REGION
# ============================================================

def crop_polygon(image, polygon, crop_padding=CROP_PADDING):

    height, width = image.shape[:2]

    rect = order_points(polygon)

    rect[:, 0] = np.clip(
        rect[:, 0],
        0,
        width - 1
    )

    rect[:, 1] = np.clip(
        rect[:, 1],
        0,
        height - 1
    )

    tl, tr, br, bl = rect

    crop_width = int(
        max(
            np.linalg.norm(br - bl),
            np.linalg.norm(tr - tl)
        )
    )

    crop_height = int(
        max(
            np.linalg.norm(tr - br),
            np.linalg.norm(tl - bl)
        )
    )

    if crop_width < 2 or crop_height < 2:
        return None

    destination = np.array(
        [
            [0, 0],
            [crop_width - 1, 0],
            [crop_width - 1, crop_height - 1],
            [0, crop_height - 1]
        ],
        dtype=np.float32
    )

    matrix = cv2.getPerspectiveTransform(
        rect,
        destination
    )

    crop = cv2.warpPerspective(
        image,
        matrix,
        (crop_width, crop_height),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )

    if crop_padding > 0:

        crop = cv2.copyMakeBorder(
            crop,
            crop_padding,
            crop_padding,
            crop_padding,
            crop_padding,
            cv2.BORDER_CONSTANT,
            value=255
        )

    return crop


# ============================================================
# CHECK COMPLETED PAGE
# ============================================================

def page_is_complete(page_output_dir):

    json_path = (
        page_output_dir /
        "detected_polygons.json"
    )

    if not json_path.exists():
        return False

    try:

        with open(
            json_path,
            "r",
            encoding="utf-8"
        ) as f:

            data = json.load(f)

        for item in data.get("detections", []):

            crop_path = (
                page_output_dir /
                item["crop_file"]
            )

            if not crop_path.exists():
                return False

        return True

    except Exception:
        return False


# ============================================================
# PROCESS ONE PAGE
# ============================================================

def process_page(
    image_path,
    prediction,
    output_dir,
    crop_padding=CROP_PADDING,
    save_visualizations=SAVE_VISUALIZATIONS
):

    start_time = time.time()

    image = cv2.imread(
        str(image_path),
        cv2.IMREAD_GRAYSCALE
    )

    if image is None:

        raise ValueError(
            f"Could not read image: {image_path}"
        )

    page_output_dir = (
        output_dir /
        f"{image_path.stem}_dbnet_lines"
    )

    page_output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    for old_crop in page_output_dir.glob("line_*.png"):
        old_crop.unlink()

    polygons, scores = extract_polygons(prediction)

    sorted_items = sort_polygons(
        polygons,
        scores
    )

    detections = []

    visualization = None

    if save_visualizations:

        visualization = cv2.cvtColor(
            image,
            cv2.COLOR_GRAY2BGR
        )

    crop_index = 0

    for polygon, score in sorted_items:

        crop = crop_polygon(
            image,
            polygon,
            crop_padding
        )

        if crop is None:
            continue

        crop_index += 1

        crop_name = f"line_{crop_index:04d}.png"

        crop_path = (
            page_output_dir /
            crop_name
        )

        success = cv2.imwrite(
            str(crop_path),
            crop
        )

        if not success:

            raise IOError(
                f"Failed to save crop: {crop_path}"
            )

        detections.append(
            {
                "crop_file": crop_name,
                "polygon": np.asarray(
                    polygon
                ).tolist(),
                "confidence": (
                    float(score)
                    if score is not None
                    else None
                )
            }
        )

        if visualization is not None:

            cv2.polylines(
                visualization,
                [
                    np.asarray(
                        polygon,
                        dtype=np.int32
                    )
                ],
                True,
                (0, 255, 0),
                2
            )

    metadata = {
        "page_name": image_path.name,
        "image_width": int(image.shape[1]),
        "image_height": int(image.shape[0]),
        "total_detections": len(detections),
        "detections": detections
    }

    json_path = (
        page_output_dir /
        "detected_polygons.json"
    )

    temporary_json = (
        page_output_dir /
        "detected_polygons.tmp"
    )

    with open(
        temporary_json,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            metadata,
            f,
            indent=2,
            ensure_ascii=False
        )

    temporary_json.replace(json_path)

    if visualization is not None:

        visualization_path = (
            output_dir /
            f"{image_path.stem}_dbnet_visualization.png"
        )

        cv2.imwrite(
            str(visualization_path),
            visualization
        )

    elapsed = time.time() - start_time

    print(
        f"{image_path.name} | "
        f"Crops: {len(detections)} | "
        f"Time: {elapsed:.2f}s"
    )

    return page_output_dir, len(detections)


# ============================================================
# MAIN DBNET FALLBACK FUNCTION
# ============================================================

def run_dbnet_fallback(
    input_dir,
    output_dir,
    empty_pages_json,
    device="gpu",
    batch_size=BATCH_SIZE,
    crop_padding=CROP_PADDING,
    save_visualizations=SAVE_VISUALIZATIONS,
    resume=RESUME
):

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    empty_pages_json = Path(empty_pages_json)

    # --------------------------------------------------------
    # VALIDATE INPUT PATHS
    # --------------------------------------------------------

    if not input_dir.exists():

        raise FileNotFoundError(
            f"Input directory not found: {input_dir}"
        )

    if not empty_pages_json.exists():

        raise FileNotFoundError(
            f"Empty pages file not found: {empty_pages_json}"
        )

    if batch_size < 1:

        raise ValueError(
            "batch_size must be at least 1."
        )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------------
    # GPU / CPU CONFIGURATION
    # --------------------------------------------------------

    if device == "gpu":

        if not paddle.is_compiled_with_cuda():

            raise RuntimeError(
                "GPU-enabled PaddlePaddle is not installed. "
                "Install a compatible GPU version or use device='cpu'."
            )

    elif device != "cpu":

        raise ValueError(
            "device must be either 'gpu' or 'cpu'."
        )

    paddle.set_device(device)

    print("Paddle version:", paddle.__version__)
    print("Device:", paddle.device.get_device())

    # --------------------------------------------------------
    # LOAD EMPTY PAGES
    # --------------------------------------------------------

    with open(
        empty_pages_json,
        "r",
        encoding="utf-8"
    ) as f:

        empty_pages = json.load(f)

    if not isinstance(empty_pages, list):

        raise ValueError(
            "empty_pages.json must contain a JSON list."
        )

    if not empty_pages:

        print(
            "No empty pages found. "
            "DBNet fallback is not required."
        )

        return {
            "status": "skipped",
            "fallback_pages": 0,
            "pages_processed": 0,
            "total_crops": 0,
            "output_dir": str(output_dir)
        }

    page_paths = []

    for item in empty_pages:

        if item.get("status", "empty") != "empty":
            continue

        page_name = item.get("page_name")

        if not page_name:

            raise ValueError(
                "An empty page entry is missing page_name."
            )

        image_path = input_dir / page_name

        if not image_path.exists():

            raise FileNotFoundError(
                f"Input page not found: {image_path}"
            )

        page_paths.append(image_path)

    if not page_paths:

        print("No eligible empty pages found.")

        return {
            "status": "skipped",
            "fallback_pages": 0,
            "pages_processed": 0,
            "total_crops": 0,
            "output_dir": str(output_dir)
        }

    print("\n========== DBNET INPUT ==========")
    print("Pages requiring fallback:", len(page_paths))

    for path in page_paths:
        print(path.name)

    print("=================================")

    # --------------------------------------------------------
    # LOAD DBNET MODEL ONCE
    # --------------------------------------------------------

    print("\nLoading DBNet text detection model...")

    detector = TextDetection(device=device)

    print("DBNet model loaded successfully.")

    # --------------------------------------------------------
    # SKIP COMPLETED PAGES
    # --------------------------------------------------------

    pending_pages = []

    for image_path in page_paths:

        page_output_dir = (
            output_dir /
            f"{image_path.stem}_dbnet_lines"
        )

        if resume and page_is_complete(page_output_dir):

            print(
                "Already completed:",
                image_path.name
            )

        else:

            pending_pages.append(image_path)

    # --------------------------------------------------------
    # BATCH PROCESSING
    # --------------------------------------------------------

    total_start = time.time()

    total_processed = 0
    total_crops = 0

    for batch_start in range(
        0,
        len(pending_pages),
        batch_size
    ):

        batch_paths = pending_pages[
            batch_start:
            batch_start + batch_size
        ]

        print("\n================================")
        print("New batch")

        for path in batch_paths:
            print(path.name)

        batch_start_time = time.time()

        try:

            predictions = list(
                detector.predict(
                    [
                        str(path)
                        for path in batch_paths
                    ],
                    batch_size=len(batch_paths)
                )
            )

            if len(predictions) != len(batch_paths):

                raise RuntimeError(
                    "Prediction count does not match batch size."
                )

        except Exception as batch_error:

            print(
                "Batch inference failed:",
                str(batch_error)
            )

            print("Retrying pages individually...")

            predictions = []

            for path in batch_paths:

                single_prediction = list(
                    detector.predict(
                        str(path),
                        batch_size=1
                    )
                )

                if len(single_prediction) != 1:

                    raise RuntimeError(
                        f"Unexpected prediction result for {path}"
                    )

                predictions.append(
                    single_prediction[0]
                )

        inference_time = (
            time.time() - batch_start_time
        )

        print(
            "Inference time:",
            round(inference_time, 2),
            "seconds"
        )

        for image_path, prediction in zip(
            batch_paths,
            predictions
        ):

            output_folder, crop_count = process_page(
                image_path,
                prediction,
                output_dir,
                crop_padding,
                save_visualizations
            )

            total_processed += 1
            total_crops += crop_count

        print(
            f"Completed: {total_processed}/"
            f"{len(pending_pages)}"
        )

    # --------------------------------------------------------
    # FINAL SUMMARY
    # --------------------------------------------------------

    total_time = time.time() - total_start

    print("\n========== DBNET SUMMARY ==========")

    print("Fallback pages:", len(page_paths))
    print("Pages processed:", total_processed)
    print("Total crops:", total_crops)

    print(
        "Average crops per page:",
        round(
            total_crops / max(total_processed, 1),
            2
        )
    )

    print(
        "Total time:",
        round(total_time / 60, 2),
        "minutes"
    )

    print(
        "Average time per page:",
        round(
            total_time / max(total_processed, 1),
            2
        ),
        "seconds"
    )

    print("DBNet output:", output_dir)
    print("===================================")

    return {
        "status": "completed",
        "fallback_pages": len(page_paths),
        "pages_processed": total_processed,
        "total_crops": total_crops,
        "output_dir": str(output_dir),
        "total_time_seconds": round(total_time, 2)
    }


# ============================================================
# OPTIONAL STANDALONE KAGGLE EXECUTION
# ============================================================

if __name__ == "__main__":

    INPUT_DIR = Path(
        "/kaggle/input/datasets/diyavee/english-processed-zip/ENGLISH_processed"
    )

    EMPTY_PAGES_JSON = Path(
        "/kaggle/working/outputs/full_page_ocr/empty_pages.json"
    )

    OUTPUT_DIR = Path(
        "/kaggle/working/DBNet_Output"
    )

    result = run_dbnet_fallback(
        input_dir=INPUT_DIR,
        output_dir=OUTPUT_DIR,
        empty_pages_json=EMPTY_PAGES_JSON,
        device="gpu"
    )

    print("\nReturned result:")
    print(json.dumps(result, indent=2))
