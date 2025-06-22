# ---- Backend (FastAPI) ----
FROM python:3.11-slim AS backend

# Prevent interactive prompts
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Add wait-for-it script to wait for PostgreSQL
RUN apt-get update && apt-get install -y wait-for-it

# Expose port & default command
EXPOSE 8000

# Wait for PostgreSQL and start the app
CMD ["sh", "-c", "wait-for-it postgres:5432 -- uvicorn main:app --host 0.0.0.0 --port 8000"] 