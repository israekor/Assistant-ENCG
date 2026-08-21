import traceback

from ollama import Client
from app.config import OLLAMA_HOST, OLLAMA_MODEL
from app.exceptions.llm_exception import LLMException


class LLMService:

    def __init__(self):
        self.client = Client(host=OLLAMA_HOST)

    def generate_response(self, message: str, context: str | None = None) -> str:

        try:
            system_prompt = (
                "Tu es l'assistant IA officiel de l'ENCG Tanger.\n"
                "Réponds uniquement en français.\n"
            )

            if context:
                system_prompt += (
                    "\nContexte fourni :\n"
                    f"{context}\n"
                    "Utilise ce contexte pour répondre lorsqu'il est pertinent."
                )
            messages = [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": message
                }
            ]

            response = self.client.chat(
                model=OLLAMA_MODEL,
                messages=messages
            )

            return response["message"]["content"]

        except Exception as e:
            traceback.print_exc()
            raise LLMException(
                "Erreur lors de la génération de la réponse."
            ) from e

# system_prompt = (
#                 "Tu es l'assistant IA officiel de l'ENCG Tanger.\n"
#                 "Tu aides les étudiants, enseignants et visiteurs.\n"
#                 "Réponds toujours en français.\n"
#                 "Si un contexte est fourni, utilise-le en priorité.\n"
#                 "Si tu ne connais pas la réponse, indique-le clairement et n'invente pas d'informations."
#             )
