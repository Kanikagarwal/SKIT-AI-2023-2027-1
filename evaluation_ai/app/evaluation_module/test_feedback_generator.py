import pytest

from evaluation_ai.app.evaluation_module.feedback_generator import (
    FeedbackGenerator
)


@pytest.fixture
def generator():
    return FeedbackGenerator()


def make_question_result(
    semantic_score=80.0,
    matched=None,
    missing=None,
    attempted=True
):
    return {
        "question_id": 1,
        "max_marks": 5,
        "attempted": attempted,
        "evaluation": {
            "keyword_evidence": {
                "matched_keywords": matched or [],
                "missing_keywords": missing or [],
                "keyword_score": 50.0
            },
            "semantic_similarity_score": semantic_score,
            "marks_awarded": 3.5
        } if attempted else None
    }


def test_generates_feedback_for_strong_answer(generator):
    result = make_question_result(semantic_score=85.0)

    feedback = generator.generate_question_feedback(result)

    assert "strengths" in feedback
    assert "improvements" in feedback
    assert "summary" in feedback
    assert "strong semantic alignment" in feedback["summary"]


def test_generates_feedback_for_moderate_answer(generator):
    result = make_question_result(semantic_score=60.0)

    feedback = generator.generate_question_feedback(result)

    assert "partial semantic alignment" in feedback["summary"]


def test_generates_feedback_for_low_similarity_answer(generator):
    result = make_question_result(semantic_score=30.0)

    feedback = generator.generate_question_feedback(result)

    assert feedback["improvements"]
    assert "more complete" in feedback["summary"]


def test_includes_matched_keywords(generator):
    result = make_question_result(
        matched=["Artificial Intelligence", "machines"]
    )

    feedback = generator.generate_question_feedback(result)

    assert any(
        "Artificial Intelligence" in item
        for item in feedback["strengths"]
    )


def test_includes_missing_keywords(generator):
    result = make_question_result(
        missing=["Neural Networks", "Training Data"]
    )

    feedback = generator.generate_question_feedback(result)

    assert any(
        "Neural Networks" in item
        for item in feedback["improvements"]
    )


def test_handles_unattempted_question(generator):
    result = make_question_result(attempted=False)

    feedback = generator.generate_question_feedback(result)

    assert feedback["summary"] == (
        "This question was not attempted."
    )
    assert feedback["strengths"] == []


def test_rejects_invalid_semantic_score(generator):
    result = make_question_result(semantic_score=120.0)

    with pytest.raises(ValueError):
        generator.generate_question_feedback(result)


def test_generates_overall_feedback(generator):
    student_result = {
        "total_marks_awarded": 35.0,
        "questions": [
            {"attempted": True, "max_marks": 20},
            {"attempted": True, "max_marks": 20},
            {"attempted": False, "max_marks": 10}
        ]
    }

    feedback = generator.generate_overall_feedback(student_result)

    assert isinstance(feedback, str)
    assert "2 out of 3 questions" in feedback