"""
services/finance_service.py — Business logic layer for financial record management.
Python equivalent of FinancialRecordRepository from finance_repository.ts.
Includes MongoDB aggregation pipelines for cashflow and category breakdown.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from beanie import PydanticObjectId

from core.exceptions import NotFoundError
from models.finance import FinancialRecord
from models.enums import TransactionType
from schemas.finance_schema import (
    FinanceCreateRequest,
    FinanceUpdateRequest,
    FinanceRecordResponse,
    PaginatedFinanceResponse,
    MonthlyCashflowItem,
    CategoryBreakdownItem,
)
import services.activity_service as activity_service

logger = logging.getLogger("digital_twin_ai.finance_service")


def _to_response(record: FinancialRecord) -> FinanceRecordResponse:
    return FinanceRecordResponse(
        id=str(record.id),
        user_id=str(record.user_id),
        type=record.type,
        amount=record.amount,
        category=record.category,
        description=record.description,
        is_recurring=record.is_recurring,
        recurring_frequency=record.recurring_frequency,
        linked_goal_id=record.linked_goal_id,
        transaction_date=record.transaction_date,
        created_at=record.created_at,
    )


async def create_transaction(
    user_id: str, payload: FinanceCreateRequest
) -> FinanceRecordResponse:
    """Creates an immutable financial record. No update_at per TS design."""
    record = FinancialRecord(
        user_id=PydanticObjectId(user_id),
        type=payload.type,
        amount=payload.amount,
        category=payload.category,
        description=payload.description,
        is_recurring=payload.is_recurring,
        recurring_frequency=payload.recurring_frequency,
        linked_goal_id=payload.linked_goal_id,
        transaction_date=payload.transaction_date or datetime.now(timezone.utc),
    )
    await record.insert()
        # Update linked goal progress when a transaction is linked to a goal.
    if payload.linked_goal_id:
        from models.user import User

        user = await User.get(PydanticObjectId(user_id))

        if user:
            for goal in user.active_goals:
                if goal.goal_id == payload.linked_goal_id:
                    goal.current_value += payload.amount
                    await user.save()
                    logger.info(
                        "Updated goal '%s' progress to %.2f",
                        goal.title,
                        goal.current_value,
                    )
                    break
    logger.info("Transaction logged: %s %.2f for user %s", record.type, record.amount, user_id)
    await activity_service.log_activity(
        user_id=user_id,
        action_type="CREATED_FINANCE",
        entity_type="FINANCE",
        entity_id=str(record.id),
        description=f"Logged {record.type} of {record.amount}"
    )
    return _to_response(record)

async def update_transaction(
    user_id: str, transaction_id: str, payload: FinanceUpdateRequest
) -> FinanceRecordResponse:
    uid = PydanticObjectId(user_id)
    try:
        tid = PydanticObjectId(transaction_id)
    except Exception:
        raise NotFoundError("Transaction", transaction_id)

    record = await FinancialRecord.find_one({"_id": tid, "user_id": uid})
    if not record:
        raise NotFoundError("Transaction", transaction_id)
        
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return _to_response(record)
        
    for key, value in update_data.items():
        setattr(record, key, value)

    await record.save()
    
    await activity_service.log_activity(
        user_id=user_id,
        action_type="UPDATED_FINANCE",
        entity_type="FINANCE",
        entity_id=str(record.id),
        description=f"Updated financial record {record.id}"
    )
    
    return _to_response(record)

async def delete_transaction(user_id: str, transaction_id: str) -> None:
    uid = PydanticObjectId(user_id)
    try:
        tid = PydanticObjectId(transaction_id)
    except Exception:
        raise NotFoundError("Transaction", transaction_id)

    record = await FinancialRecord.find_one({"_id": tid, "user_id": uid})
    if not record:
        raise NotFoundError("Transaction", transaction_id)
        
    await record.delete()
    
    await activity_service.log_activity(
        user_id=user_id,
        action_type="DELETED_FINANCE",
        entity_type="FINANCE",
        entity_id=str(record.id),
        description=f"Deleted financial record {record.amount}"
    )


async def list_transactions(
    user_id: str,
    page: int = 1,
    limit: int = 20,
    type_filter: Optional[TransactionType] = None,
    category_filter: Optional[str] = None,
) -> PaginatedFinanceResponse:
    """
    Paginated transaction list with optional filters.
    Mirrors BaseRepository.paginate() + ESR indexes: idx_finance_user_date, idx_finance_user_type_date.
    """
    uid = PydanticObjectId(user_id)
    query_filter: dict = {"user_id": uid}
    if type_filter:
        query_filter["type"] = type_filter
    if category_filter:
        query_filter["category"] = category_filter

    skip = (page - 1) * limit

    records = await FinancialRecord.find(
        query_filter,
        sort=[("transaction_date", -1)],
        skip=skip,
        limit=limit,
    ).to_list()

    total = await FinancialRecord.find(query_filter).count()

    return PaginatedFinanceResponse(
        data=[_to_response(r) for r in records],
        total=total,
        page=page,
        limit=limit,
        total_pages=max(1, -(-total // limit)),  # ceiling division
    )


async def get_monthly_cashflow(
    user_id: str,
    start_date: datetime,
    end_date: Optional[datetime] = None,
) -> list[MonthlyCashflowItem]:
    """
    MongoDB aggregation pipeline — Python port of getMonthlyCashflowPipeline()
    from finance_repository.ts. Used by the Random Forest ML model.
    """
    uid = PydanticObjectId(user_id)
    end = end_date or datetime.now(timezone.utc)

    pipeline = [
        {"$match": {"user_id": uid, "transaction_date": {"$gte": start_date, "$lte": end}}},
        {"$group": {
            "_id": {
                "year":  {"$year": "$transaction_date"},
                "month": {"$month": "$transaction_date"},
                "type":  "$type",
            },
            "total_amount":      {"$sum": "$amount"},
            "transaction_count": {"$sum": 1},
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}},
    ]

    results = await FinancialRecord.aggregate(pipeline).to_list()
    return [
        MonthlyCashflowItem(
            year=r["_id"]["year"],
            month=r["_id"]["month"],
            type=TransactionType(r["_id"]["type"]),
            total_amount=Decimal(str(r["total_amount"])),
            transaction_count=r["transaction_count"],
        )
        for r in results
    ]


async def get_category_breakdown(
    user_id: str,
    start_date: datetime,
    end_date: Optional[datetime] = None,
) -> list[CategoryBreakdownItem]:
    """
    Python port of getCategorySpendingBreakdown() from finance_repository.ts.
    Returns spending by category with % of total for donut charts.
    """
    uid = PydanticObjectId(user_id)
    end = end_date or datetime.now(timezone.utc)

    pipeline = [
        {"$match": {
            "user_id": uid,
            "type": TransactionType.EXPENSE,
            "transaction_date": {"$gte": start_date, "$lte": end},
        }},
        {"$group": {"_id": "$category", "total_amount": {"$sum": "$amount"}}},
        {"$sort": {"total_amount": -1}},
    ]

    results = await FinancialRecord.aggregate(pipeline).to_list()
    grand_total = sum(float(r["total_amount"].to_decimal()) for r in results)

    return [
        CategoryBreakdownItem(
            category=r["_id"],
            total_amount=Decimal(str(r["total_amount"])),
            percentage_of_total=round(
                (float(r["total_amount"].to_decimal()) / grand_total * 100) if grand_total > 0 else 0.0, 2
            ),
        )
        for r in results
    ]
