import re


class KeywordMatcher:
    """
    Compares a student's answer with the expected keywords
    for a particular question.
    """

    def normalize_text(self, text):
        """
        Convert text to lowercase and remove punctuation.
        """

        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", "", text)

        return text

    def find_matched_keywords(self, student_answer, keywords):
        """
        Find which expected keywords are present in the student's answer.
        """

        normalized_answer = self.normalize_text(student_answer)

        matched_keywords = []

        for keyword in keywords:

            normalized_keyword = self.normalize_text(keyword)

            if normalized_keyword in normalized_answer:
                matched_keywords.append(keyword)

        return matched_keywords

    def find_missing_keywords(self, student_answer, keywords):
        """
        Find which expected keywords are missing from the student's answer.
        """

        matched_keywords = self.find_matched_keywords(
            student_answer,
            keywords
        )

        missing_keywords = [
            keyword
            for keyword in keywords
            if keyword not in matched_keywords
        ]

        return missing_keywords

    def calculate_keyword_score(self, student_answer, keywords):
        """
        Calculate the percentage of expected keywords
        found in the student's answer.
        """

        if not keywords:
            return 0.0

        matched_keywords = self.find_matched_keywords(
            student_answer,
            keywords
        )

        score = (len(matched_keywords) / len(keywords)) * 100

        return round(score, 2)

    def evaluate(self, student_answer, keywords):
        """
        Return a complete keyword evaluation result.
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

if __name__ == "__main__":

    from dataset import EvaluationDataset

    dataset = EvaluationDataset()
    matcher = KeywordMatcher()

    question = dataset.get_question("Q001")

    if question is None:
        print("Question not found.")
        exit()

    keywords = question["keywords"]
    student_answers = question["student_answers"]

    print("Question:", question["question"])
    print("Maximum Marks:", question["max_marks"])
    print()

    for student in student_answers:

        student_id = student["student_id"]
        student_answer = student["answer"]

        matched = matcher.find_matched_keywords(
            student_answer,
            keywords
        )

        missing = matcher.find_missing_keywords(
            student_answer,
            keywords
        )

        score = matcher.calculate_keyword_score(
            student_answer,
            keywords
        )

        print("Student ID:", student_id)
        print("Student Answer:", student_answer)
        print("Matched Keywords:", matched)
        print("Missing Keywords:", missing)
        print("Keyword Match Score:", f"{score}%")
        print("-" * 60)