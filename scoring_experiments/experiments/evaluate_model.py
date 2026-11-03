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

TEST_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" / "splits" / "test_dataset.csv"
)

MODEL_PATH = BASE_DIR / "results" / "linear_regression_model.joblib"

RESULTS_DIR = BASE_DIR / "results"

PREDICTIONS_PATH = RESULTS_DIR / "test_predictions.csv"

METRICS_PATH = RESULTS_DIR / "evaluation_metrics.json"


# --------------------------------------------------
# FEATURE CONFIGURATION
# --------------------------------------------------

FEATURE_COLUMNS = [
    "keyword_score",
    "semantic_similarity_score"
]

TARGET_COLUMN = "human_score"

MIN_SCORE = 0
MAX_SCORE = 5


# --------------------------------------------------
# CORRELATION HELPER
# --------------------------------------------------

def calculate_correlation(actual, predicted, method):
    """
    Calculate Pearson or Spearman correlation.
    Returns None if correlation cannot be calculated.
    """

    try:
        if method == "pearson":
            result = pearsonr(actual, predicted)
        else:
            result = spearmanr(actual, predicted)

        return float(result.statistic)

    except (ValueError, FloatingPointError):
        return None


# --------------------------------------------------
# MODEL EVALUATION
# --------------------------------------------------

def evaluate_model():

    print("\nLoading test dataset...")

    if not TEST_DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Test dataset not found: {TEST_DATASET_PATH}"
        )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained model not found: {MODEL_PATH}"
        )

    data = pd.read_csv(TEST_DATASET_PATH)

    required_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

    missing_columns = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if data.empty:
        raise ValueError("Test dataset is empty.")

    # Extract test features and actual human scores.
    X_test = data[FEATURE_COLUMNS]
    y_test = data[TARGET_COLUMN]

    # Validate numeric values.
    if not np.isfinite(X_test.to_numpy(dtype=float)).all():
        raise ValueError("Test features contain non-finite values.")

    if not np.isfinite(y_test.to_numpy(dtype=float)).all():
        raise ValueError("Human scores contain non-finite values.")

    if not X_test.apply(
        lambda column: column.between(0, 100).all()
    ).all():
        raise ValueError("Test features must be between 0 and 100.")

    if not y_test.between(MIN_SCORE, MAX_SCORE).all():
        raise ValueError("Human scores must be between 0 and 5.")

    print(f"Test responses loaded: {len(data)}")

    # --------------------------------------------------
    # LOAD TRAINED MODEL
    # --------------------------------------------------

    print("\nLoading trained Linear Regression model...")

    model = joblib.load(MODEL_PATH)

    # --------------------------------------------------
    # GENERATE PREDICTIONS
    # --------------------------------------------------

    print("\nGenerating predictions...")

    raw_predictions = model.predict(X_test)

    # Keep raw predictions unchanged for the primary evaluation.
    bounded_predictions = np.clip(
        raw_predictions,
        MIN_SCORE,
        MAX_SCORE
    )

    # --------------------------------------------------
    # CALCULATE EVALUATION METRICS
    # --------------------------------------------------

    # Raw prediction metrics.
    raw_mae = mean_absolute_error(
        y_test, raw_predictions
    )

    raw_rmse = np.sqrt(
        mean_squared_error(y_test, raw_predictions)
    )

    # Bounded prediction metrics.
    bounded_mae = mean_absolute_error(
        y_test, bounded_predictions
    )

    bounded_rmse = np.sqrt(
        mean_squared_error(y_test, bounded_predictions)
    )

    # Correlation metrics on raw predictions.
    pearson_correlation = calculate_correlation(
        y_test, raw_predictions, "pearson"
    )

    spearman_correlation = calculate_correlation(
        y_test, raw_predictions, "spearman"
    )

    # --------------------------------------------------
    # CHECK PREDICTIONS OUTSIDE THE VALID SCORE RANGE
    # --------------------------------------------------

    below_range = int(
        np.sum(raw_predictions < MIN_SCORE)
    )

    above_range = int(
        np.sum(raw_predictions > MAX_SCORE)
    )

    outside_range = below_range + above_range

    # --------------------------------------------------
    # CREATE PREDICTION REPORT
    # --------------------------------------------------

    prediction_report = data.copy()

    prediction_report["predicted_raw"] = raw_predictions

    prediction_report["predicted_bounded"] = bounded_predictions

    prediction_report["raw_absolute_error"] = np.abs(
        y_test.to_numpy() - raw_predictions
    )

    prediction_report["bounded_absolute_error"] = np.abs(
        y_test.to_numpy() - bounded_predictions
    )

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    prediction_report.to_csv(
        PREDICTIONS_PATH,
        index=False
    )

    # --------------------------------------------------
    # SAVE EVALUATION METRICS
    # --------------------------------------------------

    metrics = {
        "model": "Linear Regression",
        "evaluation_method": "Held-out test set",
        "test_responses": len(data),

        "raw_predictions": {
            "mae": float(raw_mae),
            "rmse": float(raw_rmse),
            "pearson_correlation": pearson_correlation,
            "spearman_correlation": spearman_correlation
        },

        "bounded_predictions": {
            "mae": float(bounded_mae),
            "rmse": float(bounded_rmse),
            "score_range": [MIN_SCORE, MAX_SCORE]
        },

        "prediction_range_check": {
            "below_minimum": below_range,
            "above_maximum": above_range,
            "outside_valid_range": outside_range
        }
    }

    with open(METRICS_PATH, "w") as file:
        json.dump(metrics, file, indent=4)

    # --------------------------------------------------
    # DISPLAY RESULTS
    # --------------------------------------------------

    print("\n" + "=" * 55)
    print("LINEAR REGRESSION - MODEL EVALUATION RESULTS")
    print("=" * 55)

    print(f"\nTest responses: {len(data)}")

    print("\nRAW PREDICTION METRICS")
    print("-" * 35)
    print(f"MAE:                  {raw_mae:.4f}")
    print(f"RMSE:                 {raw_rmse:.4f}")
    print(f"Pearson correlation:  {pearson_correlation}")
    print(f"Spearman correlation: {spearman_correlation}")

    print("\nBOUNDED PREDICTION METRICS (0-5)")
    print("-" * 35)
    print(f"MAE:                  {bounded_mae:.4f}")
    print(f"RMSE:                 {bounded_rmse:.4f}")

    print("\nPREDICTION RANGE CHECK")
    print("-" * 35)
    print(f"Below 0:              {below_range}")
    print(f"Above 5:              {above_range}")
    print(f"Outside valid range:  {outside_range}")

    print("\nFILES SAVED")
    print("-" * 35)
    print(f"Predictions: {PREDICTIONS_PATH}")
    print(f"Metrics:     {METRICS_PATH}")

    print("\nEvaluation completed successfully!")

    return metrics


# --------------------------------------------------
# MAIN
# --------------------------------------------------

if __name__ == "__main__":
    evaluate_model()