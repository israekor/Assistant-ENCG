FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

# Installation de PyTorch CPU uniquement
RUN pip install --no-cache-dir \
    torch==2.14.0 \
    --index-url https://download.pytorch.org/whl/cpu

# Installation des autres dépendances
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini .
COPY documents ./documents

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]