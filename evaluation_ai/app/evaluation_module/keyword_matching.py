import re

from nltk.stem import WordNetLemmatizer


class KeywordMatcher:
    """
    Extracts keyword-based evidence from student answers.

    The matcher normalizes text, tokenizes it, lemmatizes words,
    and supports both single-word and multi-word keywords.
    """

    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()

    def normalize_text(self, text):
        """
        Normalize text by converting it to lowercase and
        removing punctuation.
        """

        if not isinstance(text, str):
            return ""

        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text)

        return text.strip()

    def lemmatize_text(self, text):
        """
        Tokenize and lemmatize normalized text.

        WordNet defaults to noun lemmatization, so common
        plural forms such as 'sensors' become 'sensor'.
        """

        normalized_text = self.normalize_text(text)

        if not normalized_text:
            return []

        tokens = normalized_text.split()

        return [
            self.lemmatizer.lemmatize(token)
            for token in tokens
        ]

    def lemmatize_keyword(self, keyword):
        """
        Lemmatize a keyword while preserving its token sequence.
        """

        return self.lemmatize_text(keyword)

    def keyword_matches(self, answer_tokens, keyword_tokens):
        """
        Determine whether a keyword token sequence occurs
        consecutively within the answer token sequence.
        """

        if not keyword_tokens:
            return False

        keyword_length = len(keyword_tokens)

        for index in range(
            len(answer_tokens) - keyword_length + 1
        ):
            if answer_tokens[
                index:index + keyword_length
            ] == keyword_tokens:
                return True

        return False

    def find_matched_keywords(self, student_answer, keywords):
        """
        Return keywords whose lemmatized form occurs in
        the student's answer.
        """

        answer_tokens = self.lemmatize_text(student_answer)

        matched_keywords = []

        for keyword in keywords:
            keyword_tokens = self.lemmatize_keyword(keyword)

            if self.keyword_matches(
                answer_tokens,
                keyword_tokens
            ):
                matched_keywords.append(keyword)

        return matched_keywords

    def find_missing_keywords(self, student_answer, keywords):
        """
        Return keywords that were not found in the student's answer.
        """

        matched_keywords = self.find_matched_keywords(
            student_answer,
            keywords
        )

        return [
            keyword
            for keyword in keywords
            if keyword not in matched_keywords
        ]

    def calculate_keyword_score(self, student_answer, keywords):
        """
        Calculate the percentage of keywords matched.
        """

        if not keywords:
            return 0.0

        matched_keywords = self.find_matched_keywords(
            student_answer,
            keywords
        )

        score = (
            len(matched_keywords) / len(keywords)
        ) * 100

        return round(score, 2)

    def evaluate(self, student_answer, keywords):
        """
        Return keyword matching evidence for one answer.
        """

        matched_keywords = self.find_matched_keywords(
            student_answer,
            keywords
        )

        missing_keywords = self.find_missing_keywords(
            student_answer,
            keywords
        )

        score = self.calculate_keyword_score(
            student_answer,
            keywords
        )

        return {
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "keyword_score": score
        }