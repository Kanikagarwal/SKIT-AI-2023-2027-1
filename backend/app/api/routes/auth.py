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


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


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