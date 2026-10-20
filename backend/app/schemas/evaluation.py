
from pydantic import BaseModel, Field


class QuestionEvaluationRequest(BaseModel):
    question_no: int = Field(gt=0)
    ai_marks: float = Field(ge=0)
    max_marks: float = Field(gt=0)
    feedback: str | None = None
    matched_concepts: list[str] = []
    missing_concepts: list[str] = []


class EvaluationResultRequest(BaseModel):
    answer_sheet_id: int = Field(gt=0)
    evaluations: list[QuestionEvaluationRequest] = Field(min_length=1)
# schema to the API endpoint that stores evaluation results in your database.