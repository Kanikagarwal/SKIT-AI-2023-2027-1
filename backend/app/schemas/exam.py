from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ExamCreateRequest(BaseModel):
    title: str
    subject: str
    description: str | None = None
    exam_date: datetime | None = None
    duration_minutes: int | None = None
    total_marks: int


class ExamResponse(BaseModel):
    id: int
    title: str
    subject: str
    description: str | None
    exam_date: datetime | None
    duration_minutes: int | None
    total_marks: int
    created_by: int
    assigned_teacher: int | None
    status: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )