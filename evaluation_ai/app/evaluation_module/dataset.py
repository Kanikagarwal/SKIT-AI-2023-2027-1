import json
from pathlib import Path


class EvaluationDataLoader:
    """
    Loads and validates the answer key and student submissions
    used by the evaluation system.
    """

    def __init__(self):
        project_root = Path(__file__).resolve().parents[3]

        self.datasets_path = project_root / "datasets"
        self.answer_key_path = self.datasets_path / "model_answers.json"
        self.students_path = self.datasets_path / "students"

    def _load_json(self, file_path):
        """Load a JSON file and return its contents."""
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)

        except FileNotFoundError:
            raise FileNotFoundError(
                f"JSON file not found: {file_path}"
            )

        except json.JSONDecodeError as error:
            raise ValueError(
                f"Invalid JSON format in {file_path}: {error}"
            )

    def load_answer_key(self):
        """Load and validate the exam answer key."""
        answer_key = self._load_json(self.answer_key_path)
        self._validate_answer_key(answer_key)
        return answer_key

    def load_student_submission(self, file_name):
        """Load and validate one student's submission."""
        student_path = self.students_path / file_name
        submission = self._load_json(student_path)
        self._validate_student_submission(submission)
        return submission

    def load_all_student_submissions(self):
        """Load and validate all student submissions."""
        if not self.students_path.exists():
            raise FileNotFoundError(
                f"Student submissions directory not found: "
                f"{self.students_path}"
            )

        student_files = sorted(self.students_path.glob("*.json"))

        return [
            self.load_student_submission(student_file.name)
            for student_file in student_files
        ]

    def _validate_answer_key(self, answer_key):
        """Validate the structure of the answer key."""

        required_fields = [
            "exam_id",
            "exam",
            "sections",
            "questions"
        ]

        for field in required_fields:
            if field not in answer_key:
                raise ValueError(
                    f"Answer key is missing required field: '{field}'"
                )

        if not isinstance(answer_key["questions"], list):
            raise ValueError(
                "Answer key 'questions' must be a list."
            )

        if len(answer_key["questions"]) == 0:
            raise ValueError(
                "Answer key must contain at least one question."
            )

        question_ids = set()

        for question in answer_key["questions"]:
            required_question_fields = [
                "question_id",
                "part",
                "question",
                "max_marks",
                "model_answer",
                "keywords"
            ]

            for field in required_question_fields:
                if field not in question:
                    raise ValueError(
                        f"Question is missing required field: '{field}'"
                    )

            question_id = question["question_id"]

            if question_id in question_ids:
                raise ValueError(
                    f"Duplicate question_id found: {question_id}"
                )

            question_ids.add(question_id)

            if not isinstance(question["keywords"], list):
                raise ValueError(
                    f"Keywords for question {question_id} "
                    "must be a list."
                )

    def _validate_student_submission(self, submission):
        """Validate the structure of one student submission."""

        required_fields = [
            "exam_id",
            "student",
            "answers"
        ]

        for field in required_fields:
            if field not in submission:
                raise ValueError(
                    f"Student submission is missing required field: "
                    f"'{field}'"
                )

        student = submission["student"]

        if not isinstance(student, dict):
            raise ValueError(
                "Student field must be an object."
            )

        if not student.get("roll_no"):
            raise ValueError(
                "Student submission must contain a roll_no."
            )

        if not student.get("name"):
            raise ValueError(
                "Student submission must contain a name."
            )

        answers = submission["answers"]

        if not isinstance(answers, dict):
            raise ValueError(
                "Student 'answers' must be an object."
            )

        # Every answer entry must contain attempted + answer.
        for question_id, answer_data in answers.items():

            if not isinstance(answer_data, dict):
                raise ValueError(
                    f"Answer for question {question_id} "
                    "must be an object."
                )

            if "attempted" not in answer_data:
                raise ValueError(
                    f"Question {question_id} is missing "
                    "'attempted' field."
                )

            if "answer" not in answer_data:
                raise ValueError(
                    f"Question {question_id} is missing "
                    "'answer' field."
                )

            attempted = answer_data["attempted"]
            answer = answer_data["answer"]

            if not isinstance(attempted, bool):
                raise ValueError(
                    f"'attempted' for question {question_id} "
                    "must be true or false."
                )

            if attempted and not isinstance(answer, str):
                raise ValueError(
                    f"Answer for attempted question {question_id} "
                    "must be a string."
                )

            if not attempted and answer is not None:
                raise ValueError(
                    f"Question {question_id} is marked as not attempted "
                    "but contains an answer."
                )

        # Part C contains Q6 and Q7.
        q6 = answers.get("6", {})
        q7 = answers.get("7", {})

        q6_attempted = q6.get("attempted", False)
        q7_attempted = q7.get("attempted", False)

        if q6_attempted == q7_attempted:
            raise ValueError(
                "Part C requires exactly one of question 6 or "
                "question 7 to be attempted."
            )

    def get_questions(self):
        """Return all questions from the answer key."""
        answer_key = self.load_answer_key()
        return answer_key.get("questions", [])

    def get_question(self, question_id):
        """Return one question from the answer key."""
        questions = self.get_questions()

        for question in questions:
            if question.get("question_id") == question_id:
                return question

        return None

    def get_model_answer(self, question_id):
        """Return the model answer for a question."""
        question = self.get_question(question_id)

        if question:
            return question.get("model_answer", "")

        return None

    def get_keywords(self, question_id):
        """Return the keywords for a question."""
        question = self.get_question(question_id)

        if question:
            return question.get("keywords", [])

        return []

    def get_max_marks(self, question_id):
        """Return the maximum marks for a question."""
        question = self.get_question(question_id)

        if question:
            return question.get("max_marks", 0)

        return None