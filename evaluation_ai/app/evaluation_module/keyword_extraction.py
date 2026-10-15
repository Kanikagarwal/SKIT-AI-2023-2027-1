import re

import yake


class KeywordExtractor:
    """
    Extracts candidate keyphrases from model answers using YAKE.
    """

    def __init__(self):
        self.extractor = yake.KeywordExtractor(
            lan="en",
            n=3,
            dedupLim=0.7,
            top=15
        )

    def extract_with_yake(self, text):
        """
        Extract keyphrases from text using YAKE.
        """

        if not isinstance(text, str) or not text.strip():
            return []

        keywords = self.extractor.extract_keywords(text)

        return [
            keyword
            for keyword, score in keywords
            if self._is_valid_phrase(keyword)
        ]

    def _is_valid_phrase(self, phrase):
        """
        Remove noisy sentence fragments while keeping
        meaningful technical keyphrases.
        """

        phrase = phrase.strip()

        if not phrase:
            return False

        words = phrase.split()

        if len(words) > 3:
            return False

        stopwords = {
            "the", "a", "an", "and", "or", "of", "to",
            "is", "are", "with", "for", "in", "on",
            "by", "from", "as", "that", "this"
        }

        if any(word.lower() in stopwords for word in words):
            return False

        action_words = {
            "include", "includes", "defines", "provides",
            "provide", "send", "sends", "receive", "receives",
            "measures", "measure", "collects", "collect",
            "requires", "allows", "uses", "use", "gives",
            "gives", "stores", "store", "processes",
            "processed", "analyzed", "analyze", "designed"
        }

        if any(word.lower() in action_words for word in words):
            return False

        return True

    def extract(self, text):
        """
        Return automatically extracted keyphrases.
        """

        return self.extract_with_yake(text)