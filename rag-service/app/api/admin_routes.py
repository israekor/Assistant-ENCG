import os
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Header, HTTPException, UploadFile
import uuid

from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.rag_routes import chunking_service, embedding_service, ingestion_service
from app.db.database import SessionLocal, get_db
from app.db.models import RagChunk, RagDocument, RagFiliere
from app.services.filiere_registry import FiliereRegistry
from app.services.metadata_service import MetadataService
from app.services.persistence_service import PersistenceService

INTERNAL_KEY = os.getenv("RAG_INTERNAL_KEY", "")
MAX_SIZE = 10 * 1024 * 1024  # 10 Mo


def require_internal_key(x_internal_key: str = Header(default="")):
    # Sans clé configurée, on refuse tout : l'admin n'est jamais ouverte par défaut.
    if not INTERNAL_KEY or x_internal_key != INTERNAL_KEY:
        raise HTTPException(401, "Clé interne invalide")


router = APIRouter(prefix="/rag/admin",
                   tags=["RAG Admin"], dependencies=[Depends(require_internal_key)])
ROOT: Path = ingestion_service.documents_path


@router.get("/categories")
def categories():
    """Dossiers autorisés = ceux connus de MetadataService (la catégorie est déduite du dossier)."""
    return [{"folder": k, "label": v} for k, v in MetadataService.CATEGORY_NAMES.items()]


@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    indexed = {d.source: d for d in db.scalars(select(RagDocument))}
    counts = dict(db.execute(
        select(RagDocument.source, func.count(RagChunk.id)).join(RagChunk).group_by(RagDocument.source)).all())

    rows, on_disk = [], set()
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file() or p.suffix.lower() not in ingestion_service.SUPPORTED_EXTENSIONS:
            continue
        source = str(p.relative_to(ROOT))
        on_disk.add(source)
        doc = indexed.get(source)
        modified = datetime.fromtimestamp(
            p.stat().st_mtime, timezone.utc).replace(tzinfo=None)
        if doc is None:
            status = "pending"            # nouveau : pas encore indexé
        elif modified > doc.created_at:
            status = "modified"           # fichier plus récent que l'index
        else:
            status = "indexed"
        rows.append({"source": source, "size_kb": round(p.stat().st_size / 1024, 1),
                     "status": status, "chunks": counts.get(source, 0)})
    # Présents en base mais plus sur disque
    rows += [{"source": s, "size_kb": 0, "status": "orphan", "chunks": counts.get(s, 0)}
             for s in indexed if s not in on_disk]
    return rows


@router.post("/documents")
async def upload(category_folder: str = Form(...), files: list[UploadFile] = File(...)):
    if category_folder not in MetadataService.CATEGORY_NAMES:
        raise HTTPException(400, "Catégorie inconnue")
    target = ROOT / category_folder
    target.mkdir(parents=True, exist_ok=True)
    saved = []
    for f in files:
        name = Path(f.filename or "").name  # anti path-traversal
        if Path(name).suffix.lower() not in ingestion_service.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                400, f"Format non supporté : {name} (.md, .txt, .pdf)")
        data = await f.read()
        if len(data) > MAX_SIZE:
            raise HTTPException(413, f"{name} dépasse 10 Mo")
        (target / name).write_bytes(data)
        saved.append(f"{category_folder}/{name}")
    return {"saved": saved}


@router.delete("/documents")
def delete_document(source: str, db: Session = Depends(get_db)):
    path = (ROOT / source).resolve()
    if ROOT.resolve() not in path.parents:
        raise HTTPException(400, "Chemin invalide")
    if path.exists():
        path.unlink()
    doc = db.scalar(select(RagDocument).where(RagDocument.source == source))
    if doc:
        db.delete(doc)  # les chunks partent en cascade
        db.commit()
    return {"deleted": source}


# ---------- Filières configurables ----------
class FiliereIn(BaseModel):
    # nom du fichier sans extension
    file_stem: str = Field(min_length=1, max_length=200)
    name: str = Field(min_length=1, max_length=200)
    aliases: list[str] = []


def _out(r: RagFiliere) -> dict:
    return {"id": str(r.id), "file_stem": r.file_stem, "name": r.name, "aliases": r.aliases or []}


def _aliases(body: FiliereIn) -> list[str]:
    return sorted({a.strip().lower() for a in body.aliases if a.strip()})


@router.get("/filieres")
def list_filieres(db: Session = Depends(get_db)):
    return [_out(r) for r in db.scalars(select(RagFiliere).order_by(RagFiliere.file_stem))]


@router.post("/filieres", status_code=201)
def create_filiere(body: FiliereIn, db: Session = Depends(get_db)):
    stem = Path(body.file_stem).stem  # accepte "x.md" ou "x"
    if db.scalar(select(RagFiliere).where(RagFiliere.file_stem == stem)):
        raise HTTPException(409, "Une filière est déjà associée à ce fichier")
    row = RagFiliere(file_stem=stem, name=body.name.strip(),
                     aliases=_aliases(body))
    db.add(row)
    db.commit()
    FiliereRegistry.refresh()
    return _out(row)


@router.put("/filieres/{filiere_id}")
def update_filiere(filiere_id: uuid.UUID, body: FiliereIn, db: Session = Depends(get_db)):
    row = db.get(RagFiliere, filiere_id)
    if not row:
        raise HTTPException(404, "Filière introuvable")
    row.file_stem, row.name, row.aliases = Path(
        body.file_stem).stem, body.name.strip(), _aliases(body)
    db.commit()
    FiliereRegistry.refresh()
    return _out(row)


@router.delete("/filieres/{filiere_id}")
def delete_filiere(filiere_id: uuid.UUID, db: Session = Depends(get_db)):
    row = db.get(RagFiliere, filiere_id)
    if not row:
        raise HTTPException(404, "Filière introuvable")
    db.delete(row)
    db.commit()
    FiliereRegistry.refresh()
    return {"deleted": str(filiere_id)}


# ---------- Réindexation (asynchrone, un seul job à la fois) ----------
_lock = threading.Lock()
_state = {"status": "idle", "message": "", "started": None, "finished": None}


def _run():
    db = SessionLocal()
    try:
        FiliereRegistry.refresh()  # prend en compte les dernières filières configurées
        _state.update(status="running", message="Lecture et découpage…",
                      started=time.time(), finished=None)
        documents = ingestion_service.load_documents()
        chunks = chunking_service.split_documents(documents)
        _state["message"] = f"Calcul des embeddings ({len(chunks)} extraits)…"
        embedded = embedding_service.embed_chunks(chunks)
        # Upsert par source (remplace l'ancien contenu de chaque document)
        PersistenceService.save_embedded_chunks(
            db=db, embedded_chunks=embedded)
        # Supprime de la base les documents retirés du disque
        on_disk = {d.source for d in documents}
        for doc in db.scalars(select(RagDocument)):
            if doc.source not in on_disk:
                db.delete(doc)
        db.commit()
        _state.update(status="done", finished=time.time(),
                      message=f"{len(documents)} documents, {len(chunks)} extraits indexés.")
    except Exception as e:
        db.rollback()
        _state.update(status="error", message=str(e), finished=time.time())
    finally:
        db.close()
        _lock.release()


@router.post("/reindex", status_code=202)
def reindex(bg: BackgroundTasks):
    if not _lock.acquire(blocking=False):
        raise HTTPException(409, "Une indexation est déjà en cours")
    bg.add_task(_run)
    return {"status": "started"}


@router.get("/reindex/status")
def reindex_status():
    return _state
