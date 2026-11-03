from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import mean_absolute_error, mean_squared_error
from scipy.stats import pearsonr, spearmanr


# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

TRAIN_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" / "splits" / "train_dataset.csv"
)

MODEL_PATH = BASE_DIR / "results" / "linear_regression_model.joblib"

TEST_METRICS_PATH = BASE_DIR / "results" / "evaluation_metrics.json"


# --------------------------------------------------
# FEATURE CONFIGURATION
# --------------------------------------------------

FEATURE_COLUMNS = [
    "keyword_score",
    "semantic_similarity_score"
]

TARGET_COLUMN = "human_score"


# --------------------------------------------------
# CORRELATION HELPER
# --------------------------------------------------

def calculate_correlation(actual, predicted, method):

    if method == "pearson":
        result = pearsonr(actual, predicted)
    else:
        result = spearmanr(actual, predicted)

    correlation = float(result.statistic)

    return correlation if np.isfinite(correlation) else None


# --------------------------------------------------
# TRAINING PERFORMANCE ANALYSIS
# --------------------------------------------------

def analyze_training_performance():

    print("\nLoading training dataset...")

    if not TRAIN_DATASET_PATH.exists():
        raise FileNotFoundError("Training dataset not found.")

    if not MODEL_PATH.exists():
        raise FileNotFoundError("Trained model not found.")

    if not TEST_METRICS_PATH.exists():
        raise FileNotFoundError("Test evaluation metrics not found.")

    data = pd.read_csv(TRAIN_DATASET_PATH)

    required_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

    missing_columns = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(f"Missing columns: {missing_columns}")

    if data.empty:
        raise ValueError("Training dataset is empty.")

    X_train = data[FEATURE_COLUMNS]
    y_train = data[TARGET_COLUMN]

    if not np.isfinite(X_train.to_numpy(dtype=float)).all():
        raise ValueError("Training features contain non-finite values.")

    if not np.isfinite(y_train.to_numpy(dtype=float)).all():
        raise ValueError("Training scores contain non-finite values.")

    if not X_train.apply(
        lambda column: column.between(0, 100).all()
    ).all():
        raise ValueError("Training features must be between 0 and 100.")

    if not y_train.between(0, 5).all():
        raise ValueError("Training scores must be between 0 and 5.")

    print(f"Training responses: {len(data)}")

    # --------------------------------------------------
    # LOAD EXISTING MODEL
    # --------------------------------------------------

    print("\nLoading existing trained model...")

    model = joblib.load(MODEL_PATH)

    # --------------------------------------------------
    # GENERATE TRAINING PREDICTIONS
    # --------------------------------------------------

    print("\nGenerating training predictions...")

    predictions = model.predict(X_train)

    # --------------------------------------------------
    # CALCULATE TRAINING METRICS
    # --------------------------------------------------

    train_mae = mean_absolute_error(y_train, predictions)

    train_rmse = np.sqrt(
        mean_squared_error(y_train, predictions)
    )

    train_pearson = calculate_correlation(
        y_train, predictions, "pearson"
    )

    train_spearman = calculate_correlation(
        y_train, predictions, "spearman"
    )

    # --------------------------------------------------
    # LOAD PREVIOUS TEST METRICS
    # --------------------------------------------------

    with open(TEST_METRICS_PATH, "r") as file:
        test_metrics = json.load(file)

    test_results = test_metrics["raw_predictions"]

    # --------------------------------------------------
    # COMPARE TRAINING AND TEST PERFORMANCE
    # --------------------------------------------------

    comparison = {
        "training_responses": len(data),
        "test_responses": test_metrics["test_responses"],

        "training_metrics": {
            "mae": float(train_mae),
            "rmse": float(train_rmse),
            "pearson_correlation": train_pearson,
            "spearman_correlation": train_spearman
        },

        "test_metrics": test_results
    }

    # --------------------------------------------------
    # DISPLAY RESULTS
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("TRAINING VS TEST PERFORMANCE")
    print("=" * 60)

    print("\nMETRIC                  TRAINING       TEST")
    print("-" * 50)

    print(
        f"MAE                     {train_mae:.4f}"
        f"         {test_results['mae']:.4f}"
    )

    print(
        f"RMSE                    {train_rmse:.4f}"
        f"         {test_results['rmse']:.4f}"
    )

    print(
        f"Pearson                 {train_pearson:.4f}"
        f"         {test_results['pearson_correlation']:.4f}"
    )

    print(
        f"Spearman                {train_spearman:.4f}"
        f"         {test_results['spearman_correlation']:.4f}"
    )

    print("\nAnalysis completed successfully!")


# --------------------------------------------------
# MAIN
# --------------------------------------------------

if __name__ == "__main__":
    analyze_training_performance()