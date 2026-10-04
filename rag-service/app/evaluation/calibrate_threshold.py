import json
import sys
import urllib.request

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://rag-service:8000"

# Questions dont la réponse EST dans vos documents (adaptez-les)
IN_DOCS = [
    "Quels sont les débouchés du Master MPMDC ?",
    "Combien de semestres dure le master MPMDC ?",
    "Quels sont les parcours proposés par l'ENCG ?",
    "Quelles sont les compétences développées dans le master MRHEP ?",
    "Quelles sont les filières du cycle ENCG ?",
    "Quels sont les débouchés de la filière Finance ?",
    "Que contient le programme du master MPMDC au semestre 1 ?",
    "Quelles sont les matières de Finance au semestre 5 ?",
    "Quelles sont les conditions d'accès aux masters ?",
    "Qu'est-ce que la filière Commerce International ?",
]

# Questions dont la réponse N'EST PAS dans vos documents
OUT_DOCS = [
    "Quelle est la recette du tajine aux olives ?",
    "Qui a gagné la Coupe du monde de football en 2018 ?",
    "Quel temps fait-il demain à Casablanca ?",
    "Comment réparer une fuite d'eau sous un évier ?",
    "Quel est le prix d'un billet d'avion pour Paris ?",
    "Écris-moi un poème sur la mer.",
    "Quelle est la capitale de l'Australie ?",
    "Combien coûte un iPhone 15 ?",
    "Quel est le menu de la cantine de l'ENCG demain ?",
    "Quel est le salaire du directeur de l'ENCG ?",
]


def top_score(question: str):
    body = json.dumps(
        {"query": question, "candidate_k": 10, "final_k": 3}).encode()
    req = urllib.request.Request(f"{BASE_URL}/rag/retrieve", data=body,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        results = json.load(r).get("results", [])
    scores = [c.get("reranker_score")
              for c in results if c.get("reranker_score") is not None]
    if not scores:
        return None, None
    best = max(results, key=lambda c: c.get("reranker_score") or -1e9)
    return max(scores), best.get("source")


def run(label, questions):
    print(f"\n=== {label}")
    out = []
    for q in questions:
        s, src = top_score(q)
        print(
            f"  {('%.3f' % s) if s is not None else ' None':>6}  {q[:62]:<62}  {src or ''}")
        if s is not None:
            out.append(s)
    return out


inn, out = run("Réponse PRÉSENTE dans les documents", IN_DOCS), run(
    "Réponse ABSENTE des documents", OUT_DOCS)
if not inn or not out:
    sys.exit(
        "\nAucun reranker_score reçu : vérifiez que /rag/retrieve renvoie bien ce champ.")

print(f"\nPrésentes : min={min(inn):.3f}  moyenne={sum(inn)/len(inn):.3f}")
print(f"Absentes  : max={max(out):.3f}  moyenne={sum(out)/len(out):.3f}")
if min(inn + out) < 0 or max(inn + out) > 1:
    print("ATTENTION : scores hors de [0 ; 1] -> le reranker ne applique pas de sigmoïde, "
          "l'histogramme de l'admin (tranches de 0,2) sera à adapter.")

# Meilleur seuil : une réponse présente refusée à tort coûte 2 fois plus qu'une absente acceptée
candidates = sorted(set(inn + out))
mids = [(a + b) / 2 for a, b in zip(candidates, candidates[1:])] or candidates
best_t = min(mids, key=lambda t: 2 *
             sum(s < t for s in inn) + sum(s >= t for s in out))
wrong_in = sum(s < best_t for s in inn)
wrong_out = sum(s >= best_t for s in out)

print(f"\nSeuil conseillé : {best_t:.2f}")
print(f"  -> {wrong_in}/{len(inn)} questions valides seraient refusées à tort")
print(f"  -> {wrong_out}/{len(out)} questions hors sujet passeraient quand même")
if min(inn) <= max(out):
    print("Les deux groupes se chevauchent : le seuil sera imparfait. Ajoutez des documents ou ajustez les questions.")

print("\nA mettre dans application.yml du chat-service :")
print("  admin.rag.low-score-threshold:", round(best_t, 2),
      " (questions signalées « mal couvertes »)")
print("  rag.fallback.min-score:       ", round(best_t * 0.8, 2),
      " (en dessous : le chatbot refuse de répondre)")
