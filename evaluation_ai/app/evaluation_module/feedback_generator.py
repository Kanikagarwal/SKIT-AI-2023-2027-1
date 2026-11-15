class FeedbackGenerator:
    """
    Generates rule-based feedback using the existing
    keyword and semantic evaluation evidence.

    Feedback does not modify evaluation marks.
    """

    def __init__(self, strong_threshold=75.0, moderate_threshold=50.0):
        if not 0 <= moderate_threshold <= strong_threshold <= 100:
            raise ValueError("Invalid feedback thresholds.")

        self.strong_threshold = strong_threshold
        self.moderate_threshold = moderate_threshold

    def generate_question_feedback(self, question_result):
        """Generate feedback for one evaluated question."""

        if not question_result.get("attempted", False):
            return {
                "strengths": [],
                "improvements": [
                    "No response was submitted for this question."
                ],
                "summary": "This question was not attempted."
            }

        evaluation = question_result.get("evaluation")

        if not isinstance(evaluation, dict):
            raise ValueError(
                "Evaluation evidence is required for attempted questions."
            )

        evidence = evaluation.get("keyword_evidence", {})
        semantic_score = evaluation.get("semantic_similarity_score")

        if not isinstance(evidence, dict) or semantic_score is None:
            raise ValueError("Incomplete evaluation evidence.")

        if not isinstance(semantic_score, (int, float)):
            raise ValueError("Semantic similarity must be numeric.")

        if not 0 <= semantic_score <= 100:
            raise ValueError(
                "Semantic similarity must be between 0 and 100."
            )

        matched = evidence.get("matched_keywords", [])
        missing = evidence.get("missing_keywords", [])

        if not isinstance(matched, list) or not isinstance(missing, list):
            raise ValueError("Keyword evidence must contain lists.")

        strengths = []
        improvements = []

        if semantic_score >= self.strong_threshold:
            strengths.append(
                "Your answer shows strong semantic alignment "
                "with the model answer."
            )
        elif semantic_score >= self.moderate_threshold:
            strengths.append(
                "Your answer shows partial semantic alignment "
                "with the model answer."
            )
        else:
            improvements.append(
                "Consider reviewing the expected explanation "
                "and making your answer more relevant to the question."
            )

        if matched:
            keywords = ", ".join(str(item) for item in matched[:5])
            strengths.append(
                f"These expected keywords were detected: {keywords}."
            )

        if missing:
            keywords = ", ".join(str(item) for item in missing[:5])
            improvements.append(
                f"These expected keywords were not detected: {keywords}. "
                "Review whether these concepts are relevant and should "
                "be included in your explanation."
            )

        if not strengths:
            strengths.append(
                "Review the question and model-answer comparison "
                "to identify areas of alignment."
            )

        if not improvements:
            improvements.append(
                "Continue using clear explanations and relevant "
                "technical terminology."
            )

        summary = (
            "Your response demonstrates strong semantic alignment "
            "with the expected answer."
            if semantic_score >= self.strong_threshold
            else
            "Your response shows partial semantic alignment with "
            "the expected answer."
            if semantic_score >= self.moderate_threshold
            else
            "Your response would benefit from a more complete and "
            "relevant explanation."
        )

        return {
            "strengths": strengths,
            "improvements": improvements,
            "summary": summary
        }

    def generate_overall_feedback(self, student_result):
        """Generate concise feedback across the complete examination."""

        questions = student_result.get("questions", [])

        if not questions:
            return "No question-level evaluation data is available."

        total_marks = student_result.get("total_marks_awarded", 0.0)
        maximum_marks = sum(
            question.get("max_marks", 0) or 0
            for question in questions
        )

        attempted_count = sum(
            1 for question in questions
            if question.get("attempted", False)
        )

        if maximum_marks <= 0:
            return "Overall feedback could not be generated."

        percentage = (total_marks / maximum_marks) * 100

        if percentage >= 75:
            performance = (
                "You demonstrated strong overall performance. "
                "Continue strengthening your explanations."
            )
        elif percentage >= 50:
            performance = (
                "You demonstrated a developing understanding. "
                "Focus on improving answer completeness and "
                "including relevant concepts."
            )
        else:
            performance = (
                "There is scope to strengthen your understanding. "
                "Review the expected concepts and practise writing "
                "more complete answers."
            )

        return (
            f"{performance} "
            f"You attempted {attempted_count} out of "
            f"{len(questions)} questions."
        )