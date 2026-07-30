from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ActivityRecordResponse(BaseModel):
    id: str
    action_type: str
    entity_type: str
    entity_id: Optional[str] = None
    description: str
    timestamp: datetime

    class Config:
        from_attributes = True

class PaginatedActivityResponse(BaseModel):
    items: list[ActivityRecordResponse]
    total: int
    page: int
    limit: int
    pages: int
