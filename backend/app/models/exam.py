import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Enum,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.core.database import Base


class ExamStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    READY = "READY"
    EVALUATION = "EVALUATION"
    COMPLETED = "COMPLETED"


class Exam(Base):
    __tablename__ = "exams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    subject = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    exam_date = Column(
        DateTime(timezone=True),
        nullable=True
    )

    duration_minutes = Column(
        Integer,
        nullable=True
    )

    total_marks = Column(
        Integer,
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    assigned_teacher = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    status = Column(
        Enum(ExamStatus),
        nullable=False,
        default=ExamStatus.DRAFT
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )