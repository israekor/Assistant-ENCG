from fastapi import FastAPI

from app.routes.chat import router

app = FastAPI(
    title="Chatbot API",
    version="1.0.0",
    root_path="/ai"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Chatbot API is running"
    }
