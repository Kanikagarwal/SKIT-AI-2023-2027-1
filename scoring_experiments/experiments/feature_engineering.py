
import re
from pathlib import Path

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from scoring_experiments.experiments.load_dataset import load_dataset

from evaluation_ai.app.evaluation_module.keyword_extraction import (
    KeywordExtractor
)
from evaluation_ai.app.evaluation_module.keyword_matching import (
    KeywordMatcher
)
from evaluation_ai.app.evaluation_module.semantic_similarity import (
    SemanticSimilarity
)


BASE_DIR = Path(__file__).resolve().parent.parent

OUTPUT_PATH = (
    BASE_DIR / "datasets" / "processed" / "feature_dataset.csv"
)


def extract_question_group(response_id):
    """Extract question group from a response ID."""
    match = re.match(r"^(E\d+\.Q\d+)\.", str(response_id))

    if not match:
        raise ValueError(
            f"Invalid response ID format: {response_id}"
        )

    return match.group(1)


def generate_features(data=None, output_path=OUTPUT_PATH):
    """
    Generate keyword and semantic similarity features
    for every student response.
    """

    if data is None:
        data = load_dataset()

    data = data.copy()

    # Identify question groups.
    data["question_group"] = data["id"].apply(
        extract_question_group
    )

    # Verify that each question group has one instructor answer.
    instructor_counts = (
        data.groupby("question_group")["instructor_answer"]
        .nunique()
    )

    if (instructor_counts > 1).any():
        raise ValueError(
            "Some question groups contain multiple instructor answers."
        )

    # Initialize existing project components.
    keyword_extractor = KeywordExtractor()
    keyword_matcher = KeywordMatcher()
    semantic_model = SemanticSimilarity()

    # Extract keywords once per question group.
    instructor_answers = (
        data.groupby("question_group")["instructor_answer"]
        .first()
        .to_dict()
    )

    keywords_by_question = {
        question_id: keyword_extractor.extract(answer)
        for question_id, answer in instructor_answers.items()
    }

    # Calculate keyword matching scores.
    keyword_scores = []

    for _, row in data.iterrows():
        keywords = keywords_by_question[row["question_group"]]

        result = keyword_matcher.evaluate(
            row["student_answer"],
            keywords
        )

        keyword_scores.append(result["keyword_score"])

    # Calculate semantic similarity efficiently in batches.
    question_ids = list(instructor_answers.keys())
    model_answers = [
        instructor_answers[question_id]
        for question_id in question_ids
    ]

    student_answers = data["student_answer"].tolist()

    model_embeddings = semantic_model.model.encode(
        model_answers,
        show_progress_bar=True,
        batch_size=32
    )

    student_embeddings = semantic_model.model.encode(
        student_answers,
        show_progress_bar=True,
        batch_size=32
    )

    similarity_matrix = cosine_similarity(
        model_embeddings,
        student_embeddings
    )

    question_index = {
        question_id: index
        for index, question_id in enumerate(question_ids)
    }

    semantic_scores = []

    for position, (_, row) in enumerate(data.iterrows()):
        model_index = question_index[row["question_group"]]

        similarity = similarity_matrix[
            model_index, position
        ]

        similarity_percentage = max(
            0.0, min(100.0, similarity * 100)
        )

        semantic_scores.append(
            round(float(similarity_percentage), 2)
        )

    # Construct the feature dataset.
    features = pd.DataFrame({
        "response_id": data["id"],
        "question_group": data["question_group"],
        "question_text": data["question"],
        "keyword_score": keyword_scores,
        "semantic_similarity_score": semantic_scores,
        "human_score": data["score_avg"]
    })

    # Validate generated features.
    if features.isnull().any().any():
        raise ValueError(
            "Feature dataset contains missing values."
        )

    if not features["keyword_score"].between(0, 100).all():
        raise ValueError("Invalid keyword scores.")

    if not features["semantic_similarity_score"].between(
        0, 100
    ).all():
        raise ValueError("Invalid semantic similarity scores.")

    if not features["human_score"].between(0, 5).all():
        raise ValueError("Invalid human reference scores.")

    # Save the feature dataset.
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    features.to_csv(output_path, index=False)

    print("\nFEATURE ENGINEERING COMPLETED")
    print("=" * 45)
    print(f"Total responses: {len(features)}")
    print(f"Question groups: {features['question_group'].nunique()}")
    print(f"Output file: {output_path}")
    print("\nFeature dataset preview:")
    print(features.head())

    return features


if __name__ == "__main__":
    generate_features()
