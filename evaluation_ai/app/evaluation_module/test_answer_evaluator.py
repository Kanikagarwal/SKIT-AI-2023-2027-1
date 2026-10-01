from evaluation_ai.app.evaluation_module.answer_evaluator import (
    AnswerEvaluator
)
from evaluation_ai.app.evaluation_module.dataset import (
    EvaluationDataLoader
)


def load_test_data():
    """
    Load the real answer key and student submission
    used by the evaluation system.
    """

    loader = EvaluationDataLoader()

    answer_key = loader.load_answer_key()
    student_submission = loader.load_student_submission(
        "student_001.json"
    )

    return answer_key, student_submission


def test_answer_evaluator_returns_student_information():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    assert result["exam_id"] == answer_key["exam_id"]

    assert result["student"]["roll_no"] == (
        student_submission["student"]["roll_no"]
    )

    assert result["student"]["name"] == (
        student_submission["student"]["name"]
    )


def test_answer_evaluator_evaluates_attempted_questions():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    question_results = result["questions"]

    for question_result in question_results:

        question_id = str(question_result["question_id"])

        if student_submission["answers"][question_id]["attempted"]:

            assert question_result["evaluation"] is not None

            assert "keyword_evidence" in (
                question_result["evaluation"]
            )

            assert "semantic_similarity_score" in (
                question_result["evaluation"]
            )


def test_answer_evaluator_does_not_evaluate_unattempted_questions():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    question_results = result["questions"]

    for question_result in question_results:

        question_id = str(question_result["question_id"])

        if not student_submission["answers"][question_id]["attempted"]:

            assert question_result["evaluation"] is None


def test_keyword_evidence_contains_expected_fields():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    for question_result in result["questions"]:

        if question_result["evaluation"] is None:
            continue

        keyword_evidence = (
            question_result["evaluation"]["keyword_evidence"]
        )

        assert "matched_keywords" in keyword_evidence
        assert "missing_keywords" in keyword_evidence
        assert "keyword_score" in keyword_evidence

        assert isinstance(
            keyword_evidence["matched_keywords"],
            list
        )

        assert isinstance(
            keyword_evidence["missing_keywords"],
            list
        )

        assert 0 <= keyword_evidence["keyword_score"] <= 100


def test_semantic_similarity_is_within_valid_range():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    for question_result in result["questions"]:

        if question_result["evaluation"] is None:
            continue

        score = (
            question_result["evaluation"]
            ["semantic_similarity_score"]
        )

        assert 0 <= score <= 100


def test_evaluator_handles_empty_attempted_answer():
    answer_key, student_submission = load_test_data()

    student_submission["answers"]["6"] = {
        "attempted": True,
        "answer": ""
    }

    # Q7 must remain unattempted because Part C requires
    # exactly one attempted question.
    student_submission["answers"]["7"] = {
        "attempted": False,
        "answer": None
    }

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    question_6 = next(
        question
        for question in result["questions"]
        if question["question_id"] == 6
    )

    assert question_6["evaluation"] is not None

    assert (
        question_6["evaluation"]["keyword_evidence"]["keyword_score"]
        == 0.0
    )

    assert (
        question_6["evaluation"]["semantic_similarity_score"]
        == 0.0
    )


def test_evaluator_processes_all_questions_in_answer_key():
    answer_key, student_submission = load_test_data()

    evaluator = AnswerEvaluator(answer_key)

    result = evaluator.evaluate(
        answer_key,
        student_submission
    )

    assert len(result["questions"]) == len(
        answer_key["questions"]
    )

    result_question_ids = {
        question["question_id"]
        for question in result["questions"]
    }

    answer_key_question_ids = {
        question["question_id"]
        for question in answer_key["questions"]
    }

    assert result_question_ids == answer_key_question_ids