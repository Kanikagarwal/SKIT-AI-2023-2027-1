import copy

from evaluation_ai.app.evaluation_module.answer_evaluator import (
    AnswerEvaluator
)
from evaluation_ai.app.evaluation_module.batch_evaluator import (
    BatchAnswerEvaluator
)
from evaluation_ai.app.evaluation_module.dataset import (
    EvaluationDataLoader
)


def test_batch_evaluator_creates_shared_evaluator():
    loader = EvaluationDataLoader()
    answer_key = loader.load_answer_key()

    batch_evaluator = BatchAnswerEvaluator(answer_key)

    assert isinstance(
        batch_evaluator.answer_evaluator,
        AnswerEvaluator
    )


def test_batch_evaluator_evaluates_multiple_students():
    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()
    submissions = loader.load_all_student_submissions()

    batch_evaluator = BatchAnswerEvaluator(answer_key)

    batch_result = batch_evaluator.evaluate_submissions(
        submissions
    )

    assert len(batch_result["results"]) == 5
    assert len(batch_result["errors"]) == 0


def test_batch_results_contain_student_information():
    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()
    submissions = loader.load_all_student_submissions()

    batch_evaluator = BatchAnswerEvaluator(answer_key)

    batch_result = batch_evaluator.evaluate_submissions(
        submissions
    )

    roll_numbers = [
        result["student"]["roll_no"]
        for result in batch_result["results"]
    ]

    assert "ESKCT001" in roll_numbers
    assert "ESKCT002" in roll_numbers
    assert "ESKCT003" in roll_numbers
    assert "ESKCT004" in roll_numbers
    assert "ESKCT005" in roll_numbers


def test_one_evaluation_error_does_not_stop_batch():
    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()
    submissions = loader.load_all_student_submissions()

    batch_evaluator = BatchAnswerEvaluator(answer_key)

    original_evaluate_student = (
        batch_evaluator.evaluate_student
    )

    def evaluate_with_one_failure(submission):
        if submission["student"]["roll_no"] == "ESKCT003":
            raise ValueError(
                "Simulated evaluation failure."
            )

        return original_evaluate_student(submission)

    batch_evaluator.evaluate_student = evaluate_with_one_failure

    batch_result = batch_evaluator.evaluate_submissions(
        submissions
    )

    assert len(batch_result["results"]) == 4
    assert len(batch_result["errors"]) == 1

    assert (
        batch_result["errors"][0]["roll_no"]
        == "ESKCT003"
    )

    assert (
        "Simulated evaluation failure."
        in batch_result["errors"][0]["error"]
    )


def test_empty_batch_returns_no_results_or_errors():
    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()

    batch_evaluator = BatchAnswerEvaluator(answer_key)

    batch_result = batch_evaluator.evaluate_submissions([])

    assert batch_result["results"] == []
    assert batch_result["errors"] == []