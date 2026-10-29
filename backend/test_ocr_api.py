
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "http://127.0.0.1:8000/api/answer-sheets/ocr-result"
API_KEY = os.getenv("OCR_API_KEY")

payload = {
    "student_id": 2,
    "exam_id": 1,
    "answers": [
        {
            "question_no": 1,
            "answer": "Normalization organizes data to reduce redundancy."
        },
        {
            "question_no": 2,
            "answer": "A primary key uniquely identifies each record."
        }
    ]
}

response = requests.post(
    API_URL,
    json=payload,
    headers={"X-OCR-API-Key": API_KEY}
)

print("Status code:", response.status_code)
print("Response:", response.text)
