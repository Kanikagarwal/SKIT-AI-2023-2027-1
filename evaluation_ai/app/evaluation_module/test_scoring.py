
import pytest

from evaluation_ai.app.evaluation_module.scoring import AnswerScorer


def test_full_scores_produce_full_marks():
    scorer = AnswerScorer()

    assert scorer.calculate_score(100, 100, 6) == 6.0


def test_zero_scores_produce_zero_marks():
    scorer = AnswerScorer()

    assert scorer.calculate_score(0, 0, 6) == 0.0


def test_partial_scores_produce_partial_marks():
    scorer = AnswerScorer()

    assert scorer.calculate_score(50, 70, 4) == 2.4


def test_score_never_exceeds_maximum_marks():
    scorer = AnswerScorer()

    assert scorer.calculate_score(100, 100, 2) <= 2


def test_zero_maximum_marks_produce_zero():
    scorer = AnswerScorer()

    assert scorer.calculate_score(80, 90, 0) == 0.0


def test_custom_weights_are_supported():
    scorer = AnswerScorer(
        keyword_weight=0.7,
        semantic_weight=0.3
    )

    assert scorer.calculate_score(100, 0, 2) == 1.4


@pytest.mark.parametrize(
    "keyword_score, semantic_score, max_marks",
    [
        (-1, 50, 2),
        (101, 50, 2),
        (50, -1, 2),
        (50, 101, 2),
        (50, 50, -1),
    ]
)
def test_invalid_scores_are_rejected(
    keyword_score,
    semantic_score,
    max_marks
):
    scorer = AnswerScorer()

    with pytest.raises(ValueError):
        scorer.calculate_score(
            keyword_score,
            semantic_score,
            max_marks
        )


def test_negative_weights_are_rejected():
    with pytest.raises(ValueError):
        AnswerScorer(keyword_weight=-1, semantic_weight=2)


def test_both_zero_weights_are_rejected():
    with pytest.raises(ValueError):
        AnswerScorer(keyword_weight=0, semantic_weight=0)
