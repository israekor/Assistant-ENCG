from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import LLMService
from app.exceptions.llm_exception import LLMException

router = APIRouter()

llm_service = LLMService()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        response = llm_service.generate_response(
            request.message, request.context)

        return ChatResponse(
            response=response
        )

    except LLMException as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/chat/stream")
def chat_stream(request: ChatRequest):

    try:

        return StreamingResponse(
            llm_service.stream_response(
                request.message,
                request.context
            ),
            media_type="text/plain"
        )

    except LLMException as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
