from collections.abc import Generator
import traceback

from ollama import Client

from app.config import OLLAMA_HOST, OLLAMA_MODEL
from app.exceptions.llm_exception import LLMException


class LLMService:

    def __init__(self):
        self.client = Client(host=OLLAMA_HOST)

    def _build_messages(
        self,
        message: str,
        context: str | None = None
    ) -> list[dict]:

        system_prompt = (
            "Tu es l'assistant IA officiel de l'ENCG Tanger.\n"
            "Réponds uniquement en français.\n"
            "Réponds de manière concise, claire et factuelle.\n"
            "Utilise uniquement les informations présentes "
            "dans le contexte fourni.\n"
            "N'invente aucune information.\n"
            "Ne déduis pas une information qui n'est pas explicitement "
            "présente dans le contexte.\n"
            "Si la réponse n'est pas disponible dans le contexte, "
            "indique clairement que l'information n'est pas disponible "
            "dans les documents fournis.\n"
        )

        if context:
            system_prompt += (
                "\n\nCONTEXTE DOCUMENTAIRE :\n"
                "-------------------------\n"
                f"{context}\n"
                "-------------------------\n"
            )

        return [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": message
            }
        ]

    def generate_response(
        self,
        message: str,
        context: str | None = None
    ) -> str:

        try:
            messages = self._build_messages(message, context)

            response = self.client.chat(
                model=OLLAMA_MODEL,
                messages=messages,
            )

            return response["message"]["content"]

        except Exception as e:
            traceback.print_exc()

            raise LLMException(
                "Erreur lors de la génération de la réponse."
            ) from e

    def stream_response(self, message, context=None):
        try:
            messages = self._build_messages(message, context)
            stream = self.client.chat(
                model=OLLAMA_MODEL, messages=messages, stream=True)

            for chunk in stream:
                content = chunk["message"]["content"]
                if content:
                    yield content

        except Exception as e:
            traceback.print_exc()
            yield "[ERROR] Erreur lors de la génération de la réponse."
