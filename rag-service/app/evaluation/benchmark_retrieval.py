import csv
import json
import statistics
import time
import urllib.error
import urllib.request
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

API_URL = "http://rag-service:8000/rag/retrieve"

CANDIDATE_K = 20
FINAL_K = 5

DATASET_FILE = "benchmark_dataset.json"

RESULTS_JSON = "benchmark_results.json"
RESULTS_CSV = "benchmark_results.csv"


# ============================================================
# BENCHMARK DATASET
# ============================================================

DATASET = [
    {
        "id": "b01",
        "category": "filiere",
        "question": "Quels sont les débouchés de la filière Contrôle, Audit et Conseil ?",
        "relevant": [
            {
                "source": "03_filieres/02_controle_audit_conseil.md",
                "section": "Débouchés",
            }
        ],
    },
    {
        "id": "b02",
        "category": "filiere",
        "question": "Quels sont les objectifs de la filière Finance ?",
        "relevant": [
            {
                "source": "03_filieres/03_finance.md",
                "section": "Objectifs",
            }
        ],
    },
    {
        "id": "b03",
        "category": "programme",
        "question": "Quelles sont les matières de Finance au semestre 5 ?",
        "relevant": [
            {
                "source": "03_filieres/03_finance.md",
                "section": "PROGRAMME",
                "subsection": "Semestre 5",
            }
        ],
    },
    {
        "id": "b04",
        "category": "programme",
        "question": "Quelles sont les matières de la filière Finance ?",
        "relevant": [
            {
                "source": "03_filieres/03_finance.md",
                "section": "PROGRAMME",
            }
        ],
    },
    {
        "id": "b05",
        "category": "filiere",
        "question": "Quels sont les débouchés de la filière Marketing ?",
        "relevant": [
            {
                "source": "03_filieres/05_marketing_action_commerciale.md",
                "section": "Débouchés",
            }
        ],
    },
    {
        "id": "b06",
        "category": "filiere",
        "question": "Quels sont les objectifs de la filière Commerce International ?",
        "relevant": [
            {
                "source": "03_filieres/06_commerce_international.md",
                "section": "Objectifs",
            }
        ],
    },
    {
        "id": "b07",
        "category": "filiere",
        "question": "Quels sont les objectifs de la filière Achats et Supply Chain Management ?",
        "relevant": [
            {
                "source": "03_filieres/01_achats_supply_chain_management.md",
                "section": "Objectifs",
            }
        ],
    },

    # Questions importantes pour tester le problème actuel
    {
        "id": "b08",
        "category": "filiere",
        "question": "Quelles sont les filières de l'ENCG Tanger ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Filières du cycle ENCG",
            }
        ],
    },
    {
        "id": "b09",
        "category": "filiere",
        "question": "Quels sont les parcours proposés par l'ENCG ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Filières du cycle ENCG",
                "subsection": "Parcours Gestion",
            },
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Filières du cycle ENCG",
                "subsection": "Parcours Commerce",
            },
        ],
    },
    {
        "id": "b10",
        "category": "filiere",
        "question": "Quelles sont les filières du parcours Gestion ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Filières du cycle ENCG",
                "subsection": "Parcours Gestion",
            }
        ],
    },
    {
        "id": "b11",
        "category": "filiere",
        "question": "Quelles sont les filières du parcours Commerce ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Filières du cycle ENCG",
                "subsection": "Parcours Commerce",
            }
        ],
    },

    {
        "id": "b12",
        "category": "architecture",
        "question": "Combien de semestres comprend le cycle des ENCG ?",
        "relevant": [
            {
                "source": "09_reglement/01_presentation_architecture_cursus.md",
                "section": "Architecture du cursus (Article 3)",
            }
        ],
    },
    {
        "id": "b13",
        "category": "formation",
        "question": "Combien de semestres durent les deux années préparatoires aux ENCG ?",
        "relevant": [
            {
                "source": "09_reglement/01_presentation_architecture_cursus.md",
                "section": "Architecture du cursus (Article 3)",
            }
        ],
    },
    {
        "id": "b14",
        "category": "formation",
        "question": "Quelle est la durée du stage d'initiation du cycle ENCG ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Diplôme de l'ENCG (DENCG)",
                "subsection": "Stage d'initiation",
            },
            {
                "source": "09_reglement/06_stages_pfe.md",
                "section": "Stages et Projet de Fin d'Études (Article 11)",
                "subsection": "Stage d'initiation",
            },
        ],
    },
    {
        "id": "b15",
        "category": "formation",
        "question": "À quel semestre le PFE est-il réalisé et quelle est sa durée ?",
        "relevant": [
            {
                "source": "09_reglement/06_stages_pfe.md",
                "section": "Stages et Projet de Fin d'Études (Article 11)",
                "subsection": "Projet de Fin d'Études (PFE)",
            }
        ],
    },
    {
        "id": "b16",
        "category": "reglement",
        "question": "Quelles sont les conditions de validation du Cycle ENCG ?",
        "relevant": [
            {
                "source": "09_reglement/07_validation_cycles_diplomation.md",
                "section": "Validation des Cycles et Diplomation (Article 12)",
                "subsection": "Validation du Cycle ENCG (CENCG)",
            }
        ],
    },
    {
        "id": "b17",
        "category": "reglement",
        "question": "À partir de quelle note un étudiant peut-il accéder à la session de rattrapage ?",
        "relevant": [
            {
                "source": "09_reglement/04_session_rattrapage.md",
                "section": "Session de Rattrapage (Article 9)",
                "subsection": "Conditions d'accès",
            }
        ],
    },
    {
        "id": "b18",
        "category": "reglement",
        "question": "Comment est calculée la note finale d'un module en session normale ?",
        "relevant": [
            {
                "source": "09_reglement/03_evaluation_controle_continu_examen.md",
                "section": "Contrôle Continu et Examen Final (Article 8)",
            }
        ],
    },
    {
        "id": "b19",
        "category": "admission",
        "question": "Quel concours permet aux titulaires du baccalauréat d'accéder à la première année du CAP-ENCG ?",
        "relevant": [
            {
                "source": "02_formation/02_formation_initiale.md",
                "section": "Diplôme de l'ENCG (DENCG)",
            }
        ],
    },
    {
        "id": "b20",
        "category": "admission",
        "question": "Quel concours permet aux élèves des classes préparatoires d'intégrer directement le Cycle ENCG ?",
        "relevant": [
            {
                "source": "11_admission/01_admission.md",
                "section": "CNAEM -- Concours National d'Accès aux Écoles de Management",
            }
        ],
    },
]


# ============================================================
# NORMALISATION
# ============================================================

def normalize(value):
    if value is None:
        return ""

    return " ".join(
        str(value)
        .strip()
        .lower()
        .replace("’", "'")
        .split()
    )


# ============================================================
# MATCHING
# ============================================================

def result_matches_expected(result, expected):
    """
    Vérifie si un chunk retourné correspond à une référence attendue.

    Source obligatoire.
    Section obligatoire si présente dans expected.
    Subsection obligatoire si présente dans expected.
    """

    if normalize(result.get("source")) != normalize(expected.get("source")):
        return False

    expected_section = expected.get("section")

    if expected_section:
        if normalize(result.get("section")) != normalize(expected_section):
            return False

    expected_subsection = expected.get("subsection")

    if expected_subsection:
        if normalize(result.get("subsection")) != normalize(expected_subsection):
            return False

    return True


def get_matching_expected(result, expected_list):
    matches = []

    for expected in expected_list:
        if result_matches_expected(result, expected):
            matches.append(expected)

    return matches


# ============================================================
# HTTP
# ============================================================

def call_retrieval(question):
    payload = {
        "query": question,
        "candidateK": CANDIDATE_K,
        "finalK": FINAL_K,
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        API_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    start = time.perf_counter()

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read().decode("utf-8")

        latency = time.perf_counter() - start

        return json.loads(body), latency

    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")

        raise RuntimeError(
            f"HTTP {error.code}: {body}"
        )

    except urllib.error.URLError as error:
        raise RuntimeError(
            f"Impossible de contacter {API_URL}: {error}"
        )


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(results, expected):
    metrics = {}

    for k in [1, 3, 5]:
        top_k = results[:k]

        matched_expected = set()

        for result in top_k:
            for index, expected_item in enumerate(expected):
                if result_matches_expected(result, expected_item):
                    matched_expected.add(index)

        # Recall réel :
        # nombre de références pertinentes retrouvées
        # / nombre total de références pertinentes
        recall = (
            len(matched_expected) / len(expected)
            if expected
            else 0
        )

        # Hit :
        # au moins un chunk pertinent retrouvé
        hit = 1 if matched_expected else 0

        metrics[f"recall@{k}"] = recall
        metrics[f"hit@{k}"] = hit

    # MRR
    first_relevant_rank = None

    for rank, result in enumerate(results, start=1):
        if get_matching_expected(result, expected):
            first_relevant_rank = rank
            break

    if first_relevant_rank:
        mrr = 1 / first_relevant_rank
    else:
        mrr = 0

    metrics["first_relevant_rank"] = first_relevant_rank
    metrics["mrr"] = mrr

    return metrics


# ============================================================
# DISPLAY
# ============================================================

def print_result(item, response, latency, metrics):

    results = response.get("results", [])

    print()
    print("=" * 90)
    print(
        f"{item['id']} | "
        f"{item['category']} | "
        f"{item['question']}"
    )
    print("-" * 90)

    print(
        f"Latency: {latency:.3f}s | "
        f"First relevant rank: {metrics['first_relevant_rank']} | "
        f"MRR: {metrics['mrr']:.3f}"
    )

    print(
        f"Recall@1={metrics['recall@1']:.3f} | "
        f"Recall@3={metrics['recall@3']:.3f} | "
        f"Recall@5={metrics['recall@5']:.3f}"
    )

    print()

    for rank, result in enumerate(results[:FINAL_K], start=1):

        is_relevant = bool(
            get_matching_expected(
                result,
                item["relevant"]
            )
        )

        marker = "✓" if is_relevant else " "

        reranker_score = result.get(
            "reranker_score",
            None
        )

        print(
            f"{marker} #{rank:<2} "
            f"{result.get('source', '')}"
        )

        print(
            f"     section={result.get('section')}"
        )

        print(
            f"     subsection={result.get('subsection')}"
        )

        if reranker_score is not None:
            print(
                f"     reranker_score="
                f"{float(reranker_score):.6f}"
            )

        print(
            f"     rrf={result.get('rrf_score')}"
        )

        print(
            f"     vector={result.get('vector_similarity')}"
        )

        print(
            f"     keyword={result.get('keyword_score')}"
        )


# ============================================================
# SAVE RESULTS
# ============================================================

def save_json(results):
    with open(
        RESULTS_JSON,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            results,
            file,
            ensure_ascii=False,
            indent=2
        )


def save_csv(results):

    if not results:
        return

    fieldnames = [
        "id",
        "category",
        "question",
        "latency_seconds",
        "recall@1",
        "recall@3",
        "recall@5",
        "hit@1",
        "hit@3",
        "hit@5",
        "mrr",
        "first_relevant_rank",
    ]

    with open(
        RESULTS_CSV,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()

        for item in results:
            writer.writerow({
                field: item.get(field)
                for field in fieldnames
            })


# ============================================================
# SUMMARY
# ============================================================

def print_summary(all_results):

    successful = [
        item
        for item in all_results
        if item["status"] == "OK"
    ]

    failed = [
        item
        for item in all_results
        if item["status"] != "OK"
    ]

    if not successful:
        print("\nAucun test réussi.")
        return

    print()
    print()
    print("#" * 90)
    print("BENCHMARK SUMMARY")
    print("#" * 90)

    latencies = [
        item["latency_seconds"]
        for item in successful
    ]

    print(
        f"Questions réussies : "
        f"{len(successful)}/{len(all_results)}"
    )

    if failed:
        print(
            f"Questions en erreur : "
            f"{len(failed)}"
        )

    print()

    print(
        f"Latency moyenne : "
        f"{statistics.mean(latencies):.3f}s"
    )

    print(
        f"Latency médiane : "
        f"{statistics.median(latencies):.3f}s"
    )

    print(
        f"Latency min      : "
        f"{min(latencies):.3f}s"
    )

    print(
        f"Latency max      : "
        f"{max(latencies):.3f}s"
    )

    print()

    for metric in [
        "recall@1",
        "recall@3",
        "recall@5",
        "hit@1",
        "hit@3",
        "hit@5",
        "mrr",
    ]:

        values = [
            item[metric]
            for item in successful
        ]

        print(
            f"{metric:<12}: "
            f"{statistics.mean(values):.3f}"
        )

    # --------------------------------------------------------
    # Par catégorie
    # --------------------------------------------------------

    print()
    print("PERFORMANCE PAR CATEGORIE")
    print("-" * 90)

    categories = sorted(
        set(item["category"] for item in successful)
    )

    for category in categories:

        category_results = [
            item
            for item in successful
            if item["category"] == category
        ]

        avg_mrr = statistics.mean(
            item["mrr"]
            for item in category_results
        )

        avg_recall5 = statistics.mean(
            item["recall@5"]
            for item in category_results
        )

        avg_latency = statistics.mean(
            item["latency_seconds"]
            for item in category_results
        )

        print(
            f"{category:<18} "
            f"Recall@5={avg_recall5:.3f} | "
            f"MRR={avg_mrr:.3f} | "
            f"Latency={avg_latency:.3f}s"
        )

    # --------------------------------------------------------
    # Questions problématiques
    # --------------------------------------------------------

    print()
    print("QUESTIONS AVEC ECHEC DE RETRIEVAL")
    print("-" * 90)

    problematic = [
        item
        for item in successful
        if item["recall@5"] < 1
    ]

    if not problematic:
        print("Aucun échec Recall@5.")
    else:
        for item in problematic:
            print(
                f"{item['id']} | "
                f"Recall@5={item['recall@5']:.3f} | "
                f"MRR={item['mrr']:.3f} | "
                f"{item['question']}"
            )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 90)
    print("ENCG RAG RETRIEVAL BENCHMARK")
    print("=" * 90)

    print(f"API         : {API_URL}")
    print(f"candidateK  : {CANDIDATE_K}")
    print(f"finalK      : {FINAL_K}")
    print(f"Questions   : {len(DATASET)}")

    # Test connexion avant de lancer les 20 questions
    print()
    print("Test de connexion au RAG service...")

    try:
        # On ne fait pas de requête supplémentaire :
        # le premier test servira aussi de connexion.
        pass

    except Exception as error:
        print(f"Erreur : {error}")
        return

    all_results = []

    for index, item in enumerate(DATASET, start=1):

        print()
        print(
            f"[{index}/{len(DATASET)}] "
            f"{item['question']}"
        )

        try:

            response, latency = call_retrieval(
                item["question"]
            )

            results = response.get(
                "results",
                []
            )

            metrics = calculate_metrics(
                results,
                item["relevant"]
            )

            result_record = {
                "id": item["id"],
                "category": item["category"],
                "question": item["question"],
                "latency_seconds": latency,

                "recall@1": metrics["recall@1"],
                "recall@3": metrics["recall@3"],
                "recall@5": metrics["recall@5"],

                "hit@1": metrics["hit@1"],
                "hit@3": metrics["hit@3"],
                "hit@5": metrics["hit@5"],

                "mrr": metrics["mrr"],
                "first_relevant_rank": metrics[
                    "first_relevant_rank"
                ],

                "results": results,

                "status": "OK",
            }

            all_results.append(
                result_record
            )

            print_result(
                item,
                response,
                latency,
                metrics
            )

        except Exception as error:

            print(
                f"ERROR: {error}"
            )

            all_results.append({
                "id": item["id"],
                "category": item["category"],
                "question": item["question"],
                "status": "ERROR",
                "error": str(error),
            })

    save_json(all_results)
    save_csv(all_results)

    print_summary(all_results)

    print()
    print("=" * 90)
    print("Fichiers générés :")
    print(f"  - {RESULTS_JSON}")
    print(f"  - {RESULTS_CSV}")
    print("=" * 90)


if __name__ == "__main__":
    main()
