# Agent Workspace Backend

FastAPI backend with user registration, login, JWT authentication, and PostgreSQL.

## Project Structure

```text
app/
  core/
    config.py
    database.py
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

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/my_agent
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Backend

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
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
