from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.auth import (
    LoginRequest,
    LoginResponse
)
from app.schemas.user import UserResponse
from app.services.auth_service import login_user

from app.middleware.auth import (
    get_current_user,
    require_role
)

from app.models.user import UserRole

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.get("/admin-only")
def admin_only(
    current_user=Depends(
        require_role(UserRole.ADMIN)
    )
):
    return {
        "message": "Welcome Admin!",
        "user": current_user.email,
        "role": current_user.role
    }


@router.get("/teacher-only")
def teacher_only(
    current_user=Depends(
        require_role(UserRole.TEACHER)
    )
):
    return {
        "message": "Welcome Teacher!",
        "user": current_user.email,
        "role": current_user.role
    }


@router.get("/student-only")
def student_only(
    current_user=Depends(
        require_role(UserRole.STUDENT)
    )
):
    return {
        "message": "Welcome Student!",
        "user": current_user.email,
        "role": current_user.role
    }

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    result = login_user(
        db,
        credentials.email,
        credentials.password
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user, token = result

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user