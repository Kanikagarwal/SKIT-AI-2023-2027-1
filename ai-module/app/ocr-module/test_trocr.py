from datasets import load_dataset
from ocr_engine import OCREngine
from preprocessing import preprocess_image
import re
import csv
import Levenshtein


def normalize_text(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def calculate_cer(reference, prediction):
    reference = normalize_text(reference)
    prediction = normalize_text(prediction)

    if len(reference) == 0:
        return 0.0

    return Levenshtein.distance(reference, prediction) / len(reference)


def calculate_wer(reference, prediction):
    reference = normalize_text(reference).split()
    prediction = normalize_text(prediction).split()

    if len(reference) == 0:
        return 0.0

    return Levenshtein.distance(reference, prediction) / len(reference)


print("Loading IAM dataset...")

dataset = load_dataset("Teklia/IAM-line")

# Only 20 samples for now
test_dataset = dataset["test"].select(range(20))

print("Test samples:", len(test_dataset))


print("\nLoading TrOCR...")
ocr = OCREngine()

total_cer = 0
total_wer = 0

results = []

print("\nStarting evaluation...\n")


for i, sample in enumerate(test_dataset):

    image = sample["image"]
    ground_truth = sample["text"]

    processed_image = preprocess_image(image)

    prediction = ocr.predict(processed_image)

    cer = calculate_cer(
        ground_truth,
        prediction
    )

    wer = calculate_wer(
        ground_truth,
        prediction
    )

    total_cer += cer
    total_wer += wer

    results.append({
        "index": i,
        "ground_truth": ground_truth,
        "prediction": prediction,
        "cer": cer,
        "wer": wer
    })

    print(f"\nSample {i + 1}/20")
    print("Ground truth :", ground_truth)
    print("Prediction   :", prediction)
    print(f"CER          : {cer:.4f}")
    print(f"WER          : {wer:.4f}")


average_cer = total_cer / len(test_dataset)
average_wer = total_wer / len(test_dataset)


with open(
    "trocr_iam_20_predictions.csv",
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "index",
            "ground_truth",
            "prediction",
            "cer",
            "wer"
        ]
    )

    writer.writeheader()
    writer.writerows(results)


print("\n========== FINAL RESULTS ==========")
print(f"Test samples: {len(test_dataset)}")
print(f"Average CER: {average_cer:.4f}")
print(f"Average WER: {average_wer:.4f}")
print("Saved: trocr_iam_20_predictions.csv")
print("===================================")