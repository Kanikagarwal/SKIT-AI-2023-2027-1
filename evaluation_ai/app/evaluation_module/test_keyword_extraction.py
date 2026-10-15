from evaluation_ai.app.evaluation_module.keyword_extraction import (
    KeywordExtractor
)


def test_yake_extracts_keyphrases():
    extractor = KeywordExtractor()

    text = (
        "REST defines client-server separation, stateless communication, "
        "cacheable responses, a uniform interface and a layered system."
    )

    result = extractor.extract_with_yake(text)

    assert isinstance(result, list)
    assert len(result) > 0


def test_empty_text_returns_empty_list():
    extractor = KeywordExtractor()

    assert extractor.extract_with_yake("") == []


def test_extract_returns_yake_results():
    extractor = KeywordExtractor()

    text = (
        "Cloud computing provides IoT systems with storage, "
        "processing and data analysis."
    )

    result = extractor.extract(text)

    assert isinstance(result, list)
    assert len(result) > 0


def test_extracted_phrases_are_valid():
    extractor = KeywordExtractor()

    text = (
        "IoT systems use sensors for data collection, "
        "communication and processing."
    )

    result = extractor.extract(text)

    assert all(
        isinstance(keyword, str)
        for keyword in result
    )

    assert all(
        1 <= len(keyword.split()) <= 3
        for keyword in result
    )