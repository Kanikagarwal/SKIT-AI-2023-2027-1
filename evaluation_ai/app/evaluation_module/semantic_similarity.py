from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class SemanticSimilarity:
    """
    Calculates semantic similarity between model answers
    and student answers.

    The transformer model is loaded once when this object is
    created. Model-answer embeddings can be cached and reused
    across multiple student evaluations.
    """

    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.model_answer_embeddings = {}

    def calculate_similarity(self, model_answer, student_answer):
        """
        Calculate semantic similarity between one model answer
        and one student answer.

        Returns a percentage between 0 and 100.
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

    def cache_model_answers(self, questions):
        """
        Encode and cache model answers for the supplied questions.

        Model answers are encoded only once and reused for
        subsequent student evaluations.
        """

        model_answers = []
        question_ids = []

        for question in questions:
            question_id = question.get("question_id")
            model_answer = question.get("model_answer", "")

            if not model_answer:
                continue

            question_ids.append(question_id)
            model_answers.append(model_answer)

        if not model_answers:
            return

        embeddings = self.model.encode(model_answers)

        for question_id, embedding in zip(
            question_ids,
            embeddings
        ):
            self.model_answer_embeddings[question_id] = embedding

    def calculate_similarity_with_cached_model(
        self,
        question_id,
        student_answer
    ):
        """
        Calculate semantic similarity using a cached model-answer
        embedding.
        """

        if not student_answer:
            return 0.0

        model_embedding = self.model_answer_embeddings.get(
            question_id
        )

        if model_embedding is None:
            raise ValueError(
                f"No cached model answer found for "
                f"question {question_id}."
            )

        student_embedding = self.model.encode([student_answer])

        similarity = cosine_similarity(
            [model_embedding],
            student_embedding
        )[0][0]

        similarity_percentage = similarity * 100

        similarity_percentage = max(
            0.0,
            min(100.0, similarity_percentage)
        )

        return round(float(similarity_percentage), 2)