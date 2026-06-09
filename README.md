# Agent Workspace

Full-stack learning scaffold with FastAPI, PostgreSQL, Redis, JWT auth, React, TypeScript, React Query, Zustand, Tailwind CSS, and Docker Compose.

## Project Structure

```text
backend/
  core/
    config.py
    database.py
    redis.py
    security.py
  dependencies/
    auth.py
  models/
    user.py
  routers/
    auth.py
  schemas/
    user.py
  main.py
```

## Environment Variables

Create a `.env` file in the project root for running the backend outside Docker:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/rag_agent
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_URL=redis://localhost:6379/0
```

## Run With Docker

Start PostgreSQL, Redis, FastAPI, and React:

```bash
docker compose up -d
```

Backend:

```text
http://127.0.0.1:8000
```

Frontend:

```text
http://127.0.0.1:5173
```

## Run Backend Locally

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

OpenAPI docs:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
GET /api/health
```

## Auth API

Register:

```text
POST /api/auth/register
```

Request body:

```json
{
  "username": "demo",
  "email": "demo@example.com",
  "password": "password123"
}
```

Login:

```text
POST /api/auth/login
```

Request body:

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

Get current user:

```text
GET /api/auth/me
```

Header:

```text
Authorization: Bearer <access_token>
```

Login creates a short-lived JWT and stores the active session in Redis. The login endpoint also has basic per-IP rate limiting backed by Redis.
