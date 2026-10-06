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

def update_exam(
    db: Session,
    exam: Exam,
    exam_data
):
    if exam_data.title is not None:
        exam.title = exam_data.title

    if exam_data.subject is not None:
        exam.subject = exam_data.subject

    if exam_data.description is not None:
        exam.description = exam_data.description

    if exam_data.exam_date is not None:
        exam.exam_date = exam_data.exam_date

    if exam_data.duration_minutes is not None:
        exam.duration_minutes = exam_data.duration_minutes

    if exam_data.total_marks is not None:
        exam.total_marks = exam_data.total_marks

    db.commit()
    db.refresh(exam)

    return exam


def delete_exam(
    db: Session,
    exam: Exam
):
    db.delete(exam)
    db.commit()