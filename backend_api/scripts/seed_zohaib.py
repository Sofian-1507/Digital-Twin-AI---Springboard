"""
One-off script: seeds ~6 months of realistic finance/study/habit/goal data
for zohaib@gmail.com in the live Atlas database, for demo purposes.
Run once: python3 scripts/seed_zohaib.py
"""
import os
import random
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from dotenv import load_dotenv
from pymongo import MongoClient
from bson import Decimal128

load_dotenv()

client = MongoClient(os.environ["MONGODB_URI"])
db = client[os.environ["MONGODB_DB_NAME"]]

user = db.users.find_one({"email": "zohaib@gmail.com"})
if not user:
    raise SystemExit("User not found")

USER_ID = user["_id"]
NOW = datetime.now(timezone.utc)
START = NOW - timedelta(days=182)


def D(value):
    return Decimal128(str(value))


def day_range():
    d = START
    while d <= NOW:
        yield d
        d += timedelta(days=1)


random.seed(42)

# ─── Finance: monthly salary + ~3 expenses/week ──────────────────────────────
finance_docs = []
for month_start in [START + timedelta(days=30 * i) for i in range(6)]:
    finance_docs.append({
        "user_id": USER_ID,
        "type": "INCOME",
        "amount": D(25000),
        "category": "SALARY",
        "description": "Monthly salary",
        "is_recurring": True,
        "recurring_frequency": "MONTHLY",
        "linked_goal_id": None,
        "transaction_date": month_start,
        "created_at": month_start,
    })

EXPENSE_CATS = ["FOOD", "HOUSING", "UTILITIES", "TRANSPORT", "ENTERTAINMENT", "HEALTH", "EDUCATION"]
for d in day_range():
    if random.random() < 0.4:
        cat = random.choice(EXPENSE_CATS)
        amount = {
            "FOOD": random.randint(200, 1200),
            "HOUSING": random.randint(5000, 8000),
            "UTILITIES": random.randint(500, 2000),
            "TRANSPORT": random.randint(100, 800),
            "ENTERTAINMENT": random.randint(300, 1500),
            "HEALTH": random.randint(200, 3000),
            "EDUCATION": random.randint(500, 4000),
        }[cat]
        finance_docs.append({
            "user_id": USER_ID,
            "type": "EXPENSE",
            "amount": D(amount),
            "category": cat,
            "description": None,
            "is_recurring": False,
            "recurring_frequency": None,
            "linked_goal_id": None,
            "transaction_date": d,
            "created_at": d,
        })
    if random.random() < 0.1:
        finance_docs.append({
            "user_id": USER_ID,
            "type": "SAVINGS_DEPOSIT",
            "amount": D(random.randint(500, 3000)),
            "category": "SAVINGS",
            "description": None,
            "is_recurring": False,
            "recurring_frequency": None,
            "linked_goal_id": None,
            "transaction_date": d,
            "created_at": d,
        })

# ─── Study: ~5 sessions/week across a few subjects ───────────────────────────
SUBJECTS = ["Maths", "DSA", "Physics", "Chemistry", "Operating Systems"]
SESSION_TYPES = ["DEEP_WORK", "REVIEW", "LECTURE", "PRACTICE_EXAM", "ASSIGNMENT", "RESEARCH"]
study_docs = []
for d in day_range():
    if random.random() < 0.7:
        subject = random.choice(SUBJECTS)
        hours = round(random.uniform(1, 4), 1)
        has_exam = random.random() < 0.15
        doc = {
            "user_id": USER_ID,
            "subject": subject,
            "study_hours": D(hours),
            "session_type": random.choice(SESSION_TYPES),
            "attendance_pct": D(random.choice([80, 90, 100, 100, 100])),
            "quiz_marks": None,
            "max_quiz_marks": None,
            "quiz_marks_pct": None,
            "exam_marks": None,
            "max_exam_marks": None,
            "exam_marks_pct": None,
            "focus_score": random.randint(55, 95),
            "linked_goal_id": None,
            "session_date": d,
            "created_at": d,
        }
        if has_exam:
            exam_marks = random.randint(60, 98)
            doc["exam_marks"] = D(exam_marks)
            doc["max_exam_marks"] = D(100)
            doc["exam_marks_pct"] = D(exam_marks)
        study_docs.append(doc)

# ─── Habits: 1 log per day (unique index on user_id+log_date) ────────────────
existing_habit_dates = {
    h["log_date"].date()
    for h in db.habit_trackings.find({"user_id": USER_ID}, {"log_date": 1})
}
habit_docs = []
for d in day_range():
    midnight = d.replace(hour=0, minute=0, second=0, microsecond=0)
    if midnight.date() in existing_habit_dates:
        continue
    habit_docs.append({
        "user_id": USER_ID,
        "sleep_hours": D(round(random.uniform(5.5, 8.5), 1)),
        "exercise_minutes": random.randint(0, 60),
        "water_intake_liters": D(round(random.uniform(1.5, 3.5), 1)),
        "screen_time_hours": D(round(random.uniform(2, 8), 1)),
        "mood_rating": random.randint(2, 5),
        "meditation_minutes": random.choice([None, 10, 15, 20]),
        "productivity_score_computed": None,
        "lifestyle_score_computed": None,
        "burnout_risk_cluster": "UNKNOWN",
        "log_date": midnight,
        "created_at": d,
    })

# ─── Goals: add two more active goals (keep existing one) ────────────────────
new_goals = [
    {
        "goal_id": str(uuid.uuid4()),
        "title": "Emergency Fund",
        "category": "FINANCE",
        "target_value": D(10000),
        "current_value": D(3500),
        "unit": "USD",
        "target_date": NOW + timedelta(days=150),
        "created_at": NOW - timedelta(days=90),
    },
    {
        "goal_id": str(uuid.uuid4()),
        "title": "Finish DSA Course",
        "category": "STUDY",
        "target_value": D(100),
        "current_value": D(62),
        "unit": "percent",
        "target_date": NOW + timedelta(days=45),
        "created_at": NOW - timedelta(days=60),
    },
]

if finance_docs:
    db.financial_records.insert_many(finance_docs)
if study_docs:
    db.study_activities.insert_many(study_docs)
if habit_docs:
    db.habit_trackings.insert_many(habit_docs)

db.users.update_one({"_id": USER_ID}, {"$push": {"active_goals": {"$each": new_goals}}})

print(f"Inserted {len(finance_docs)} finance records")
print(f"Inserted {len(study_docs)} study records")
print(f"Inserted {len(habit_docs)} habit records")
print(f"Added {len(new_goals)} goals")
