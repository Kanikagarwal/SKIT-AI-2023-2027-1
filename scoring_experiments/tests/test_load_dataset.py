
import pandas as pd
import pytest

from scoring_experiments.experiments.load_dataset import (
    load_dataset,
    validate_dataset,
    generate_dataset_report
)


@pytest.fixture
def sample_data():
    return pd.DataFrame({
        "id": ["E01.Q01.A00", "E01.Q01.A01"],
        "question": ["Question 1", "Question 1"],
        "instructor_answer": ["Reference answer", "Reference answer"],
        "student_answer": ["Student answer 1", "Student answer 2"],
        "score_grader_1": [3.0, 5.0],
        "score_grader_2": [4.0, 5.0],
        "score_avg": [3.5, 5.0],
    })


def test_load_dataset_success(tmp_path, sample_data):
    path = tmp_path / "sample.parquet"
    sample_data.to_parquet(path)

    loaded = load_dataset(path)

    assert len(loaded) == 2
    assert list(loaded.columns) == list(sample_data.columns)


def test_load_dataset_missing_file():
    with pytest.raises(FileNotFoundError):
        load_dataset("missing_dataset.parquet")


def test_load_dataset_missing_column(tmp_path, sample_data):
    path = tmp_path / "invalid.parquet"
    sample_data.drop(columns=["score_avg"]).to_parquet(path)

    with pytest.raises(ValueError, match="Missing required columns"):
        load_dataset(path)


def test_validate_dataset_success(sample_data):
    assert validate_dataset(sample_data) is True


def test_validate_dataset_rejects_missing_text(sample_data):
    sample_data.loc[0, "student_answer"] = None

    with pytest.raises(ValueError, match="Missing values"):
        validate_dataset(sample_data)


def test_validate_dataset_rejects_empty_text(sample_data):
    sample_data.loc[0, "student_answer"] = "  "

    with pytest.raises(ValueError, match="Empty values"):
        validate_dataset(sample_data)


def test_validate_dataset_allows_grader_scores_above_five(sample_data):
    sample_data.loc[0, "score_grader_1"] = 10.0
    sample_data.loc[0, "score_grader_2"] = 10.0

    assert validate_dataset(sample_data) is True


def test_validate_dataset_rejects_negative_grader_score(sample_data):
    sample_data.loc[0, "score_grader_1"] = -1.0

    with pytest.raises(ValueError, match="Negative scores"):
        validate_dataset(sample_data)


def test_validate_dataset_rejects_average_above_five(sample_data):
    sample_data.loc[0, "score_avg"] = 6.0

    with pytest.raises(ValueError, match="between 0 and 5"):
        validate_dataset(sample_data)


def test_generate_dataset_report(sample_data):
    report = generate_dataset_report(sample_data)

    assert report["total_responses"] == 2
    assert report["unique_questions"] == 1
    assert report["average_human_score"] == 4.25
    assert report["missing_values"] == 0
