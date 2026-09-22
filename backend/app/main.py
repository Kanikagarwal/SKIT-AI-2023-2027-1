from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.core.database import Base, engine
from app.api.routes.users import router as users_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="EvalAI API",
    description="AI-powered theory exam evaluation system",
    version="1.0.0"
)


app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {
        "message": "EvalAI Backend is running"
    }