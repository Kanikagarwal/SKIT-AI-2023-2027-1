import pytest

from evaluation_ai.app.evaluation_module.scoring import (
    ScoringCalculator
)


def test_calculate_weighted_score():
    calculator = ScoringCalculator()

    score = calculator.calculate_weighted_score(
        keyword_score=80,
        semantic_score=70,
        keyword_weight=0.4,
        semantic_weight=0.6
    )

    assert score == 74.0


def test_weights_must_add_to_one():
    calculator = ScoringCalculator()

    with pytest.raises(ValueError):
        calculator.calculate_weighted_score(
            keyword_score=80,
            semantic_score=70,
            keyword_weight=0.5,
            semantic_weight=0.6
        )


def test_weights_cannot_be_negative():
    calculator = ScoringCalculator()

    with pytest.raises(ValueError):
        calculator.calculate_weighted_score(
            keyword_score=80,
            semantic_score=70,
            keyword_weight=-0.2,
            semantic_weight=1.2
        )