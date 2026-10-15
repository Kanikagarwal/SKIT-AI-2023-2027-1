# Evaluation AI

## Project

**EvalAI - AI Based Answer Evaluation System**

## Module

**Answer Evaluation & Scoring**

## Developer

Member 1

---

## 1. Module Overview

This module is responsible for the automated evaluation of student answers against predefined model answers.

The evaluation process will use:

- Keyword matching
- Semantic similarity
- Evaluation criteria
- Rubric-based scoring
- Feedback generation

The module is being developed incrementally according to the project timeline.

---

## 2. Current Development Status

### August - Evaluation Dataset

Work completed:

- Created the evaluation dataset containing questions, model answers, student answers and maximum marks.
- Implemented dataset loading.
- Implemented question retrieval.
- Implemented model answer retrieval.
- Implemented student answer retrieval.
- Designed the dataset to support automatic keyword extraction instead of manually storing keywords.

### September - Answer Evaluation

#### Milestone 1 - Keyword Extraction and Matching

Work completed:

- Implemented automatic keyword extraction from model answers using YAKE.
- Compared YAKE and RAKE during development.
- Selected YAKE based on the quality and relevance of extracted keyphrases from the project model answers.
- Added filtering to remove noisy and irrelevant extracted phrases.
- Integrated automatically extracted keywords with the keyword matching component.
- Implemented text normalization.
- Implemented matched keyword identification.
- Implemented missing keyword identification.
- Implemented keyword match percentage calculation.
- Implemented a complete keyword evaluation result.
- Removed the dependency on manually written keywords from the model answer dataset.
- Added automated tests using `pytest`.
- Verified YAKE extraction and dataset loading successfully.

#### Milestone 2 - Semantic Similarity

Work completed:

- Added the `sentence-transformers` dependency for semantic similarity processing.
- Integrated semantic similarity with the answer evaluation module.
- Model answers are cached and used for comparison with student answers.

### Current Status

**September Answer Evaluation - Completed**

The answer evaluation module now uses automatically extracted YAKE keyphrases for keyword-based evaluation and semantic similarity for semantic evaluation.

The two evaluation signals can be used together for further scoring and evaluation criteria development.
---

## 3. Testing

Automated testing is performed using `pytest`.

The current keyword matching test suite includes:

- `test_normalize_text`
- `test_find_matched_keywords`
- `test_calculate_keyword_score`
- `test_find_missing_keywords`
- `test_evaluate`

Current test status:

**5 tests passed**

Test command:

```bash
python -m pytest evaluation_ai/app/evaluation_module/test_keyword_matching.py
