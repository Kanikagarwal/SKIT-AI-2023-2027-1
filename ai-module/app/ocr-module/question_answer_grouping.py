
from pathlib import Path
import json
import re

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

INPUT_JSON = DATA_DIR / "all_pages_trocr_results.json"
OUTPUT_JSON = DATA_DIR / "question_answer_groups.json"


# --------------------------------------------------
# QUESTION NUMBER DETECTION
# --------------------------------------------------

MAIN_QUESTION = re.compile(
    r"^\s*(?:Q(?:uestion)?\s*(\d+)|(\d+)\s*[.)])",
    re.IGNORECASE,
)

ATTACHED_SUBPART = re.compile(
    r"^\s*(\d+)\s*\(\s*([a-z]|i{1,3}|iv|v|vi{0,3})\s*\)",
    re.IGNORECASE,
)

SUBPART = re.compile(
    r"^\s*\(\s*([a-z]|i{1,3}|iv|v|vi{0,3})\s*\)",
    re.IGNORECASE,
)


def detect_marker(text):
    """Identify a main question number or subpart."""

    match = ATTACHED_SUBPART.match(text)
    if match:
        return {
            "type": "main_and_subpart",
            "question_number": match.group(1),
            "subpart": match.group(2).lower(),
        }

    match = MAIN_QUESTION.match(text)
    if match:
        number = match.group(1) or match.group(2)
        return {
            "type": "main",
            "question_number": number,
            "subpart": None,
        }

    match = SUBPART.match(text)
    if match:
        return {
            "type": "subpart",
            "subpart": match.group(1).lower(),
        }

    return None


def line_number(line_id):
    match = re.search(r"(\d+)", line_id or "")
    return int(match.group(1)) if match else 0


# --------------------------------------------------
# LOAD OCR RESULTS
# --------------------------------------------------

def main():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(
            f"OCR JSON not found: {INPUT_JSON}\n"
            "Make sure all_pages_trocr_results.json is inside data/."
        )

    with INPUT_JSON.open("r", encoding="utf-8") as file:
        records = json.load(file)

    # Group by page first, so lines from different pages
    # are never accidentally combined.
    pages = {}

    for record in records:
        page = record.get("page", "unknown_page")
        pages.setdefault(page, []).append(record)

    groups = []

    for page, page_records in pages.items():
        page_records.sort(
            key=lambda record: line_number(record.get("line_id", ""))
        )

        current = None

        def save_current():
            nonlocal current

            if current is not None:
                current["answer_text"] = " ".join(
                    item["text"] for item in current["lines"]
                ).strip()

                groups.append(current)
                current = None

        for record in page_records:
            text = (record.get("text") or "").strip()

            if not text:
                continue

            marker = detect_marker(text)

            if marker and marker["type"] in (
                "main",
                "main_and_subpart",
            ):
                save_current()

                current = {
                    "page": page,
                    "question_number": marker["question_number"],
                    "subpart": marker.get("subpart"),
                    "lines": [],
                }

            elif marker and marker["type"] == "subpart":
                if current is not None:
                    current["subpart"] = marker["subpart"]

            if current is not None:
                current["lines"].append({
                    "line_id": record.get("line_id", ""),
                    "text": text,
                })

        save_current()

    # --------------------------------------------------
    # SAVE RESULTS
    # --------------------------------------------------

    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(groups, file, ensure_ascii=False, indent=2)

    print("OCR lines loaded:", len(records))
    print("Question groups created:", len(groups))
    print("Output saved to:", OUTPUT_JSON)

    for group in groups[:10]:
        print(
            f"\nPage: {group['page']} | "
            f"Question: {group['question_number']} | "
            f"Subpart: {group['subpart']}"
        )
        print("Grouped text:", group["answer_text"][:200])


if __name__ == "__main__":
    main()
