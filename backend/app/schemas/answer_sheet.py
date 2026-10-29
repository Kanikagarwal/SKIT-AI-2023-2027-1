
from pydantic import BaseModel, Field


class OCRAnswer(BaseModel):
    question_no: int = Field(gt=0)
    answer: str


class OCRResultRequest(BaseModel):
    student_id: int = Field(gt=0)
    exam_id: int = Field(gt=0)
    answers: list[OCRAnswer]
