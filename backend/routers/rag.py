from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.dependencies.auth import get_current_user
from backend.models.document import Document
from backend.models.user import User
from backend.schemas.rag import (
    RagQueryRequest,
    RagQueryResponse,
    RagSource,
)
from backend.services.rag_answer import generate_rag_answer
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
    db: Session = Depends(get_db),
):
    if request.document_id is not None:
        requested_document = (
            db.query(Document)
            .filter(
                Document.id == request.document_id,
                Document.owner_id == current_user.id,
            )
            .first()
        )

        if requested_document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

    results = search_user_documents(
        user_id=current_user.id,
        question=request.question,
        document_id=request.document_id,
        k=request.top_k,
    )

    documents = [
        document
        for document, _score in results
    ]

    answer = generate_rag_answer(
        question=request.question,
        documents=documents,
    )

    document_ids = {
        document.metadata.get("document_id")
        for document in documents
        if isinstance(document.metadata.get("document_id"), int)
    }

    documents_by_id = {
        document.id: document
        for document in (
            db.query(Document)
            .filter(
                Document.id.in_(document_ids),
                Document.owner_id == current_user.id,
            )
            .all()
            if document_ids
            else []
        )
    }

    sources = []

    for document, score in results:
        metadata = dict(document.metadata)
        source_document_id = metadata.get("document_id")

        if isinstance(source_document_id, int):
            source_document = documents_by_id.get(source_document_id)

            if source_document is not None:
                metadata["original_filename"] = source_document.original_filename

        sources.append(
            RagSource(
                content=document.page_content,
                metadata=metadata,
                score=score,
            )
        )

    return RagQueryResponse(
        question=request.question,
        answer=answer,
        sources=sources,
    )