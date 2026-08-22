"""
schemas/assistant_schema.py — Request/response shapes for the AI assistant
chat endpoint (Milestone 4).
"""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    provider_used: str
