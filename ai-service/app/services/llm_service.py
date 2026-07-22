import traceback

from ollama import Client
from app.config import OLLAMA_HOST, OLLAMA_MODEL
from app.exceptions.llm_exception import LLMException


class LLMService:

    def __init__(self):
        self.client = Client(host=OLLAMA_HOST)

    def generate_response(self, message: str) -> str:

        try:
            response = self.client.chat(
                model=OLLAMA_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            )

            return response["message"]["content"]

        except Exception as e:
            traceback.print_exc()
            print(e)
            raise
