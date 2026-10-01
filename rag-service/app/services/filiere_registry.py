"""
Registre des filières, chargé depuis la table rag_filieres et mis en cache.
- Rechargé automatiquement toutes les 60 s et après chaque modification faite depuis l'admin.
- Si la base est injoignable au tout premier chargement, is_available() reste False et le code
  retombe sur les dictionnaires historiques de MetadataService / MetadataDetector.
"""
import re
import threading
import time

from sqlalchemy import select

from app.db.database import SessionLocal
from app.db.models import RagFiliere


class FiliereRegistry:
    TTL_SECONDS = 60

    _lock = threading.Lock()
    _loaded_at = 0.0
    _available = False
    _names_by_stem: dict[str, str] = {}
    _aliases: list[tuple[str, str]] = []  # (alias, nom), du plus long au plus court

    @classmethod
    def refresh(cls) -> None:
        db = SessionLocal()
        try:
            rows = db.scalars(select(RagFiliere)).all()
            names = {r.file_stem: r.name for r in rows}
            aliases = []
            for r in rows:
                # Le nom complet compte aussi comme alias
                for a in {r.name, *(r.aliases or [])}:
                    a = a.strip().lower()
                    if a:
                        aliases.append((a, r.name))
            aliases.sort(key=lambda x: len(x[0]), reverse=True)  # le plus spécifique d'abord
            with cls._lock:
                cls._names_by_stem, cls._aliases, cls._available = names, aliases, True
        except Exception as e:  # on garde l'ancien cache
            print(f"[FILIERES] chargement impossible : {e}")
        finally:
            db.close()
            cls._loaded_at = time.time()

    @classmethod
    def _ensure(cls) -> None:
        if time.time() - cls._loaded_at > cls.TTL_SECONDS:
            cls.refresh()

    @classmethod
    def is_available(cls) -> bool:
        cls._ensure()
        return cls._available

    @classmethod
    def name_for_stem(cls, stem: str) -> str | None:
        cls._ensure()
        return cls._names_by_stem.get(stem)

    @classmethod
    def detect(cls, query: str) -> str | None:
        cls._ensure()
        q = query.lower()
        for alias, name in cls._aliases:
            if len(alias) <= 3:
                # Alias courts (ex. "cac") : mot entier, pour éviter les faux positifs
                if re.search(rf"(?<!\w){re.escape(alias)}(?!\w)", q):
                    return name
            elif alias in q:
                return name
        return None
