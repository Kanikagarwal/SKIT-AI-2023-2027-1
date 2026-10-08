from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func

from app.core.database import Base


class AnswerSheet(Base):
    __tablename__ = "answer_sheets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    exam_id = Column(
        Integer,
        ForeignKey("exams.id"),
        nullable=True
    )

    file_name = Column(
        String(255),
        nullable=True
    )

    ocr_status = Column(
        String(50),
        nullable=False,
        default="PENDING"
    )

    ocr_result = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )