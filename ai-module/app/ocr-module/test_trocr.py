from datasets import load_dataset
from ocr_engine import OCREngine
from preprocessing import preprocess_image
import re


def normalize_text(text):
    """Normalize text for fair comparison."""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def calculate_cer(reference, prediction):
    """Calculate Character Error Rate."""
    import Levenshtein

    reference = normalize_text(reference)
    prediction = normalize_text(prediction)

    if len(reference) == 0:
        return 0.0

    distance = Levenshtein.distance(reference, prediction)

    return distance / len(reference)


def calculate_wer(reference, prediction):
    """Calculate Word Error Rate."""
    import Levenshtein

    reference = normalize_text(reference).split()
    prediction = normalize_text(prediction).split()

    if len(reference) == 0:
        return 0.0

    distance = Levenshtein.distance(reference, prediction)

    return distance / len(reference)


print("Loading IAM dataset...")
dataset = load_dataset("Teklia/IAM-line")

test_dataset = dataset["test"].select(range(20))

print("Test samples:", len(test_dataset))


ocr = OCREngine()

total_cer = 0
total_wer = 0

print("\nStarting evaluation...\n")

for i, sample in enumerate(test_dataset):

    image = sample["image"]
    ground_truth = sample["text"]

    
    processed_image = preprocess_image(image)

    
    prediction = ocr.predict(processed_image)

    
    cer = calculate_cer(ground_truth, prediction)
    wer = calculate_wer(ground_truth, prediction)

    total_cer += cer
    total_wer += wer

    if (i + 1) % 100 == 0:
        print(
            f"Processed {i + 1}/{len(test_dataset)} "
            f"| CER: {cer:.4f} "
            f"| WER: {wer:.4f}"
        )


average_cer = total_cer / len(test_dataset)
average_wer = total_wer / len(test_dataset)


print(f"Test samples: {len(test_dataset)}")
print(f"Average CER: {average_cer:.4f}")
print(f"Average WER: {average_wer:.4f}")