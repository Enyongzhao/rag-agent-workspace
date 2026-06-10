from uuid import uuid4

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

from backend.core.config import settings


def get_embedding_model() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(
        model_name=settings.embedding_model_name,
    )


def get_vector_store() -> Chroma:
    return Chroma(
        collection_name=settings.chroma_collection_name,
        embedding_function=get_embedding_model(),
        persist_directory=settings.chroma_dir,
    )


def index_document_chunks(
    document_id: int,
    user_id: int,
    chunks: list[Document],
) -> int:
    vector_store = get_vector_store()

    ids = []
    indexed_chunks = []

    for index, chunk in enumerate(chunks):
        chunk.metadata = {
            **chunk.metadata,
            "document_id": document_id,
            "user_id": user_id,
            "chunk_index": index,
        }

        ids.append(f"document-{document_id}-chunk-{index}-{uuid4()}")
        indexed_chunks.append(chunk)

    vector_store.add_documents(
        documents=indexed_chunks,
        ids=ids,
    )

    return len(indexed_chunks)


def search_user_documents(
    user_id: int,
    question: str,
    k: int = 4,
) -> list[Document]:
    vector_store = get_vector_store()

    results = vector_store.similarity_search(
        query=question,
        k=k,
        filter={
            "user_id": user_id,
        },
    )

    return results