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

- Created the evaluation dataset containing questions, model answers, student answers, keywords and maximum marks.
- Implemented dataset loading.
- Implemented question retrieval.
- Implemented model answer retrieval.
- Implemented keyword retrieval.
- Implemented student answer retrieval.

### September - Answer Evaluation

#### Milestone 1 - Keyword Matching

Work completed:

- Implemented text normalization.
- Implemented basic keyword matching.
- Implemented matched keyword identification.
- Implemented missing keyword identification.
- Implemented keyword match percentage calculation.
- Implemented a complete keyword evaluation result.
- Added automated tests using `pytest`.
- Verified the keyword matching functionality using the existing evaluation dataset.
- All current keyword matching tests pass successfully.

#### Milestone 2 - Semantic Similarity

Current work:

- Added the `sentence-transformers` dependency for semantic similarity processing.
- Added a module-specific `requirements.txt` file.
- Semantic similarity implementation is currently in progress.

### Current Status

**In Progress**

The keyword matching component has been implemented and tested.

The semantic similarity component is currently under development. After semantic similarity is implemented, the keyword-based and semantic evaluation methods will be combined as part of the remaining September Answer Evaluation work.

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
