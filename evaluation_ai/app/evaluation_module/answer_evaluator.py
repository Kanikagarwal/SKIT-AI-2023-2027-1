
from evaluation_ai.app.evaluation_module.keyword_extraction import (
    KeywordExtractor
)
from evaluation_ai.app.evaluation_module.keyword_matching import KeywordMatcher
from evaluation_ai.app.evaluation_module.semantic_similarity import (
    SemanticSimilarity
)
from evaluation_ai.app.evaluation_module.scoring import AnswerScorer


class AnswerEvaluator:
    """
    Evaluates student answers using keyword matching,
    semantic similarity, and a scoring component.
    """

    def __init__(self, answer_key=None):
        self.keyword_matcher = KeywordMatcher()
        self.keyword_extractor = KeywordExtractor()
        self.semantic_similarity = SemanticSimilarity()
        self.scorer = AnswerScorer()

        if answer_key is not None:
            self.semantic_similarity.cache_model_answers(
                answer_key.get("questions", [])
            )

    def evaluate_question(self, question, student_answer):
        """Evaluate one attempted question."""

        if student_answer is None:
            student_answer = ""

        keywords = self.keyword_extractor.extract(
            question.get("model_answer", "")
        )
        question_id = question.get("question_id")

        keyword_result = self.keyword_matcher.evaluate(
            student_answer,
            keywords
        )

        semantic_score = (
            self.semantic_similarity.calculate_similarity_with_cached_model(
                question_id,
                student_answer
            )
        )

        marks_awarded = self.scorer.calculate_score(
            keyword_score=keyword_result["keyword_score"],
            semantic_similarity_score=semantic_score,
            max_marks=question.get("max_marks", 0)
        )

        return {
            "keyword_evidence": {
                "matched_keywords": keyword_result["matched_keywords"],
                "missing_keywords": keyword_result["missing_keywords"],
                "keyword_score": keyword_result["keyword_score"]
            },
            "semantic_similarity_score": semantic_score,
            "marks_awarded": marks_awarded
        }

    def evaluate(self, answer_key, student_submission):
        """Evaluate all questions for one student."""

        exam_id = answer_key.get("exam_id")
        student = student_submission.get("student", {})
        student_answers = student_submission.get("answers", {})
        questions = answer_key.get("questions", [])

        results = {
            "exam_id": exam_id,
            "student": {
                "roll_no": student.get("roll_no"),
                "name": student.get("name")
            },
            "questions": []
        }

        for question in questions:
            question_id = question.get("question_id")
            question_key = str(question_id)

            answer_data = student_answers.get(
                question_key,
                {
                    "attempted": False,
                    "answer": None
                }
            )

            attempted = answer_data.get("attempted", False)
            student_answer = answer_data.get("answer")

            question_result = {
                "question_id": question_id,
                "part": question.get("part"),
                "max_marks": question.get("max_marks"),
                "attempted": attempted
            }

            if not attempted:
                question_result["evaluation"] = None
            else:
                question_result["evaluation"] = self.evaluate_question(
                    question,
                    student_answer
                )

            results["questions"].append(question_result)

        return results
