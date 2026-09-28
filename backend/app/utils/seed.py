from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole


def create_users():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    users = [
        {
            "name": "Admin",
            "email": "admin@evalai.com",
            "password": "Admin@123",
            "role": UserRole.ADMIN
        },
        {
            "name": "Test Teacher",
            "email": "teacher@evalai.com",
            "password": "Teacher@123",
            "role": UserRole.TEACHER
        },
        {
            "name": "Test Student",
            "email": "student@evalai.com",
            "password": "Student@123",
            "role": UserRole.STUDENT
        }
    ]

    try:
        for user_data in users:
            existing_user = (
                db.query(User)
                .filter(User.email == user_data["email"])
                .first()
            )

            if existing_user:
                print(f'{user_data["email"]} already exists.')
                continue

            user = User(
                name=user_data["name"],
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                role=user_data["role"]
            )

            db.add(user)
            print(f'{user_data["email"]} created successfully.')

        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    create_users()