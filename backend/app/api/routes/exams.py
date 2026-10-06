
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.exam import ExamStatus
from app.core.database import get_db
from app.middleware.auth import require_role
from app.models.user import User, UserRole
from app.schemas.exam import (
    ExamCreateRequest,
    ExamUpdateRequest,
    ExamResponse
)

from app.services.exam_service import (
    create_exam,
    get_all_exams,
    get_exam_by_id,
    update_exam,
    delete_exam
)

router = APIRouter(
    prefix="/api/exams",
    tags=["Exams"]
)


@router.post(
    "/",
    response_model=ExamResponse,
    status_code=status.HTTP_201_CREATED
)

@router.get(
    "/",
    response_model=list[ExamResponse]
)
@router.get(
    "/{exam_id}",
    response_model=ExamResponse
)

@router.put(
    "/{exam_id}",
    response_model=ExamResponse
)
def update_existing_exam(
    exam_id: int,
    exam_data: ExamUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    exam = get_exam_by_id(
        db,
        exam_id
    )

    if exam is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )

    if exam_data.total_marks is not None:
        if exam_data.total_marks <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Total marks must be greater than zero"
            )

    if exam_data.duration_minutes is not None:
        if exam_data.duration_minutes <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duration must be greater than zero"
            )

    return update_exam(
        db,
        exam,
        exam_data
    ) 


def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    exam = get_exam_by_id(
        db,
        exam_id
    )

    if exam is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )

    return exam
def get_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    return get_all_exams(db)
def create_new_exam(
    exam_data: ExamCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    if exam_data.total_marks <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Total marks must be greater than zero"
        )

    if (
        exam_data.duration_minutes is not None
        and exam_data.duration_minutes <= 0
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duration must be greater than zero"
        )

    exam = create_exam(
        db=db,
        title=exam_data.title,
        subject=exam_data.subject,
        description=exam_data.description,
        exam_date=exam_data.exam_date,
        duration_minutes=exam_data.duration_minutes,
        total_marks=exam_data.total_marks,
        created_by=current_user.id
    )

    return exam


@router.delete(
    "/{exam_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_existing_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    exam = get_exam_by_id(
        db,
        exam_id
    )

    if exam is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )

    if exam.status != ExamStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft exams can be deleted"
        )

    delete_exam(
        db,
        exam
    )

    return None