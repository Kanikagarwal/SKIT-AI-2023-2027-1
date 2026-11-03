
from pathlib import Path

import pandas as pd
from sklearn.model_selection import GroupShuffleSplit


BASE_DIR = Path(__file__).resolve().parent.parent

FEATURE_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" / "feature_dataset.csv"
)

OUTPUT_DIR = BASE_DIR / "datasets" / "processed" / "splits"

FEATURE_COLUMNS = [
    "keyword_score",
    "semantic_similarity_score"
]

TARGET_COLUMN = "human_score"

GROUP_COLUMN = "question_text"


def split_dataset(data=None):

    # Load the generated feature dataset
    if data is None:
        if not FEATURE_DATASET_PATH.exists():
            raise FileNotFoundError(
                f"Feature dataset not found: {FEATURE_DATASET_PATH}"
            )

        data = pd.read_csv(FEATURE_DATASET_PATH)

    data = data.copy()

    # Validate required columns
    required_columns = (
        FEATURE_COLUMNS + [TARGET_COLUMN, GROUP_COLUMN]
    )

    missing_columns = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if data[required_columns].isnull().any().any():
        raise ValueError("Dataset contains missing values.")

    if data.empty:
        raise ValueError("Dataset is empty.")

    # Group identical question texts together
    groups = data[GROUP_COLUMN]

    if groups.nunique() < 2:
        raise ValueError("At least two unique question groups are required.")

    # Perform an 80:20 question-wise split
    splitter = GroupShuffleSplit(
        n_splits=1,
        test_size=0.2,
        random_state=42
    )

    train_indices, test_indices = next(
        splitter.split(data, groups=groups)
    )

    train_data = data.iloc[train_indices].copy()
    test_data = data.iloc[test_indices].copy()

    # Check that no question appears in both sets
    train_groups = set(train_data[GROUP_COLUMN])
    test_groups = set(test_data[GROUP_COLUMN])

    overlap = train_groups.intersection(test_groups)

    if overlap:
        raise ValueError(
            f"Data leakage detected. Overlapping questions: {overlap}"
        )

    # Save the split datasets locally
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    train_path = OUTPUT_DIR / "train_dataset.csv"
    test_path = OUTPUT_DIR / "test_dataset.csv"

    train_data.to_csv(train_path, index=False)
    test_data.to_csv(test_path, index=False)

    # Display split information
    print("\nQUESTION-WISE DATA SPLITTING COMPLETED")
    print("=" * 50)

    print(f"Total responses: {len(data)}")
    print(f"Total unique questions: {groups.nunique()}")

    print("\nTraining dataset:")
    print(f"Responses: {len(train_data)}")
    print(f"Unique questions: {len(train_groups)}")
    print(
        f"Response percentage: "
        f"{len(train_data) / len(data) * 100:.2f}%"
    )

    print("\nTesting dataset:")
    print(f"Responses: {len(test_data)}")
    print(f"Unique questions: {len(test_groups)}")
    print(
        f"Response percentage: "
        f"{len(test_data) / len(data) * 100:.2f}%"
    )

    print(f"\nOverlapping questions: {len(overlap)}")
    print(f"Training file: {train_path}")
    print(f"Testing file: {test_path}")

    return train_data, test_data


if __name__ == "__main__":
    split_dataset()
