from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole


def create_admin():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_admin = (
            db.query(User)
            .filter(User.role == UserRole.ADMIN)
            .first()
        )

        if existing_admin:
            print("Admin already exists.")
            return

        admin = User(
            name="Admin",
            email="admin@evalai.com",
            password_hash=hash_password("Admin@123"),
            role=UserRole.ADMIN
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()