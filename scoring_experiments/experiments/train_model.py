
from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


BASE_DIR = Path(__file__).resolve().parent.parent

TRAIN_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" /
    "splits" / "train_dataset.csv"
)

RESULTS_DIR = BASE_DIR / "results"

MODEL_PATH = RESULTS_DIR / "linear_regression_model.joblib"
COEFFICIENTS_PATH = RESULTS_DIR / "model_coefficients.csv"
MODEL_INFO_PATH = RESULTS_DIR / "model_info.json"

FEATURE_COLUMNS = [
    "keyword_score",
    "semantic_similarity_score"
]

TARGET_COLUMN = "human_score"


def train_model():

    # Load training data only
    if not TRAIN_DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {TRAIN_DATASET_PATH}"
        )

    data = pd.read_csv(TRAIN_DATASET_PATH)

    if data.empty:
        raise ValueError("Training dataset is empty.")

    # Validate required columns
    required_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

    missing_columns = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    # Select input features and target
    X_train = data[FEATURE_COLUMNS]
    y_train = data[TARGET_COLUMN]

    # Validate numeric values
    if not np.isfinite(X_train.to_numpy()).all():
        raise ValueError("Input features contain invalid values.")

    if not np.isfinite(y_train.to_numpy()).all():
        raise ValueError("Target contains invalid values.")

    if not X_train.apply(
        lambda column: column.between(0, 100).all()
    ).all():
        raise ValueError("Feature scores must be between 0 and 100.")

    if not y_train.between(0, 5).all():
        raise ValueError("Human scores must be between 0 and 5.")

    # Create and train Linear Regression model
    model = LinearRegression()

    model.fit(X_train, y_train)

    # Extract learned coefficients
    coefficients = pd.DataFrame({
        "feature": FEATURE_COLUMNS,
        "coefficient": model.coef_
    })

    intercept = float(model.intercept_)

    # Save trained model and results
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    coefficients.to_csv(
        COEFFICIENTS_PATH,
        index=False
    )

    model_info = {
        "algorithm": "Linear Regression",
        "method": "Ordinary Least Squares",
        "training_responses": len(data),
        "training_features": FEATURE_COLUMNS,
        "target": TARGET_COLUMN,
        "intercept": intercept,
        "coefficients": {
            feature: float(coefficient)
            for feature, coefficient
            in zip(FEATURE_COLUMNS, model.coef_)
        }
    }

    with open(MODEL_INFO_PATH, "w") as file:
        json.dump(model_info, file, indent=4)

    # Display results
    print("\nLINEAR REGRESSION TRAINING COMPLETED")
    print("=" * 50)

    print(f"Training responses: {len(data)}")
    print(f"Training features: {FEATURE_COLUMNS}")

    print("\nLearned coefficients:")

    for feature, coefficient in zip(
        FEATURE_COLUMNS, model.coef_
    ):
        print(f"{feature}: {coefficient:.6f}")

    print(f"\nIntercept: {intercept:.6f}")

    print("\nRegression equation:")
    print(
        f"Predicted score = {intercept:.6f} "
        f"+ ({model.coef_[0]:.6f} × keyword_score) "
        f"+ ({model.coef_[1]:.6f} × semantic_similarity_score)"
    )

    print("\nSaved files:")
    print(f"Trained model: {MODEL_PATH}")
    print(f"Coefficients: {COEFFICIENTS_PATH}")
    print(f"Model information: {MODEL_INFO_PATH}")

    return model


if __name__ == "__main__":
    train_model()
