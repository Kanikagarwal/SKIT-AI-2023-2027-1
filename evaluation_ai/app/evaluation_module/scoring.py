
class AnswerScorer:
    """
    Converts keyword and semantic evaluation evidence into marks.

    The initial weights are configurable baseline assumptions
    and must be validated against teacher-awarded marks.
    """

    def __init__(self, keyword_weight=0.5, semantic_weight=0.5):
        if keyword_weight < 0 or semantic_weight < 0:
            raise ValueError("Scoring weights cannot be negative.")

        if keyword_weight + semantic_weight <= 0:
            raise ValueError("At least one scoring weight must be positive.")

        self.keyword_weight = keyword_weight
        self.semantic_weight = semantic_weight

    def calculate_score(
        self,
        keyword_score,
        semantic_similarity_score,
        max_marks
    ):
        """Calculate a bounded score using weighted evidence."""

        if max_marks < 0:
            raise ValueError("Maximum marks cannot be negative.")

        if not 0 <= keyword_score <= 100:
            raise ValueError("Keyword score must be between 0 and 100.")

        if not 0 <= semantic_similarity_score <= 100:
            raise ValueError(
                "Semantic similarity must be between 0 and 100."
            )

        if max_marks == 0:
            return 0.0

        total_weight = self.keyword_weight + self.semantic_weight

        weighted_percentage = (
            self.keyword_weight * keyword_score
            + self.semantic_weight * semantic_similarity_score
        ) / total_weight

        marks = (weighted_percentage / 100) * max_marks

        return round(max(0.0, min(float(max_marks), marks)), 2)
