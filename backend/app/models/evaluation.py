
from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    answer_sheet_id = Column(
        Integer,
        ForeignKey("answer_sheets.id"),
        nullable=False
    )

    question_no = Column(
        Integer,
        nullable=False
    )

    ai_marks = Column(
        Float,
        nullable=False
    )

    max_marks = Column(
        Float,
        nullable=False
    )

    feedback = Column(
        Text,
        nullable=True
    )

    matched_concepts = Column(
        Text,
        nullable=True
    )

    missing_concepts = Column(
        Text,
        nullable=True
    )

    status = Column(
        String(50),
        nullable=False,
        default="AI_EVALUATED"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
