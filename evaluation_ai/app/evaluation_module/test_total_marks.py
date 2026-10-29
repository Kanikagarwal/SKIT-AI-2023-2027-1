
from evaluation_ai.app.evaluation_module.answer_evaluator import (
    AnswerEvaluator
)


def test_total_marks_include_only_attempted_questions():
    evaluator = AnswerEvaluator.__new__(AnswerEvaluator)

    def fake_evaluate_question(question, student_answer):
        return {
            "marks_awarded": question["test_marks"]
        }

    evaluator.evaluate_question = fake_evaluate_question

    answer_key = {
        "exam_id": "TEST001",
        "questions": [
            {
                "question_id": 1,
                "part": "A",
                "max_marks": 2,
                "test_marks": 1.25
            },
            {
                "question_id": 2,
                "part": "A",
                "max_marks": 2,
                "test_marks": 1.50
            },
            {
                "question_id": 3,
                "part": "B",
                "max_marks": 4,
                "test_marks": 3.25
            }
        ]
    }

    student_submission = {
        "student": {
            "roll_no": "TEST001",
            "name": "Test Student"
        },
        "answers": {
            "1": {"attempted": True, "answer": "Answer 1"},
            "2": {"attempted": False, "answer": None},
            "3": {"attempted": True, "answer": "Answer 3"}
        }
    }

    result = evaluator.evaluate(answer_key, student_submission)

    assert result["total_marks_awarded"] == 4.5
    assert result["questions"][1]["evaluation"] is None


def test_total_marks_are_rounded_to_two_decimal_places():
    evaluator = AnswerEvaluator.__new__(AnswerEvaluator)

    def fake_evaluate_question(question, student_answer):
        return {"marks_awarded": question["test_marks"]}

    evaluator.evaluate_question = fake_evaluate_question

    answer_key = {
        "exam_id": "TEST002",
        "questions": [
            {
                "question_id": 1,
                "part": "A",
                "max_marks": 2,
                "test_marks": 1.111
            },
            {
                "question_id": 2,
                "part": "A",
                "max_marks": 2,
                "test_marks": 1.112
            }
        ]
    }

    student_submission = {
        "student": {"roll_no": "TEST002", "name": "Test Student"},
        "answers": {
            "1": {"attempted": True, "answer": "Answer 1"},
            "2": {"attempted": True, "answer": "Answer 2"}
        }
    }

    result = evaluator.evaluate(answer_key, student_submission)

    assert result["total_marks_awarded"] == 2.22
