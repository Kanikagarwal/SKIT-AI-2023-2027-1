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

### September - Answer Evaluation

Current work completed:

- Integrated the existing evaluation dataset with the Python evaluation module.
- Implemented dataset loading.
- Implemented question retrieval.
- Implemented model answer retrieval.
- Implemented keyword retrieval.
- Implemented student answer retrieval.
- Implemented basic keyword matching.
- Implemented matched and missing keyword identification.
- Implemented keyword match percentage calculation.
- Tested keyword matching using the existing dataset.

### Current Status

**In Progress**

The keyword matching component is currently implemented and tested.

Semantic similarity and combined answer evaluation are planned for the remainder of the September development period.

---

## 3. Folder Structure

```text
evaluation_ai/
│
├── app/
│   └── evaluation_module/
│       ├── __init__.py
│       ├── dataset.py
│       └── keyword_matching.py
│
└── README.md