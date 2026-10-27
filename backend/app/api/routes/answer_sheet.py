
import json
import os
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import require_role
from app.models.user import User, UserRole
from app.models.exam import Exam
from app.models.answer_sheet import AnswerSheet
from app.models.evaluation import Evaluation
from app.schemas.answer_sheet import OCRResultRequest
from app.schemas.evaluation import EvaluationResultRequest


router = APIRouter(
    prefix="/api/answer-sheets",
    tags=["Answer Sheets"]
)


# Verify API key sent by the OCR module
def verify_ocr_api_key(
    ocr_api_key: str | None = Header(
        default=None,
        alias="X-OCR-API-Key"
    )
):
    expected_key = os.getenv("OCR_API_KEY")

    if not expected_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OCR API key is not configured"
        )

    if not ocr_api_key or not secrets.compare_digest(
        ocr_api_key, expected_key
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OCR API key"
        )

    return True


# Receive and store OCR results
@router.post(
    "/ocr-result",
    status_code=status.HTTP_201_CREATED
)
def receive_ocr_result(
    data: OCRResultRequest,
    db: Session = Depends(get_db),
    api_key_verified: bool = Depends(verify_ocr_api_key)
):
    # Check that the student exists
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

    # Check that the exam exists
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

    # Save OCR result
    answer_sheet = AnswerSheet(
        student_id=data.student_id,
        exam_id=data.exam_id,
        ocr_status="COMPLETED",
        ocr_result=json.dumps(data.model_dump())
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


# Provide OCR data to the evaluation module
@router.get("/{answer_sheet_id}/evaluation-input")
def get_evaluation_input(
    answer_sheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN, UserRole.TEACHER)
    )
):
    answer_sheet = (
        db.query(AnswerSheet)
        .filter(AnswerSheet.id == answer_sheet_id)
        .first()
    )

    if answer_sheet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Answer sheet not found"
        )

    # Ensure OCR processing is complete
    if answer_sheet.ocr_status != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="OCR processing is not completed yet"
        )

    # Ensure OCR data exists
    if not answer_sheet.ocr_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OCR result not available"
        )

    return {
        "answer_sheet_id": answer_sheet.id,
        "student_id": answer_sheet.student_id,
        "exam_id": answer_sheet.exam_id,
        "ocr_status": answer_sheet.ocr_status,
        "evaluation_input": json.loads(answer_sheet.ocr_result)
    }


# Receive and store AI evaluation results
@router.post("/{answer_sheet_id}/evaluation-result")
def save_evaluation_result(
    answer_sheet_id: int,
    data: EvaluationResultRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN, UserRole.TEACHER)
    )
):
    # Check whether the answer sheet exists
    answer_sheet = (
        db.query(AnswerSheet)
        .filter(AnswerSheet.id == answer_sheet_id)
        .first()
    )

    if answer_sheet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Answer sheet not found"
        )

    # Ensure the URL ID and request ID match
    if data.answer_sheet_id != answer_sheet_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Answer sheet ID mismatch"
        )

    # Ensure OCR processing is complete before evaluation
    if answer_sheet.ocr_status != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="OCR processing is not completed yet"
        )

    # Validate marks before saving anything
    for item in data.evaluations:
        if item.ai_marks > item.max_marks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "AI marks exceed maximum marks for "
                    f"question {item.question_no}"
                )
            )

    saved_evaluations = []

    try:
        # Save each question's evaluation
        for item in data.evaluations:
            evaluation = Evaluation(
                answer_sheet_id=answer_sheet_id,
                question_no=item.question_no,
                ai_marks=item.ai_marks,
                max_marks=item.max_marks,
                feedback=item.feedback,
                matched_concepts=json.dumps(item.matched_concepts),
                missing_concepts=json.dumps(item.missing_concepts),
                status="AI_EVALUATED"
            )

            db.add(evaluation)
            saved_evaluations.append(evaluation)

        answer_sheet.evaluation_status = "COMPLETED"

        db.commit()

        for evaluation in saved_evaluations:
            db.refresh(evaluation)

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Evaluation results saved successfully",
        "answer_sheet_id": answer_sheet_id,
        "evaluations_saved": len(saved_evaluations),
        "status": "AI_EVALUATED",
        "evaluations": [
            {
                "evaluation_id": item.id,
                "question_no": item.question_no,
                "ai_marks": item.ai_marks,
                "max_marks": item.max_marks,
                "status": item.status
            }
            for item in saved_evaluations
        ]
    }
