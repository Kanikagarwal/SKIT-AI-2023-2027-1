
from pathlib import Path
import json
import re

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

INPUT_JSON = (
    BASE_DIR
    / "data"
    / "English_processed"
    / "all_pages_paddleocr_results.json"
)

# Separate output file to protect existing results.
OUTPUT_JSON = (
    BASE_DIR
    / "data"
    / "English_processed"
    / "question_answer_groups_test.json"
)


# --------------------------------------------------
# MAIN QUESTION DETECTION
# --------------------------------------------------

MAIN_QUESTION = re.compile(
    r"^\s*(?:"
    r"Q(?:uestion)?\s*(\d+)"
    r"|"
    r"(\d+)\s*(?:\)\s*\(\s*[a-z]\s*\)|[.)])"
    r")",
    re.IGNORECASE,
)


def detect_main_question(text):
    """
    Detect a main question marker, such as:
    1)
    4)(a)
    5.
    Question 6
    """

    match = MAIN_QUESTION.match(text)

    if match:
        return match.group(1) or match.group(2)

    return None


# --------------------------------------------------
# GROUP QUESTION ANSWERS
# --------------------------------------------------

def main():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(
            f"PaddleOCR results not found:\n{INPUT_JSON}"
        )

    with INPUT_JSON.open("r", encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list):
        raise ValueError(
            "Expected the PaddleOCR JSON to contain a list of records."
        )

    # Organize records by page while preserving their original order.
    pages = {}

    for record in records:
        page = record.get("page", "unknown_page")
        pages.setdefault(page, []).append(record)

    groups = []

    for page, page_records in pages.items():
        current = None

        def save_current():
            nonlocal current

            if current is not None:
                current["answer_text"] = " ".join(
                    line["text"] for line in current["lines"]
                ).strip()

                groups.append(current)
                current = None

        for record in page_records:
            text = (
                record.get("text")
                or record.get("rec_text")
                or ""
            ).strip()

            if not text:
                continue

            question_number = detect_main_question(text)

            # Start a new group only for a main question.
            if question_number is not None:
                save_current()

                current = {
                    "page": page,
                    "question_number": question_number,
                    "lines": [],
                }

            # Keep all lines, including subpart markers,
            # inside the current main-question group.
            if current is not None:
                current["lines"].append({
                    "crop": record.get("crop", ""),
                    "text": text,
                    "confidence": record.get("confidence"),
                })

        # Save the final question on this page.
        save_current()

    # --------------------------------------------------
    # SAVE GROUPED RESULTS
    # --------------------------------------------------

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(
            groups,
            file,
            ensure_ascii=False,
            indent=2,
        )

    print("PaddleOCR lines loaded:", len(records))
    print("Question-answer groups created:", len(groups))
    print("Output saved to:", OUTPUT_JSON)

    # Display a short preview of the results.
    for group in groups[:10]:
        print(
            f"\nPage: {group['page']} | "
            f"Question: {group['question_number']} | "
            f"Lines: {len(group['lines'])}"
        )

        print("Answer:", group["answer_text"][:300])


if __name__ == "__main__":
    main()
