from app.services.metadata_detector import MetadataDetector

queries = [
    "Quelles sont les filières du parcours Gestion ?",
    "Quelles sont les filières du parcours Commerce ?",
    "Quels sont les parcours proposés dans le cycle ENCG ?",
    "Quel est le programme du semestre 3 ?",
]

for query in queries:

    parcours = MetadataDetector.detect_parcours(query)

    section = MetadataDetector.detect_section(query)

    subsection = MetadataDetector.detect_subsection(
        query,
        parcours
    )

    filiere = MetadataDetector.detect_filiere(query)

    intent = MetadataDetector.detect_intent(query)

    print("\nQUESTION:", query)
    print("filiere   =", filiere)
    print("parcours  =", parcours)
    print("section   =", section)
    print("subsection=", subsection)
    print("intent    =", intent)
