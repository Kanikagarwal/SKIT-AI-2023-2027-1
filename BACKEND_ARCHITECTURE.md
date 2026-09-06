EvalAI/
│
├── frontend/                 # React + Vite
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── exams.py
│   │   │       ├── questions.py
│   │   │       ├── documents.py
│   │   │       ├── answer_sheets.py
│   │   │       ├── evaluations.py
│   │   │       ├── results.py
│   │   │       └── analytics.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── exam.py
│   │   │   ├── question.py
│   │   │   ├── answer_sheet.py
│   │   │   └── evaluation.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── exam.py
│   │   │   └── evaluation.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── exam_service.py
│   │   │   ├── document_service.py
│   │   │   ├── ocr_service.py
│   │   │   ├── ai_service.py
│   │   │   ├── evaluation_service.py
│   │   │   └── result_service.py
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.py
│   │   │
│   │   └── utils/
│   │       └── file_handler.py
│   │
│   ├── alembic/
│   ├── uploads/
│   ├── requirements.txt
│   ├── .env
│   └── README.md
│
├── ai-service/               # AI/OCR processing
│   ├── app/
│   │   ├── main.py
│   │   ├── ocr/
│   │   ├── evaluation/
│   │   └── utils/
│   └── requirements.txt
│
├── BACKEND_ARCHITECTURE.md
├── README.md
└── .gitignore