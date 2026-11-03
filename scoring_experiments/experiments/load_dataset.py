import re
from pathlib import Path
import pandas as pd


# --------------------------------------------------
# 1. PROJECT PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = (
    BASE_DIR
    / "datasets"
    / "raw"
    / "cleaned-oe-00001.parquet"
)


# --------------------------------------------------
# 2. REQUIRED DATASET COLUMNS
# --------------------------------------------------

REQUIRED_COLUMNS = [
    "id",
    "question",
    "instructor_answer",
    "student_answer",
    "score_grader_1",
    "score_grader_2",
    "score_avg",
]


# --------------------------------------------------
# 3. LOAD DATASET
# --------------------------------------------------

def load_dataset(path=DATASET_PATH):
    """
    Load the UNT open-ended short answer grading dataset.

    Returns:
        pandas DataFrame containing the dataset.
    """

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {path}"
        )

    data = pd.read_parquet(path)

    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if data.empty:
        raise ValueError("Dataset is empty.")

    return data


# --------------------------------------------------
# 4. VALIDATE DATASET
# --------------------------------------------------

def validate_dataset(data):
    """
    Validate dataset fields and human grading scores.

    Individual grader scores may use different maximum
    scales (5 or 10).

    score_avg is the normalized reference score,
    which must remain between 0 and 5.
    """

    text_columns = [
        "id",
        "question",
        "instructor_answer",
        "student_answer",
    ]

    # Check missing text values
    for column in text_columns:

        if data[column].isna().any():
            raise ValueError(
                f"Missing values found in {column}."
            )

        if data[column].astype(str).str.strip().eq("").any():
            raise ValueError(
                f"Empty values found in {column}."
            )

    # Validate individual grader scores
    grader_columns = [
        "score_grader_1",
        "score_grader_2",
    ]

    for column in grader_columns:

        if data[column].isna().any():
            raise ValueError(
                f"Missing scores found in {column}."
            )

        if (data[column] < 0).any():
            raise ValueError(
                f"Negative scores found in {column}."
            )

    # Validate normalized average score
    if data["score_avg"].isna().any():
        raise ValueError(
            "Missing average human scores."
        )

    if not data["score_avg"].between(0, 5).all():
        raise ValueError(
            "Average human scores must be between 0 and 5."
        )

    return True


# --------------------------------------------------
# 5. GENERATE DATASET REPORT
# --------------------------------------------------

def generate_dataset_report(data):
    """Generate descriptive statistics for the dataset."""

    question_ids = data["id"].astype(str).str.extract(
        r"^(E\d+\.Q\d+)\."
    )[0]

    return {
        "total_responses": len(data),
        "unique_questions": int(question_ids.nunique()),
        "average_human_score": round(
            float(data["score_avg"].mean()), 3
        ),
        "grader_1_average": round(
            float(data["score_grader_1"].mean()), 3
        ),
        "grader_2_average": round(
            float(data["score_grader_2"].mean()), 3
        ),
        "grader_1_maximum": float(
            data["score_grader_1"].max()
        ),
        "grader_2_maximum": float(
            data["score_grader_2"].max()
        ),
        "responses_with_grader_1_score_above_5": int(
            (data["score_grader_1"] > 5).sum()
        ),
        "responses_with_grader_2_score_above_5": int(
            (data["score_grader_2"] > 5).sum()
        ),
        "missing_values": int(
            data.isna().sum().sum()
        ),
    }


# --------------------------------------------------
# 6. MAIN EXECUTION
# --------------------------------------------------

if __name__ == "__main__":

    try:
        dataset = load_dataset()

        validate_dataset(dataset)

        report = generate_dataset_report(dataset)

        print("\nUNT DATASET LOADED SUCCESSFULLY")
        print("=" * 45)

        for key, value in report.items():
            print(f"{key}: {value}")

        print("\nDATASET VALIDATION: PASSED")

    except (FileNotFoundError, ValueError) as error:

        print("\nDATASET VALIDATION FAILED")
        print(error)
        raise
