from evaluation_ai.app.evaluation_module.dataset import (
    EvaluationDataLoader
)
from evaluation_ai.app.evaluation_module.keyword_extraction import (
    KeywordExtractor
)


loader = EvaluationDataLoader()
answer_key = loader.load_answer_key()

extractor = KeywordExtractor()

for question in answer_key["questions"]:
    question_id = question["question_id"]
    model_answer = question["model_answer"]

    keywords = extractor.extract(model_answer)

    print("=" * 70)
    print(f"QUESTION {question_id}")
    print("=" * 70)

    print("\nYAKE:")
    for keyword in keywords:
        print("-", keyword)

    print()