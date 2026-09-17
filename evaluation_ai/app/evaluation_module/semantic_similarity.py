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

        # Handle empty answers
        if not model_answer or not student_answer:
            return 0.0

        # Generate embeddings for both answers
        model_embedding = self.model.encode([model_answer])
        student_embedding = self.model.encode([student_answer])

        # Calculate cosine similarity
        similarity = cosine_similarity(
            model_embedding,
            student_embedding
        )[0][0]

        # Convert similarity to percentage
        similarity_percentage = similarity * 100

        # Keep the final score within 0-100%
        similarity_percentage = max(
            0.0,
            min(100.0, similarity_percentage)
        )

        return round(float(similarity_percentage), 2)


if __name__ == "__main__":
    semantic_similarity = SemanticSimilarity()

    test_cases = [
        {
            "name": "Similar answers",
            "model_answer": (
                "Machine Learning enables computers to learn patterns "
                "from data and improve their performance without "
                "being explicitly programmed."
            ),
            "student_answer": (
                "Machine learning allows computers to learn from data "
                "and improve automatically."
            )
        },
        {
            "name": "Identical answers",
            "model_answer": "Artificial Intelligence is a branch of computer science.",
            "student_answer": "Artificial Intelligence is a branch of computer science."
        },
        {
            "name": "Unrelated answers",
            "model_answer": "Machine Learning allows computers to learn from data.",
            "student_answer": "The capital of France is Paris."
        },
        {
            "name": "Empty student answer",
            "model_answer": "Artificial Intelligence is a branch of computer science.",
            "student_answer": ""
        }
    ]

    print("Semantic Similarity Evaluation")
    print("=" * 60)

    for test_case in test_cases:
        score = semantic_similarity.calculate_similarity(
            test_case["model_answer"],
            test_case["student_answer"]
        )

        print(f"\nTest Case: {test_case['name']}")
        print(f"Similarity Score: {score}%")