"""
services/goal_progress_service.py — Shared helper for atomically adjusting an
ActiveGoal's current_value when a finance/study/habit record links to it.

A leaf module (only depends on models.user) so finance_service/study_service/
habit_service can all import it without circularity — user_service.py already
imports finance_service, so finance_service importing user_service back would
create a cycle.
"""
from __future__ import annotations

import logging
from decimal import Decimal

from beanie import PydanticObjectId
from bson.decimal128 import Decimal128

from models.user import User

logger = logging.getLogger("digital_twin_ai.goal_progress_service")


async def adjust_active_goal_progress(user_id: str, goal_id: str, delta: Decimal) -> None:
    """Atomically increments (or, for a negative delta, decrements) one active
    goal's current_value via $inc — never a read-modify-write whole-document
    .save(), which could silently drop a concurrent edit to a *different* goal
    made by another in-flight request (same pattern/rationale as
    user_service.update_active_goal's positional-$ atomic update)."""
    if delta == 0:
        return

    collection = User.get_motor_collection()
    result = await collection.update_one(
        {"_id": PydanticObjectId(user_id), "active_goals.goal_id": goal_id},
        {"$inc": {"active_goals.$.current_value": Decimal128(str(delta))}},
    )
    if result.matched_count == 0:
        logger.warning(
            "Linked goal %s not found for user %s; skipping goal progress update.", goal_id, user_id
        )
