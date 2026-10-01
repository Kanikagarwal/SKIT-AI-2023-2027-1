from evaluation_ai.app.evaluation_module.semantic_similarity import (
    SemanticSimilarity
)


def test_semantic_similarity_returns_high_score_for_similar_answers():
    similarity = SemanticSimilarity()

    model_answer = (
        "Cloud computing provides IoT systems with remote computing, "
        "storage and processing resources."
    )

    student_answer = (
        "IoT devices can use cloud computing for remote storage, "
        "processing and computing resources."
    )

    score = similarity.calculate_similarity(
        model_answer,
        student_answer
    )

    assert 0 <= score <= 100
    assert score > 50


def test_semantic_similarity_returns_lower_score_for_unrelated_answers():
    similarity = SemanticSimilarity()

    model_answer = (
        "Cloud computing provides IoT systems with remote storage "
        "and processing resources."
    )

    student_answer = (
        "A temperature sensor measures the temperature of the environment."
    )

    score = similarity.calculate_similarity(
        model_answer,
        student_answer
    )

    assert 0 <= score <= 100
    assert score < 70


def test_empty_student_answer_returns_zero():
    similarity = SemanticSimilarity()

    score = similarity.calculate_similarity(
        "Cloud computing provides storage.",
        ""
    )

    assert score == 0.0


def test_empty_model_answer_returns_zero():
    similarity = SemanticSimilarity()

    score = similarity.calculate_similarity(
        "",
        "Cloud computing provides storage."
    )

    assert score == 0.0


def test_cached_model_answer_produces_similarity_score():
    similarity = SemanticSimilarity()

    questions = [
        {
            "question_id": 2,
            "model_answer": (
                "Cloud computing provides IoT systems with remote "
                "computing, storage and processing resources."
            )
        }
    ]

    similarity.cache_model_answers(questions)

    score = similarity.calculate_similarity_with_cached_model(
        2,
        "IoT devices can use cloud computing for storage and processing."
    )

    assert 0 <= score <= 100
    assert score > 50


def test_missing_cached_model_answer_raises_error():
    similarity = SemanticSimilarity()

    try:
        similarity.calculate_similarity_with_cached_model(
            999,
            "Some student answer."
        )
    except ValueError as error:
        assert "No cached model answer found" in str(error)
    else:
        raise AssertionError(
            "Expected ValueError for missing cached model answer."
        )