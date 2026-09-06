from fastapi import FastAPI

app = FastAPI(title="EvalAI AI Service")


@app.get("/")
def root():
    return {"message": "EvalAI AI Service is running"}