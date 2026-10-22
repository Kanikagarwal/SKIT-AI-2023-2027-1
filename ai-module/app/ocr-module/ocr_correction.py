
from pathlib import Path
import json
import re
import importlib.resources

from symspellpy import SymSpell, Verbosity


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

INPUT_JSON = DATA_DIR / "all_pages_trocr_results.json"
OUTPUT_JSON = DATA_DIR / "automatic_corrected_results.json"


# --------------------------------------------------
# SPELLING DETECTOR
# --------------------------------------------------

def build_spell_checker():
    spell = SymSpell(
        max_dictionary_edit_distance=2,
        prefix_length=7
    )

    dictionary_path = (
        importlib.resources.files("symspellpy")
        / "frequency_dictionary_en_82_765.txt"
    )

    loaded = spell.load_dictionary(
        str(dictionary_path),
        term_index=0,
        count_index=1
    )

    if not loaded:
        raise RuntimeError("Could not load spelling dictionary.")

    return spell


# --------------------------------------------------
# DETECT POSSIBLE ERRORS
# --------------------------------------------------

def detect_suspicious_words(text, spell):
    suspicious = []

    for match in re.finditer(r"[A-Za-z]+(?:'[A-Za-z]+)?", text):
        word = match.group()
        suggestions = spell.lookup(
            word.lower(),
            Verbosity.CLOSEST,
            max_edit_distance=2,
            include_unknown=True
        )

        # The dictionary may not contain names or subject terms.
        # Flag only when the original word is absent and
        # there are plausible dictionary alternatives.
        if not any(
            item.term.lower() == word.lower()
            for item in suggestions
        ):
            candidates = [
                item.term for item in suggestions
                if item.term.lower() != word.lower()
            ]

            if candidates:
                suspicious.append({
                    "word": word,
                    "start": match.start(),
                    "end": match.end(),
                    "candidates": candidates[:5],
                    "status": "needs_review"
                })

    return suspicious


# --------------------------------------------------
# PROCESS OCR RESULTS
# --------------------------------------------------

def main():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(
            f"OCR results not found: {INPUT_JSON}"
        )

    with INPUT_JSON.open("r", encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list):
        raise ValueError("Expected a JSON list of OCR records.")

    spell = build_spell_checker()
    output = []
    flagged_words = 0

    for record in records:
        original_text = record.get("text", "")

        suspicious = detect_suspicious_words(
            original_text,
            spell
        )

        flagged_words += len(suspicious)

        output.append({
            "page": record.get("page"),
            "line_id": record.get("line_id"),
            "original_text": original_text,
            "suggested_text": None,
            "suspicious_words": suspicious,
            "final_text": original_text,
            "status": (
                "needs_review" if suspicious
                else "not_flagged"
            )
        })

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(output, file, ensure_ascii=False, indent=2)

    flagged_lines = sum(
        1 for item in output
        if item["status"] == "needs_review"
    )

    print("Automatic OCR error detection completed.")
    print(f"Total lines processed: {len(output)}")
    print(f"Lines flagged for review: {flagged_lines}")
    print(f"Words flagged for review: {flagged_words}")
    print(f"Output saved to: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
