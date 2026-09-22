from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role
):
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        return None

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user