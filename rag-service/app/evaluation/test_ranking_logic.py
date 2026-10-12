from app.services.metadata_detector import MetadataDetector
from app.db.repositories.retrieval_repository import RetrievalRepository
from app.services.reranker_service import RerankerService
from app.services.retrieval_service import RetrievalService
import sys
import types
import math
from pathlib import Path
ROOT = str(Path(__file__).resolve().parents[1])
sys.path.insert(0, ROOT)
sys.dont_write_bytecode = True

# --- stubs des dépendances lourdes


class FakeCE:
    def __init__(self, *a, **k): pass


st = types.ModuleType("sentence_transformers")
st.CrossEncoder = FakeCE
st.SentenceTransformer = FakeCE
sys.modules["sentence_transformers"] = st
th = types.ModuleType("torch")
th.set_num_threads = lambda n: None
sys.modules["torch"] = th


class C:  # faux chunk de base
    def __init__(self, i, content, section, subsection=None):
        self.id, self.content, self.chunk_index, self.section, self.subsection = i, content, i, section, subsection


QUERY = "Quelle est la durée du stage d'initiation dans la formation initiale ?"
print("Catégorie détectée :", MetadataDetector.detect_category(
    QUERY), "| section :", MetadataDetector.detect_section(QUERY))

# 14 chunks de la catégorie "Formation" (peu pertinents) + 1 chunk "Règlement" (la vraie réponse)
formation = [C(i, f"formation chunk {i}", f"Section {i}")
             for i in range(1, 15)]
answer = C(100, "REPONSE stage d'initiation un mois article 11",
           "Stage d'initiation (Article 11)")


def row_v(c, cat, d=0.2): return (c, "src.md", cat, None, None, d)
def row_k(c, cat, s=0.5): return (c, "src.md", cat, None, None, s)


def fake_vector(db, query_embedding, top_k, category=None, filiere=None, section=None, subsection=None):
    if category:
        return [row_v(c, "Formation") for c in formation[:10]][:top_k]
    return ([row_v(answer, "Règlement", 0.1)] + [row_v(c, "Formation") for c in formation[:4]])[:top_k]


def fake_keyword(db, query, top_k, category=None, filiere=None, section=None, subsection=None):
    if category:
        return [row_k(c, "Formation") for c in formation[4:14]][:top_k]
    return ([row_k(answer, "Règlement", 0.9)] + [row_k(c, "Formation") for c in formation[4:8]])[:top_k]


RetrievalRepository.search_similar_chunks = staticmethod(fake_vector)
RetrievalRepository.search_keyword_chunks = staticmethod(fake_keyword)
RetrievalRepository.get_chunks_by_section = staticmethod(
    lambda db, source, section: [])

# score du faux reranker, par mot-clé du contenu
SCORES = {"REPONSE": 0.95}


class FakeModel:
    def predict(self, pairs, **k):
        return [next((v for kw, v in SCORES.items() if kw in text), 0.3) for _, text in pairs]


reranker = RerankerService.__new__(RerankerService)
reranker.model = FakeModel()
seen = {}
orig = reranker.rerank


def spy(query, results, top_k=5):
    seen["candidates"] = [r["chunk_index"] for r in results]
    return orig(query=query, results=results, top_k=top_k)


reranker.rerank = spy


class FakeEmb:
    def embed_query(self, q): return [0.0]


svc = RetrievalService(FakeEmb(), reranker)
out = svc.search(db=None, query=QUERY, candidate_k=10, final_k=3)

print("\n[TEST 1] Le vrai chunk (id 100, venu du filet de sécurité) arrive-t-il au reranker ?")
print("  candidats envoyés au reranker :", seen["candidates"])
print("  ->", "OUI" if 100 in seen["candidates"]
      else "NON (coupé avant le reranker)")
print("  top 3 final :", [r["chunk_index"] for r in out[:3]])

print("\n[TEST 2] Un chunk peu pertinent mais bien étiqueté peut-il passer devant un chunk très pertinent ?")
SCORES.clear()
SCORES.update({"BON": 0.92, "ETIQUETE": 0.55, "HORS": 0.05})
res = [
    {"content": "BON chunk", "metadata_boost": 0.0, "chunk_index": 1},
    {"content": "ETIQUETE chunk", "metadata_boost": 0.65,
        "chunk_index": 2},  # catégorie+section+filière+intent
    {"content": "HORS sujet", "metadata_boost": 0.0, "chunk_index": 3},
]
final = RerankerService.rerank(reranker, "q", res, top_k=3)
for r in final:
    print(f"  chunk {r['chunk_index']}: score reranker={r['reranker_score']:.2f} boost={r['metadata_boost']:.2f} -> final={r['final_score']:.3f}")
print("  ->", "BON en premier" if final[0]["chunk_index"]
      == 1 else "ETIQUETE passe devant (erreur)")

# --- vérifications automatiques
assert 100 in seen["candidates"], "ECHEC test 1 : le chunk du filet de sécurité est coupé avant le reranker"
assert out[0]["chunk_index"] == 100, "ECHEC test 1 : le bon chunk n'est pas premier"
assert final[0]["chunk_index"] == 1, "ECHEC test 2 : un chunk étiqueté mais peu pertinent passe devant"
print("\nTOUS LES TESTS PASSENT")
