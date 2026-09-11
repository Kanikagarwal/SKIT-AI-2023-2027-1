from evaluation_ai.app.evaluation_module.keyword_matching import KeywordMatcher


def test_normalize_text():
    matcher = KeywordMatcher()

    result = matcher.normalize_text("Artificial Intelligence!")

    assert result == "artificial intelligence"


def test_find_matched_keywords():
    matcher = KeywordMatcher()

    student_answer = (
        "Artificial Intelligence allows machines "
        "to perform intelligent tasks."
    )

    keywords = [
        "Artificial Intelligence",
        "machines",
        "learning",
        "reasoning"
    ]

    result = matcher.find_matched_keywords(
        student_answer,
        keywords
    )

    assert result == [
        "Artificial Intelligence",
        "machines"
    ]


def test_calculate_keyword_score():
    matcher = KeywordMatcher()

    student_answer = (
        "Artificial Intelligence allows machines "
        "to perform intelligent tasks."
    )

    keywords = [
        "Artificial Intelligence",
        "machines",
        "learning",
        "reasoning"
    ]

    result = matcher.calculate_keyword_score(
        student_answer,
        keywords
    )

    assert result == 50.0


def test_find_missing_keywords():
    matcher = KeywordMatcher()

    student_answer = (
        "Artificial Intelligence allows machines "
        "to perform intelligent tasks."
    )

    keywords = [
        "Artificial Intelligence",
        "machines",
        "learning",
        "reasoning"
    ]

    result = matcher.find_missing_keywords(
        student_answer,
        keywords
    )

    assert result == [
        "learning",
        "reasoning"
    ]


def test_evaluate():
    matcher = KeywordMatcher()

    student_answer = (
        "Artificial Intelligence allows machines "
        "to perform intelligent tasks."
    )

    keywords = [
        "Artificial Intelligence",
        "machines",
        "learning",
        "reasoning"
    ]

    result = matcher.evaluate(
        student_answer,
        keywords
    )

    assert result["matched_keywords"] == [
        "Artificial Intelligence",
        "machines"
    ]

    assert result["missing_keywords"] == [
        "learning",
        "reasoning"
    ]

    assert result["keyword_score"] == 50.0