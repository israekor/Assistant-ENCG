import re


def extract_semester(question: str) -> str | None:

    match = re.search(
        r"\b(?:semestre|s)\s*([1-6])\b",
        question.lower()
    )

    if match:
        numero = match.group(1)
        return f"Semestre {numero}"

    return None


class MetadataDetector:

    CATEGORY_RULES = {
        "Formation continue": [
            "formation continue",
            "formations continues"
        ],

        "Formation": [
            "formation initiale",
            "cycle encg",
            "formation initiale encg"
        ],

        "Masters": [
            "masters",
            "master proposé",
            "master spécialisé"
        ],

        "Filières": [
            "filière",
            "filières",
            "parcours"
        ]
    }

    FILIERE_ALIASES = {
        "finance": "Finance",
        "audit et conseil": "Contrôle, Audit et Conseil",
        "contrôle audit et conseil": "Contrôle, Audit et Conseil",
        "cac": "Contrôle, Audit et Conseil",
        "marketing": "Marketing et Action Commerciale",
        "action commerciale": "Marketing et Action Commerciale",
        "management des ressources humaines": "Management des Ressources Humaines",
        "ressources humaines": "Management des Ressources Humaines",
        "commerce international": "Commerce International",
        "achats": "Achats et Supply Chain Management",
        "supply chain": "Achats et Supply Chain Management",
    }

    SECTION_KEYWORDS = {
        "débouchés": "Débouchés",
        "débouché": "Débouchés",
        "métiers": "Débouchés",
        "emploi": "Débouchés",
        "emplois": "Débouchés",

        "matières": "PROGRAMME",
        "matière": "PROGRAMME",
        "cours": "PROGRAMME",
        "programme": "PROGRAMME",

        "objectifs": "Objectifs",
        "objectif": "Objectifs",

        "présentation": "Présentation",
        "présente": "Présentation",

        "filière": "Filières du cycle ENCG",
        "filières": "Filières du cycle ENCG",
        "parcours": "Filières du cycle ENCG",
        "spécialité": "Filières du cycle ENCG",
        "spécialités": "Filières du cycle ENCG",
    }

    @classmethod
    def detect_filiere(cls, query: str) -> str | None:
        query_normalized = query.lower()

        for alias, filiere in cls.FILIERE_ALIASES.items():
            if alias in query_normalized:
                return filiere

        return None

    @classmethod
    def detect_section(cls, query: str) -> str | None:
        query_normalized = query.lower()

        for keyword, section in cls.SECTION_KEYWORDS.items():
            pattern = rf"\b{re.escape(keyword)}\b"

            if re.search(pattern, query_normalized):
                return section

        return None

    @classmethod
    def detect_subsection(
        cls,
        query: str,
        parcours: str | None = None
    ) -> str | None:
        if parcours:
            return parcours

        return extract_semester(query)

    @staticmethod
    def detect_intent(query: str) -> str | None:
        query = query.lower().strip()

        if re.search(r"\bdiplômes?\b", query):
            return "DIPLOMAS"

        if re.search(r"\bquelles?\s+sont\b", query):
            return "LIST"

        if re.search(r"\bquels?\s+sont\b", query):
            return "LIST"

        if re.search(r"\bliste\b", query):
            return "LIST"

        if re.search(r"\bcombien\s+de\b", query):
            return "DURATION"

        if re.search(r"\bdurée\b|\bdurent?\b", query):
            return "DURATION"

        if re.search(r"\bobjectif[s]?\b", query):
            return "OBJECTIVES"

        if re.search(r"\bprogramme\b|\bmatières?\b|\bcours\b|\bmodules?\b", query):
            return "PROGRAM"

        return None

    @staticmethod
    def detect_parcours(query: str) -> str | None:
        """
        Détecte le parcours ENCG explicitement mentionné
        dans la question.
        """

        q = query.lower()

        # Parcours Gestion
        if re.search(
            r"\bparcours\s+(?:de\s+)?gestion\b",
            q
        ):
            return "Parcours Gestion"

        # Parcours Commerce
        if re.search(
            r"\bparcours\s+(?:de\s+)?commerce\b",
            q
        ):
            return "Parcours Commerce"

        return None

    @staticmethod
    def detect_category(query: str) -> str | None:
        query_lower = query.lower()

        if "formation continue" in query_lower:
            return "Formation continue"

        if (
            "formation initiale" in query_lower
            or "cycle encg" in query_lower
        ):
            return "Formation"

        if (
            "master" in query_lower
            or "masters" in query_lower
        ):
            return "Masters"

        return None
