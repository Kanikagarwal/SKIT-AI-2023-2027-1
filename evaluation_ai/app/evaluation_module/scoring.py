class ScoringCalculator:
    """
    Combines keyword matching and semantic similarity
    scores using configurable weights.
    """

    def calculate_weighted_score(
        self,
        keyword_score,
        semantic_score,
        keyword_weight,
        semantic_weight
    ):
        """
        Calculate the combined evaluation score.

        Both scores are expected to be percentages between 0 and 100.
        The weights must add up to 1.
        """

        if keyword_weight < 0 or semantic_weight < 0:
            raise ValueError("Weights cannot be negative.")

        if round(keyword_weight + semantic_weight, 10) != 1.0:
            raise ValueError("Weights must add up to 1.")

        score = (
            keyword_score * keyword_weight
            + semantic_score * semantic_weight
        )

        return round(score, 2)