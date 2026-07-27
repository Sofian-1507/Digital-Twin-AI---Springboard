# Digital Twin AI — ESR Indexing Strategy & Query Optimization

This document outlines the Equality-Sort-Range (ESR) rules applied across our MongoDB Atlas schemas to guarantee sub-10ms query performance.

---

## The ESR Rule Explained

MongoDB compound indexes must be ordered sequentially by:
1. **[E] Equality**: Fields matched using exact assertions (e.g., `user_id: "..."`, `status: "UNREAD"`).
2. **[S] Sort**: Fields determining output order (e.g., `transaction_date: -1`, `priority: 1`).
3. **[R] Range**: Fields filtered via bounds (e.g., `amount: { $gte: 5000 }`, `target_date: { $lte: now }`).

---

## Index Directory

| Collection | Index Name | Compound Key Structure | ESR Rationale / Purpose |
| :--- | :--- | :--- | :--- |
| **`users`** | `email_1` | `{ email: 1 }` (Unique) | Equality lookup for authentication ($O(1)$). |
| **`users`** | `idx_users_goal_deadline` | `{ 'active_goals.category': 1, 'active_goals.target_date': 1 }` | [E]: Category, [S/R]: Target date deadline for notification engine. |
| **`financial_records`** | `idx_finance_user_date` | `{ user_id: 1, transaction_date: -1 }` | [E]: User ID, [S]: Descending date for ledger pagination. |
| **`study_activities`** | `idx_study_user_subj_date` | `{ user_id: 1, subject: 1, session_date: -1 }` | [E]: User + Subject, [S]: Session date for mark trend regression. |
| **`habit_tracking`** | `idx_habit_user_date_unique`| `{ user_id: 1, log_date: 1 }` (Unique) | **CRITICAL**: Strictly enforces 1 check-in per user per calendar day. |
| **`recommendations`** | `idx_rec_action_center` | `{ user_id: 1, status: 1, priority: 1, generated_at: -1 }` | [E]: User + Status, [S]: Priority + Date for Action Center sorting. |
| **`dashboard_cache`**| `idx_cache_ttl_15m` | `{ generated_at: 1 }` (TTL: 900s) | Automatic engine-level background purging after 15 minutes. |
| **`analytics_logs`** | `idx_analytics_ttl_90d` | `{ timestamp: 1 }` (TTL: 7776000s) | Automatic engine-level background purging after 90 days. |
