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
        model_embedding = self.model.encode([model_answer])
        student_embedding = self.model.encode([student_answer])

        similarity = cosine_similarity(
            model_embedding,
            student_embedding
        )[0][0]

        similarity_percentage = similarity * 100

        return round(float(similarity_percentage), 2)


if __name__ == "__main__":
    semantic_similarity = SemanticSimilarity()

    model_answer = (
        "Machine Learning enables computers to learn patterns "
        "from data and improve their performance without "
        "being explicitly programmed."
    )

    student_answer = (
        "Machine learning allows computers to learn from data "
        "and improve automatically."
    )

    score = semantic_similarity.calculate_similarity(
        model_answer,
        student_answer
    )

    print("Model Answer:", model_answer)
    print("Student Answer:", student_answer)
    print("Semantic Similarity Score:", f"{score}%")