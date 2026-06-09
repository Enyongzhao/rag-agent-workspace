from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    status = Column(String, nullable=False, default="uploaded")

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    owner = relationship("User")