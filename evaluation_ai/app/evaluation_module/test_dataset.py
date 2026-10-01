import pytest

from evaluation_ai.app.evaluation_module.dataset import (
    EvaluationDataLoader
)


def test_answer_key_loads_successfully():
    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()

    assert "exam_id" in answer_key
    assert "exam" in answer_key
    assert "sections" in answer_key
    assert "questions" in answer_key
    assert len(answer_key["questions"]) == 7


def test_all_student_submissions_load_successfully():
    loader = EvaluationDataLoader()

    submissions = loader.load_all_student_submissions()

    assert len(submissions) == 5

    for submission in submissions:
        assert "exam_id" in submission
        assert "student" in submission
        assert "answers" in submission


def test_question_lookup_works():
    loader = EvaluationDataLoader()

    question = loader.get_question(1)

    assert question is not None
    assert question["question_id"] == 1


def test_model_answer_lookup_works():
    loader = EvaluationDataLoader()

    model_answer = loader.get_model_answer(1)

    assert isinstance(model_answer, str)
    assert model_answer != ""


def test_keyword_lookup_works():
    loader = EvaluationDataLoader()

    keywords = loader.get_keywords(1)

    assert isinstance(keywords, list)
    assert len(keywords) > 0


def test_max_marks_lookup_works():
    loader = EvaluationDataLoader()

    assert loader.get_max_marks(1) == 2
    assert loader.get_max_marks(4) == 4
    assert loader.get_max_marks(6) == 6


def test_invalid_student_submission_is_rejected():
    loader = EvaluationDataLoader()

    invalid_submission = {
        "exam_id": "IOT_MIDTERM_2026",
        "student": {
            "roll_no": "TEST001",
            "name": "Test Student"
        },
        "answers": {
            "1": {
                "attempted": True,
                "answer": None
            },
            "2": {
                "attempted": False,
                "answer": None
            },
            "3": {
                "attempted": False,
                "answer": None
            },
            "4": {
                "attempted": False,
                "answer": None
            },
            "5": {
                "attempted": False,
                "answer": None
            },
            "6": {
                "attempted": True,
                "answer": "REST answer"
            },
            "7": {
                "attempted": True,
                "answer": "IoT architecture answer"
            }
        }
    }

    with pytest.raises(ValueError):
        loader._validate_student_submission(
            invalid_submission
        )


def test_part_c_requires_exactly_one_attempted_question():
    loader = EvaluationDataLoader()

    invalid_submission = {
        "exam_id": "IOT_MIDTERM_2026",
        "student": {
            "roll_no": "TEST002",
            "name": "Test Student"
        },
        "answers": {
            "1": {
                "attempted": True,
                "answer": "IoT answer"
            },
            "2": {
                "attempted": True,
                "answer": "Cloud answer"
            },
            "3": {
                "attempted": True,
                "answer": "Publish subscribe answer"
            },
            "4": {
                "attempted": True,
                "answer": "Sensor answer"
            },
            "5": {
                "attempted": True,
                "answer": "OS comparison"
            },
            "6": {
                "attempted": False,
                "answer": None
            },
            "7": {
                "attempted": False,
                "answer": None
            }
        }
    }

    with pytest.raises(ValueError):
        loader._validate_student_submission(
            invalid_submission
        )


def test_unattempted_question_cannot_contain_answer():
    loader = EvaluationDataLoader()

    invalid_submission = {
        "exam_id": "IOT_MIDTERM_2026",
        "student": {
            "roll_no": "TEST003",
            "name": "Test Student"
        },
        "answers": {
            "1": {
                "attempted": False,
                "answer": "This should not be here."
            },
            "6": {
                "attempted": True,
                "answer": "REST answer"
            },
            "7": {
                "attempted": False,
                "answer": None
            }
        }
    }

    with pytest.raises(ValueError):
        loader._validate_student_submission(
            invalid_submission
        )