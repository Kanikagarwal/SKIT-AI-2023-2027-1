from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class SemanticSimilarity:
    """
    Calculates semantic similarity between a model answer
    and a student's answer using sentence embeddings.
    """

    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def calculate_similarity(self, model_answer, student_answer):
        """
        Calculate semantic similarity between two answers.

        Returns:
            float: Similarity score as a percentage from 0 to 100.
        """

        if not model_answer or not student_answer:
            return 0.0

        model_embedding = self.model.encode([model_answer])
        student_embedding = self.model.encode([student_answer])

        similarity = cosine_similarity(
            model_embedding,
            student_embedding
        )[0][0]

        similarity_percentage = similarity * 100

        similarity_percentage = max(
            0.0,
            min(100.0, similarity_percentage)
        )

        return round(float(similarity_percentage), 2)

    def evaluate_question(self, question):
        """
        Evaluate all student answers for a single question.

        Compares each student's answer with the question's
        model answer using semantic similarity.

        Returns:
            list: Semantic similarity results for each student.
        """

        model_answer = question.get("model_answer", "")
        student_answers = question.get("student_answers", [])

        results = []

        for student in student_answers:
            student_id = student.get("student_id")
            student_answer = student.get("answer", "")

            score = self.calculate_similarity(
                model_answer,
                student_answer
            )

            results.append(
                {
                    "student_id": student_id,
                    "semantic_similarity_score": score
                }
            )

        return results


if __name__ == "__main__":
    from evaluation_ai.app.evaluation_module.dataset import EvaluationDataset

    dataset = EvaluationDataset()
    semantic_similarity = SemanticSimilarity()

    questions = dataset.get_all_questions()

    print("Semantic Similarity Evaluation")
    print("=" * 60)

    for question in questions:
        question_id = question.get("question_id")
        question_text = question.get("question")

        print(f"\nQuestion ID: {question_id}")
        print(f"Question: {question_text}")

        results = semantic_similarity.evaluate_question(question)

        for result in results:
            print(
                f"Student ID: {result['student_id']} | "
                f"Semantic Similarity: "
                f"{result['semantic_similarity_score']}%"
            )