import json
from pathlib import Path


class EvaluationDataset:
    """
    Handles loading and accessing the EvalAI evaluation dataset.
    """

    def __init__(self):
        # dataset.md is currently stored at the project root.
        project_root = Path(__file__).resolve().parents[3]
        self.dataset_path = project_root / "dataset.md"

    def load_dataset(self):
        """
        Load the evaluation dataset from the JSON-formatted dataset.md file.
        """

        try:
            with open(self.dataset_path, "r", encoding="utf-8") as file:
                return json.load(file)

        except FileNotFoundError:
            raise FileNotFoundError(
                f"Dataset file not found: {self.dataset_path}"
            )

        except json.JSONDecodeError as error:
            raise ValueError(
                f"Invalid JSON format in dataset: {error}"
            )

    def get_all_questions(self):
        """
        Return all questions in the dataset.
        """

        dataset = self.load_dataset()
        return dataset.get("questions", [])

    def get_question(self, question_id):
        """
        Return a question using its question ID.
        """

        questions = self.get_all_questions()

        for question in questions:
            if question.get("question_id") == question_id:
                return question

        return None

    def get_model_answer(self, question_id):
        """
        Return the model answer for a specific question.
        """

        question = self.get_question(question_id)

        if question:
            return question.get("model_answer")

        return None

    def get_keywords(self, question_id):
        """
        Return the keywords associated with a question.
        """

        question = self.get_question(question_id)

        if question:
            return question.get("keywords", [])

        return []

    def get_student_answers(self, question_id):
        """
        Return all student answers for a specific question.
        """

        question = self.get_question(question_id)

        if question:
            return question.get("student_answers", [])

        return []


if __name__ == "__main__":

    dataset = EvaluationDataset()

    data = dataset.load_dataset()

    print("Evaluation Dataset Loaded Successfully")
    print(f"Dataset: {data.get('dataset_name')}")
    print(f"Version: {data.get('version')}")
    print(f"Number of questions: {len(data.get('questions', []))}")

    print("\nQuestions:")

    for question in data.get("questions", []):
        print(
            f"- {question['question_id']}: "
            f"{question['question']}"
        )