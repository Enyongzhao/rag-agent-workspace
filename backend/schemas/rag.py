from typing import Any

from pydantic import BaseModel, Field


class RagQueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    document_id: int | None = None
    top_k: int = Field(default=4, ge=1, le=10)


class RagSource(BaseModel):
    content: str
    metadata: dict[str, Any]
    score: float


class RagQueryResponse(BaseModel):
    question: str
    answer: str
    sources: list[RagSource]
