from sqlalchemy.orm import Session

from app.models.exam import Exam, ExamStatus


def create_exam(
    db: Session,
    title: str,
    subject: str,
    description: str | None,
    exam_date,
    duration_minutes: int | None,
    total_marks: int,
    created_by: int
):
    
    exam = Exam(
        title=title,
        subject=subject,
        description=description,
        exam_date=exam_date,
        duration_minutes=duration_minutes,
        total_marks=total_marks,
        created_by=created_by,
        status=ExamStatus.DRAFT
    )

    db.add(exam)
    db.commit()
    db.refresh(exam)

    return exam

def get_all_exams(db: Session):
    return (
        db.query(Exam)
        .order_by(Exam.created_at.desc())
        .all()
    )

def get_exam_by_id(
    db: Session,
    exam_id: int
):
    return (
        db.query(Exam)
        .filter(Exam.id == exam_id)
        .first()
    )