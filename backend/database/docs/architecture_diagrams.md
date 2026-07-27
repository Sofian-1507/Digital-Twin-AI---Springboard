# Digital Twin AI — Database Architecture & ER Diagrams

This document illustrates the MongoDB Atlas NoSQL collection topology, embedding vs. referencing boundaries, and data flow architecture.

---

## Complete Mermaid ER Data Model

```mermaid
erDiagram
    users ||--o{ financial_records : "user_id (1:N Ref)"
    users ||--o{ study_activities : "user_id (1:N Ref)"
    users ||--o{ habit_tracking : "user_id (1:N Ref)"
    users ||--o{ simulations : "user_id (1:N Ref)"
    users ||--o{ recommendations : "user_id (1:N Ref)"
    users ||--o{ chat_history : "user_id (1:N Ref)"
    users ||--o{ reports : "user_id (1:N Ref)"
    users ||--o{ dashboard_cache : "user_id (1:N Ref)"
    users ||--o{ goals_archive : "user_id (1:N Ref)"

    users {
        ObjectId _id PK
        string email UK
        string password_hash
        object profile "EMBEDDED 1:1"
        object preferences "EMBEDDED 1:1"
        array active_goals "EMBEDDED 1:Few (Max 30)"
        object digital_twin_state "EMBEDDED 1:1 AI Snapshot"
        date created_at
        date updated_at
    }

    financial_records {
        ObjectId _id PK
        ObjectId user_id FK
        string type "INCOME | EXPENSE | SAVINGS_DEPOSIT"
        decimal amount "> 0.00"
        string category
        boolean is_recurring
        date transaction_date
    }

    study_activities {
        ObjectId _id PK
        ObjectId user_id FK
        string subject
        decimal study_hours "0.1 - 24.0"
        string session_type
        decimal attendance_pct "0.0 - 100.0"
        decimal quiz_marks_pct "Auto-Computed"
        decimal exam_marks_pct "Auto-Computed"
        date session_date
    }

    habit_tracking {
        ObjectId _id PK
        ObjectId user_id FK
        decimal sleep_hours "0.0 - 24.0"
        int exercise_minutes "0 - 1440"
        decimal water_intake_liters "0.0 - 20.0"
        decimal screen_time_hours "0.0 - 24.0"
        string burnout_risk_cluster "K-Means Output"
        date log_date "Unique Compound with user_id"
    }

    recommendations {
        ObjectId _id PK
        ObjectId user_id FK
        string title
        string recommendation_text
        string category
        string priority "CRITICAL | HIGH | MEDIUM | LOW"
        decimal impact_score
        array embedding "768-Dim Float (Atlas Vector Search)"
        string status "UNREAD | VIEWED | APPLIED"
        date generated_at
    }
```
