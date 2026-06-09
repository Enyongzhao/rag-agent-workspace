from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.core.database import get_db
from backend.dependencies.auth import get_current_user
from backend.models.document import Document
from backend.models.user import User
from backend.schemas.document import DocumentRead


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)

@router.post(
    "/upload",
    response_model=DocumentRead,
)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    original_filename = file.filename or "document.pdf"
    stored_filename = f"{uuid4()}.pdf"
    file_path = upload_dir / stored_filename

    content = await file.read()

    with open(file_path, "wb") as output_file:
        output_file.write(content)

    document = Document(
        owner_id=current_user.id,
        original_filename=original_filename,
        stored_filename=stored_filename,
        content_type=file.content_type,
        file_path=str(file_path),
        status="uploaded",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document

@router.get(
    "",
    response_model=list[DocumentRead],
)
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    documents = (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return documents