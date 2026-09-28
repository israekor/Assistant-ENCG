from pathlib import Path
import re


class MetadataService:

    CATEGORY_NAMES = {
        "01_presentation": "Présentation",
        "02_formation": "Formation",
        "03_filieres": "Filières",
        "04_masters": "Masters",
        "05_formation_continue": "Formation continue",
        "06_recherche": "Recherche",
        "07_entreprise": "Entreprise",
        "08_services": "Services",
        "09_reglement": "Règlement",
        "10_partenariats_academiques": "Partenariats académiques",
        "11_admission": "Admission",
    }

    FILIERE_NAMES = {
        "01_achats_supply_chain_management": "Achats et Supply Chain Management",
        "02_controle_audit_conseil": "Contrôle, Audit et Conseil",
        "03_finance": "Finance",
        "04_management_ressources_humaines": "Management des Ressources Humaines",
        "05_marketing_action_commerciale": "Marketing et Action Commerciale",
        "06_commerce_international": "Commerce International",
    }

    @classmethod
    def extract(
        cls,
        source: str,
        content: str
    ) -> dict:

        path = Path(source)

        category_folder = path.parent.name
        filename = path.stem

        category = cls.CATEGORY_NAMES.get(
            category_folder
        )

        filiere = cls.FILIERE_NAMES.get(
            filename
        )

        source_url = cls.extract_source_url(
            content
        )

        return {
            "category": category,
            "filiere": filiere,
            "source_url": source_url
        }

    @staticmethod
    def extract_source_url(
        content: str
    ) -> str | None:

        for line in content.splitlines():

            line = line.strip()

            if re.match(r"^https?://", line):
                return line

        return None
