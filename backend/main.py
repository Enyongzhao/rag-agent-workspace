from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings
from backend.core.database import (
    Base,
    engine,
    SessionLocal,
)

from backend.routers.auth import (
    router as auth_router
)

from backend.routers.documents import router as documents_router

from sqlalchemy import text
from backend.core.redis import ping_redis

from backend.routers.rag import router as rag_router

Base.metadata.create_all(
    bind=engine
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
)


app.include_router(
    documents_router,
)


app.include_router(
    rag_router,
)


@app.get("/api/health")
async def health_check():
    db_status = "ok"
    redis_status = "ok"

    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    finally:
        db.close()

    try:
        await ping_redis()
    except Exception:
        redis_status = "error"

    overall_status = (
        "ok"
        if db_status == "ok" and redis_status == "ok"
        else "error"
    )

    return {
        "status": overall_status,
        "services": {
            "database": db_status,
            "redis": redis_status,
        },
    }
