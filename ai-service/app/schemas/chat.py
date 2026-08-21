from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    context: str | None = None


class ChatResponse(BaseModel):
    response: str
