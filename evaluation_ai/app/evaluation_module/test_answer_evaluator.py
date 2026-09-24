from evaluation_ai.app.evaluation_module.answer_evaluator import AnswerEvaluator
from evaluation_ai.app.evaluation_module.dataset import EvaluationDataset


def test_answer_evaluation():
    dataset = EvaluationDataset()
    evaluator = AnswerEvaluator()

    question = dataset.get_question("Q001")

    student_answer = (
        "Artificial Intelligence allows machines "
        "to perform intelligent tasks like humans."
    )

    result = evaluator.evaluate(
        question,
        student_answer
    )

    assert "keyword_score" in result
    assert "semantic_similarity_score" in result
    assert "combined_score" in result

    assert 0.0 <= result["keyword_score"] <= 100.0
    assert 0.0 <= result["semantic_similarity_score"] <= 100.0
    assert 0.0 <= result["combined_score"] <= 100.0


def test_empty_answer_evaluation():
    dataset = EvaluationDataset()
    evaluator = AnswerEvaluator()

    question = dataset.get_question("Q001")

    result = evaluator.evaluate(
        question,
        ""
    )

    assert result["keyword_score"] == 0.0
    assert result["semantic_similarity_score"] == 0.0
    assert result["combined_score"] == 0.0


def test_dataset_student_answers():
    dataset = EvaluationDataset()
    evaluator = AnswerEvaluator()

    questions = dataset.get_all_questions()

    for question in questions:
        for student in question.get("student_answers", []):
            result = evaluator.evaluate(
                question,
                student.get("answer", "")
            )

            assert 0.0 <= result["combined_score"] <= 100.0