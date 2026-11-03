from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd

from scipy.stats import pearsonr, spearmanr
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import mean_absolute_error, mean_squared_error


# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

TRAIN_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" / "splits" / "train_dataset.csv"
)

RESULTS_DIR = BASE_DIR / "results"

CV_PREDICTIONS_PATH = RESULTS_DIR / "cross_validation_predictions.csv"

CV_METRICS_PATH = RESULTS_DIR / "cross_validation_metrics.json"


# --------------------------------------------------
# EXPERIMENT CONFIGURATION
# --------------------------------------------------

FEATURE_COLUMNS = [
    "keyword_score",
    "semantic_similarity_score"
]

TARGET_COLUMN = "human_score"
GROUP_COLUMN = "question_text"

N_SPLITS = 5


# --------------------------------------------------
# CORRELATION HELPER
# --------------------------------------------------

def calculate_correlation(actual, predicted, method):

    try:
        if method == "pearson":
            result = pearsonr(actual, predicted)
        else:
            result = spearmanr(actual, predicted)

        correlation = float(result.statistic)

        return correlation if np.isfinite(correlation) else None

    except (ValueError, FloatingPointError):
        return None


# --------------------------------------------------
# METRIC CALCULATION
# --------------------------------------------------

def calculate_metrics(actual, predicted):

    return {
        "mae": float(
            mean_absolute_error(actual, predicted)
        ),

        "rmse": float(
            np.sqrt(mean_squared_error(actual, predicted))
        ),

        "pearson_correlation": calculate_correlation(
            actual, predicted, "pearson"
        ),

        "spearman_correlation": calculate_correlation(
            actual, predicted, "spearman"
        )
    }


# --------------------------------------------------
# CROSS-VALIDATION
# --------------------------------------------------

def cross_validate_model():

    print("\nLoading training dataset...")

    if not TRAIN_DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {TRAIN_DATASET_PATH}"
        )

    data = pd.read_csv(TRAIN_DATASET_PATH)

    required_columns = FEATURE_COLUMNS + [
        TARGET_COLUMN,
        GROUP_COLUMN
    ]

    missing_columns = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if data.empty:
        raise ValueError("Training dataset is empty.")

    # --------------------------------------------------
    # VALIDATE DATA
    # --------------------------------------------------

    if data[GROUP_COLUMN].isna().any():
        raise ValueError("Question text contains missing values.")

    X = data[FEATURE_COLUMNS]
    y = data[TARGET_COLUMN]
    groups = data[GROUP_COLUMN]

    if not np.isfinite(X.to_numpy(dtype=float)).all():
        raise ValueError("Features contain non-finite values.")

    if not np.isfinite(y.to_numpy(dtype=float)).all():
        raise ValueError("Human scores contain non-finite values.")

    if not X.apply(
        lambda column: column.between(0, 100).all()
    ).all():
        raise ValueError("Features must be between 0 and 100.")

    if not y.between(0, 5).all():
        raise ValueError("Human scores must be between 0 and 5.")

    unique_questions = groups.nunique()

    if unique_questions < N_SPLITS:
        raise ValueError(
            "Not enough unique questions for 5-fold cross-validation."
        )

    print(f"Training responses: {len(data)}")
    print(f"Unique question texts: {unique_questions}")
    print(f"Number of folds: {N_SPLITS}")

    # --------------------------------------------------
    # INITIALIZE GROUP K-FOLD
    # --------------------------------------------------

    group_kfold = GroupKFold(n_splits=N_SPLITS)

    fold_results = []

    # Store out-of-fold predictions for every response.
    out_of_fold_predictions = np.full(len(data), np.nan)

    # --------------------------------------------------
    # TRAIN AND VALIDATE EACH FOLD
    # --------------------------------------------------

    print("\nStarting 5-fold question-wise cross-validation...")

    for fold_number, (train_indices, validation_indices) in enumerate(
        group_kfold.split(X, y, groups=groups),
        start=1
    ):

        X_fold_train = X.iloc[train_indices]
        y_fold_train = y.iloc[train_indices]

        X_fold_validation = X.iloc[validation_indices]
        y_fold_validation = y.iloc[validation_indices]

        train_groups = set(groups.iloc[train_indices])
        validation_groups = set(groups.iloc[validation_indices])

        # Ensure no question appears in both sets.
        overlap = train_groups.intersection(validation_groups)

        if overlap:
            raise ValueError(
                f"Question leakage detected in fold {fold_number}."
            )

        # Train a fresh model for this fold.
        model = LinearRegression()

        model.fit(X_fold_train, y_fold_train)

        # Predict scores for the validation fold.
        predictions = model.predict(X_fold_validation)

        # Store predictions in their original row positions.
        out_of_fold_predictions[validation_indices] = predictions

        # Calculate fold metrics.
        metrics = calculate_metrics(
            y_fold_validation,
            predictions
        )

        fold_result = {
            "fold": fold_number,
            "training_responses": len(train_indices),
            "validation_responses": len(validation_indices),
            "training_questions": len(train_groups),
            "validation_questions": len(validation_groups),
            "metrics": metrics
        }

        fold_results.append(fold_result)

        print(f"\nFOLD {fold_number}")
        print("-" * 40)

        print(f"Training responses:   {len(train_indices)}")
        print(f"Validation responses: {len(validation_indices)}")

        print(f"MAE:                  {metrics['mae']:.4f}")
        print(f"RMSE:                 {metrics['rmse']:.4f}")

        print(
            f"Pearson correlation:  "
            f"{metrics['pearson_correlation']}"
        )

        print(
            f"Spearman correlation: "
            f"{metrics['spearman_correlation']}"
        )

    # --------------------------------------------------
    # AGGREGATE OUT-OF-FOLD RESULTS
    # --------------------------------------------------

    if np.isnan(out_of_fold_predictions).any():
        raise ValueError(
            "Some training responses did not receive predictions."
        )

    overall_metrics = calculate_metrics(
        y,
        out_of_fold_predictions
    )

    # Calculate mean and standard deviation across folds.
    metric_names = [
        "mae",
        "rmse",
        "pearson_correlation",
        "spearman_correlation"
    ]

    fold_summary = {}

    for metric_name in metric_names:

        values = [
            result["metrics"][metric_name]
            for result in fold_results
        ]

        valid_values = [
            value for value in values
            if value is not None
        ]

        fold_summary[metric_name] = {
            "mean": (
                float(np.mean(valid_values))
                if valid_values else None
            ),

            "standard_deviation": (
                float(np.std(valid_values))
                if valid_values else None
            )
        }

    # --------------------------------------------------
    # SAVE OUT-OF-FOLD PREDICTIONS
    # --------------------------------------------------

    prediction_report = data.copy()

    prediction_report["cross_validated_prediction"] = (
        out_of_fold_predictions
    )

    prediction_report["absolute_error"] = np.abs(
        y.to_numpy() - out_of_fold_predictions
    )

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    prediction_report.to_csv(
        CV_PREDICTIONS_PATH,
        index=False
    )

    # --------------------------------------------------
    # SAVE METRICS
    # --------------------------------------------------

    results = {
        "algorithm": "Linear Regression",
        "validation_method": "5-Fold GroupKFold",
        "grouping_column": GROUP_COLUMN,
        "training_responses": len(data),
        "unique_questions": int(unique_questions),
        "number_of_folds": N_SPLITS,

        "fold_results": fold_results,

        "mean_fold_metrics": fold_summary,

        "overall_out_of_fold_metrics": overall_metrics
    }

    with open(CV_METRICS_PATH, "w") as file:
        json.dump(results, file, indent=4)

    # --------------------------------------------------
    # DISPLAY FINAL RESULTS
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("5-FOLD CROSS-VALIDATION SUMMARY")
    print("=" * 60)

    print("\nMEAN METRICS ACROSS FIVE FOLDS")

    for metric_name, values in fold_summary.items():

        mean = values["mean"]
        std = values["standard_deviation"]

        if mean is not None:
            print(f"{metric_name}: {mean:.4f} ± {std:.4f}")
        else:
            print(f"{metric_name}: Not available")

    print("\nOVERALL OUT-OF-FOLD METRICS")

    for metric_name, value in overall_metrics.items():
        print(f"{metric_name}: {value}")

    print("\nFILES SAVED")
    print("-" * 40)
    print(f"Predictions: {CV_PREDICTIONS_PATH}")
    print(f"Metrics:     {CV_METRICS_PATH}")

    print("\nCross-validation completed successfully!")

    return results


# --------------------------------------------------
# MAIN
# --------------------------------------------------

if __name__ == "__main__":
    cross_validate_model()