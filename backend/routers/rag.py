from fastapi import APIRouter, Depends

from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.rag import (
    RagQueryRequest,
    RagQueryResponse,
    RagSource,
)
from backend.services.vector_store import search_user_documents


router = APIRouter(
    prefix="/api/rag",
    tags=["RAG"],
)


@router.post(
    "/query",
    response_model=RagQueryResponse,
)
async def query_rag(
    request: RagQueryRequest,
    current_user: User = Depends(get_current_user),
):
    results = search_user_documents(
        user_id=current_user.id,
        question=request.question,
    )

    sources = [
        RagSource(
            content=document.page_content,
            metadata=document.metadata,
        )
        for document in results
    ]

    return RagQueryResponse(
        question=request.question,
        results=sources,
    )