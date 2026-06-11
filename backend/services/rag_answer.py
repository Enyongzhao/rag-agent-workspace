from langchain_core.documents import Document
from langchain_openai import ChatOpenAI

from backend.core.config import settings


def format_context(documents: list[Document]) -> str:
    context_parts = []

    for index, document in enumerate(documents, start=1):
        page = document.metadata.get("page")
        page_label = f"Page {page + 1}" if isinstance(page, int) else "Page unknown"

        context_parts.append(
            f"[Source {index} | {page_label}]\n{document.page_content}"
        )

    return "\n\n".join(context_parts)


def generate_rag_answer(
    question: str,
    documents: list[Document],
) -> str:
    if not documents:
        return "I could not find relevant information in your uploaded documents."

    context = format_context(documents)

    llm = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0,
    )

    prompt = f"""
You are a document question-answering assistant.

Answer the user's question using only the context below.
If the context does not contain enough information, say that you could not find the answer in the uploaded documents.
Do not invent facts.
Keep the answer concise and clear.

Context:
{context}

Question:
{question}

Answer:
""".strip()

    response = llm.invoke(prompt)

    return response.content