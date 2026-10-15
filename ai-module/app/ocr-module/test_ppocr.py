
from pathlib import Path
from paddleocr import TextRecognition

CROP_DIR = Path(
    r"C:\Users\Lenovo\Desktop\EvalAI\ai-module\app\ocr-module\data\dbnet_lines_polygon"
)

OUTPUT_FILE = CROP_DIR / "ppocrv5_results.txt"


def main():
    if not CROP_DIR.exists():
        raise FileNotFoundError(f"Crop folder not found: {CROP_DIR}")

    crop_paths = sorted(CROP_DIR.glob("line_*.png"))

    if not crop_paths:
        raise FileNotFoundError(f"No line crops found in {CROP_DIR}")

    print(f"Found {len(crop_paths)} crops")
    print("Loading PP-OCRv5 English recognition model...")

    recognizer = TextRecognition(
        model_name="en_PP-OCRv5_mobile_rec"
    )

    results_text = []

    for index, crop_path in enumerate(crop_paths, start=1):
        try:
            predictions = recognizer.predict(input=str(crop_path))

            recognized_text = ""

            for result in predictions:
                data = result.json

                if callable(data):
                    data = data()

                if isinstance(data, dict):
                    res = data.get("res", data)
                    if isinstance(res, dict):
                        recognized_text = str(
                            res.get("rec_text", "")
                        )

            print(f"\n[{index}/{len(crop_paths)}] {crop_path.name}")
            print(f"PP-OCRv5: {recognized_text}")

            results_text.append(
                f"{crop_path.name}\n{recognized_text}\n"
            )

        except Exception as error:
            print(f"Error on {crop_path.name}: {error}")
            results_text.append(
                f"{crop_path.name}\n[ERROR: {error}]\n"
            )

    OUTPUT_FILE.write_text(
        "\n".join(results_text),
        encoding="utf-8"
    )

    print(f"\nResults saved to:\n{OUTPUT_FILE}")


if __name__ == "__main__":
    main()
