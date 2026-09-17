from evaluation_ai.app.evaluation_module.semantic_similarity import (
    SemanticSimilarity
)
from evaluation_ai.app.evaluation_module.dataset import EvaluationDataset


def test_identical_answers():
    semantic_similarity = SemanticSimilarity()

    answer = "Machine learning allows computers to learn from data."

    score = semantic_similarity.calculate_similarity(
        answer,
        answer
    )

    assert score == 100.0


def test_similar_answers():
    semantic_similarity = SemanticSimilarity()

    model_answer = (
        "Machine Learning enables computers to learn patterns "
        "from data and improve their performance."
    )

    student_answer = (
        "Machine learning allows computers to learn from data "
        "and improve automatically."
    )

    score = semantic_similarity.calculate_similarity(
        model_answer,
        student_answer
    )

    assert score > 70.0


def test_unrelated_answers():
    semantic_similarity = SemanticSimilarity()

    model_answer = (
        "Machine Learning enables computers to learn from data."
    )

    student_answer = (
        "The Taj Mahal is a famous historical monument in India."
    )

    score = semantic_similarity.calculate_similarity(
        model_answer,
        student_answer
    )

    assert score < 50.0


def test_empty_student_answer():
    semantic_similarity = SemanticSimilarity()

    model_answer = (
        "Artificial Intelligence enables machines "
        "to perform intelligent tasks."
    )

    score = semantic_similarity.calculate_similarity(
        model_answer,
        ""
    )

    assert score == 0.0


def test_dataset_question_evaluation():
    dataset = EvaluationDataset()
    semantic_similarity = SemanticSimilarity()

    question = dataset.get_question("Q002")

    results = semantic_similarity.evaluate_question(question)

    assert len(results) == 2

    assert results[0]["student_id"] == "S001"
    assert "semantic_similarity_score" in results[0]

    assert results[1]["student_id"] == "S002"
    assert "semantic_similarity_score" in results[1]