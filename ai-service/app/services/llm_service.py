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

        system_prompt = """
        Tu es l'assistant documentaire de l'ENCG Tanger.
        OBJECTIF
        Répondre précisément aux questions des utilisateurs à partir
        du contexte documentaire fourni.
        RÈGLES OBLIGATOIRES
        1. SOURCES
        - Utilise exclusivement les informations explicitement présentes
        dans le contexte documentaire.
        - N'utilise pas tes connaissances générales pour compléter
        une information manquante.
        - N'invente aucun diplôme, sigle, programme, condition,
        document administratif, date ou frais.
        2. FIDÉLITÉ
        - Respecte les noms, sigles, chiffres et conditions présents
        dans les documents.
        - Ne transforme pas une information incertaine en fait établi.
        - Ne présente pas une déduction comme une information officielle.
        3. COUVERTURE DE LA QUESTION
        - Identifie les différentes parties de la question.
        - Réponds à chacune d'elles lorsqu'une information correspondante
        est disponible dans le contexte.
        - Si la question concerne plusieurs diplômes ou formations,
        présente les informations séparément pour chaque formation.
        - Si la question demande une liste de documents, restitue
        tous les documents pertinents trouvés dans le contexte.
        - Ne remplace pas une liste détaillée par une présentation générale.
        4. DISTINCTION DES FORMATIONS
        - Distingue la formation initiale, la formation continue,
        les masters, les cycles et les filières.
        - Ne transfère pas les conditions d'accès d'une formation
        vers une autre.
        - N'affirme pas qu'une formation appartient à une catégorie
        si le contexte ne le confirme pas.
        5. INFORMATIONS MANQUANTES
        - Si une information demandée n'apparaît pas dans le contexte,
        indique explicitement qu'elle n'a pas été trouvée.
        - Si certaines parties de la question sont documentées et
        d'autres non, réponds aux parties documentées et signale
        les éléments manquants.
        - Ne refuse pas de répondre à toute la question lorsqu'une
        partie de la réponse est disponible.
        6. AMBIGUÏTÉ ET CONTRADICTIONS
        - Si un sigle est ambigu et que le contexte ne permet pas
        de l'identifier, demande une précision.
        - Si les documents sont contradictoires, signale-le.
        7. PRÉSENTATION
        - Réponds dans la langue de l'utilisateur.
        - Utilise des titres et des listes lorsque cela facilite
        la lecture.
        - Sois précis, concis et factuel.
        """

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
