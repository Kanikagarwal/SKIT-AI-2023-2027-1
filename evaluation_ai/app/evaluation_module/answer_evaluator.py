from evaluation_ai.app.evaluation_module.keyword_matching import KeywordMatcher
from evaluation_ai.app.evaluation_module.semantic_similarity import (
    SemanticSimilarity
)


class AnswerEvaluator:
    """
    Combines keyword matching and semantic similarity
    to evaluate a student's answer.
    """

    def __init__(self):
        self.keyword_matcher = KeywordMatcher()
        self.semantic_similarity = SemanticSimilarity()

    def evaluate(self, question, student_answer):
        """
        Evaluate a student answer using keyword matching
        and semantic similarity.

        Returns:
            dict: Combined evaluation result.
        """

        keywords = question.get("keywords", [])
        model_answer = question.get("model_answer", "")

        keyword_result = self.keyword_matcher.evaluate(
            student_answer,
            keywords
        )

        semantic_score = self.semantic_similarity.calculate_similarity(
            model_answer,
            student_answer
        )

        keyword_score = keyword_result["keyword_score"]

        combined_score = (
            (keyword_score + semantic_score) / 2
        )

        return {
            "keyword_score": keyword_score,
            "semantic_similarity_score": semantic_score,
            "combined_score": round(combined_score, 2),
            "matched_keywords": keyword_result["matched_keywords"],
            "missing_keywords": keyword_result["missing_keywords"]
        }


if __name__ == "__main__":
    from evaluation_ai.app.evaluation_module.dataset import EvaluationDataset

    dataset = EvaluationDataset()
    evaluator = AnswerEvaluator()

    question = dataset.get_question("Q001")

    if question is None:
        print("Question not found.")
        exit()

    print("Answer Evaluation")
    print("=" * 60)

    for student in question.get("student_answers", []):
        result = evaluator.evaluate(
            question,
            student.get("answer", "")
        )

        print(f"\nStudent ID: {student.get('student_id')}")
        print(f"Keyword Score: {result['keyword_score']}%")
        print(
            "Semantic Similarity: "
            f"{result['semantic_similarity_score']}%"
        )
        print(f"Combined Score: {result['combined_score']}%")
        print(f"Matched Keywords: {result['matched_keywords']}")
        print(f"Missing Keywords: {result['missing_keywords']}")