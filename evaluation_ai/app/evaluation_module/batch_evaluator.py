from evaluation_ai.app.evaluation_module.answer_evaluator import (
    AnswerEvaluator
)


class BatchAnswerEvaluator:
    """
    Evaluates multiple student submissions using a shared
    AnswerEvaluator instance.

    The evaluator is created once so that model answers and
    their semantic embeddings can be reused across students.

    A failure for one student does not stop evaluation of
    the remaining students.
    """

    def __init__(self, answer_key):
        self.answer_key = answer_key
        self.answer_evaluator = AnswerEvaluator(answer_key)

    def evaluate_student(self, student_submission):
        """
        Evaluate one student submission.
        """

        return self.answer_evaluator.evaluate(
            self.answer_key,
            student_submission
        )

    def evaluate_submissions(self, student_submissions):
        """
        Evaluate multiple student submissions.

        Returns successful evaluation results and errors
        separately so that one invalid submission does not
        stop the complete batch.
        """

        results = []
        errors = []

        for submission in student_submissions:
            student = submission.get("student", {})

            roll_no = student.get(
                "roll_no",
                "unknown"
            )

            try:
                result = self.evaluate_student(
                    submission
                )

                results.append(result)

            except (ValueError, KeyError, TypeError) as error:
                errors.append({
                    "roll_no": roll_no,
                    "error": str(error)
                })

        return {
            "results": results,
            "errors": errors
        }