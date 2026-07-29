"""
models/finance.py — Beanie ODM Document mirroring backend/database/schemas/finance_schema.ts.
Collection: `financial_records`
Immutable ledger: no updated_at per TS design decision ("Ledger entries are immutable!").
DO NOT alter field names — they map directly to existing MongoDB documents.
"""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from beanie import Document, DecimalAnnotation, PydanticObjectId
from pydantic import Field, field_validator

from models.enums import TransactionType, FinancialCategory, RecurringFrequency


class FinancialRecord(Document):
    user_id: PydanticObjectId
    type: TransactionType
    amount: DecimalAnnotation = Field(..., gt=0, description="Must be strictly greater than 0.00")
    category: FinancialCategory
    description: Optional[str] = Field(default=None, max_length=255)
    is_recurring: bool = False
    recurring_frequency: Optional[RecurringFrequency] = None
    linked_goal_id: Optional[PydanticObjectId] = None   # Reference to active_goals.goal_id
    transaction_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("recurring_frequency", mode="before")
    @classmethod
    def frequency_required_when_recurring(cls, v, info):
        # mirrors: required: function() { return this.is_recurring === true; }
        # Full cross-field check is done in the service layer before insert.
        return v

    class Settings:
        name = "financial_records"  # ← Exact collection name from TS layer

    class Config:
        populate_by_name = True
