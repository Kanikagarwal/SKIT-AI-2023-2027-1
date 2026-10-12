
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from app.core.database import get_db
from app.middleware.auth import require_role
from app.models.user import User, UserRole
from app.models.answer_sheet import AnswerSheet
from app.schemas.answer_sheet import OCRResultRequest


router = APIRouter(
    prefix="/api/answer-sheets",
    tags=["Answer Sheets"]
)


@router.post(
    "/ocr-result",
    status_code=status.HTTP_201_CREATED
)
def receive_ocr_result(
    data: OCRResultRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    # Check whether the student exists
    student = (
        db.query(User)
        .filter(
            User.id == data.student_id,
            User.role == UserRole.STUDENT
        )
        .first()
    )

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Check whether the exam exists
    from app.models.exam import Exam

    exam = (
        db.query(Exam)
        .filter(Exam.id == data.exam_id)
        .first()
    )

    if exam is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )

    # Save OCR data in the database
    answer_sheet = AnswerSheet(
        student_id=data.student_id,
        exam_id=data.exam_id,
        ocr_status="COMPLETED",
        ocr_result=json.dumps(
            data.model_dump()
        )
    )

    db.add(answer_sheet)
    db.commit()
    db.refresh(answer_sheet)

    return {
        "message": "OCR result received successfully",
        "answer_sheet_id": answer_sheet.id,
        "student_id": answer_sheet.student_id,
        "exam_id": answer_sheet.exam_id,
        "ocr_status": answer_sheet.ocr_status
    }
