from datetime import datetime

from pydantic import BaseModel


class DocumentRead(BaseModel):
    id: int
    original_filename: str
    content_type: str
    status: str
    created_at: datetime
    chunk_count: int
    
    model_config = {
        "from_attributes": True
    }