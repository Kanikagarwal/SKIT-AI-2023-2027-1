from evaluation_ai.app.evaluation_module.keyword_matching import KeywordMatcher


def test_keyword_matching_finds_present_keywords():
    matcher = KeywordMatcher()

    answer = (
    "IoT devices use connectivity and sensing. "
    "They support communication and data processing through a network."
    )

    keywords = [
        "connectivity",
        "sensing",
        "communication",
        "data processing"
    ]

    result = matcher.evaluate(answer, keywords)

    assert "connectivity" in result["matched_keywords"]
    assert "sensing" in result["matched_keywords"]
    assert "communication" in result["matched_keywords"]
    assert "data processing" in result["matched_keywords"]


def test_keyword_matching_identifies_missing_keywords():
    matcher = KeywordMatcher()

    answer = (
        "IoT devices use connectivity and sensing "
        "to collect information."
    )

    keywords = [
        "connectivity",
        "sensing",
        "communication",
        "data processing"
    ]

    result = matcher.evaluate(answer, keywords)

    assert "connectivity" in result["matched_keywords"]
    assert "sensing" in result["matched_keywords"]

    assert "communication" in result["missing_keywords"]
    assert "data processing" in result["missing_keywords"]


def test_keyword_matching_is_case_insensitive():
    matcher = KeywordMatcher()

    answer = "IoT uses CLOUD COMPUTING for data storage."

    keywords = [
        "cloud computing",
        "storage"
    ]

    result = matcher.evaluate(answer, keywords)

    assert "cloud computing" in result["matched_keywords"]
    assert "storage" in result["matched_keywords"]


def test_keyword_score_is_calculated_correctly():
    matcher = KeywordMatcher()

    answer = "IoT uses connectivity and sensing."

    keywords = [
        "connectivity",
        "sensing",
        "communication",
        "intelligence"
    ]

    result = matcher.evaluate(answer, keywords)

    assert result["keyword_score"] == 50.0


def test_empty_answer_produces_no_keyword_matches():
    matcher = KeywordMatcher()

    keywords = [
        "connectivity",
        "sensing",
        "communication"
    ]

    result = matcher.evaluate("", keywords)

    assert result["matched_keywords"] == []
    assert result["missing_keywords"] == keywords
    assert result["keyword_score"] == 0.0


def test_empty_keyword_list_returns_zero_score():
    matcher = KeywordMatcher()

    result = matcher.evaluate(
        "IoT devices communicate through networks.",
        []
    )

    assert result["matched_keywords"] == []
    assert result["missing_keywords"] == []
    assert result["keyword_score"] == 0.0

def test_keyword_matching_handles_plural_forms():
    matcher = KeywordMatcher()

    answer = (
        "IoT systems use sensors to collect information "
        "from the environment."
    )

    keywords = ["sensor"]

    result = matcher.evaluate(answer, keywords)

    assert "sensor" in result["matched_keywords"]


def test_keyword_matching_handles_verb_forms():
    matcher = KeywordMatcher()

    answer = (
        "IoT devices communicate with each other "
        "through a network."
    )

    keywords = ["communicate"]

    result = matcher.evaluate(answer, keywords)

    assert "communicate" in result["matched_keywords"]