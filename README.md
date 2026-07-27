# 🤖 Digital Twin AI — Personal Life Simulation & Decision Assistant
### Enterprise MongoDB Atlas Database Layer & Mongoose Implementation

[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-M10%2B%20Dedicated-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com/)
[![Mongoose ODM](https://img.shields.io/badge/Mongoose%20ODM-v8.5%2B-880000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-text--embedding--004-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

An enterprise-grade, production-ready **MongoDB Atlas NoSQL Database Layer** designed for the **Digital Twin AI** platform. This system models a user's financial, academic, productivity, habit, lifestyle, and fitness behavior to drive predictive analytics, machine learning simulations, what-if scenario forecasting, and conversational Retrieval-Augmented Generation (RAG) recommendations.

---

## 🌟 Key Architectural Innovations

### 1. Zero-Hop Twin Context ($O(1)$ Read Complexity & The "Rule of 100")
In high-velocity AI platforms, porting 3NF relational SQL schemas causes severe performance degradation due to multi-collection `$lookup` joins. 
* **Aggregate Root Modeling:** We consolidated `user_profiles`, `preferences`, real-time `digital_twin_state`, and up to 30 `active_goals` directly inside the `users` root document.
* **Performance Impact:** Constructing a Google Gemini LLM context prompt or loading the user dashboard requires exactly **1 database read ($O(1)$ complexity)**.
* **Milestone Archival:** When a goal is completed or abandoned, `userRepository.archiveGoal()` atomically migrates it from the embedded array to an independent `goals` archive collection, preserving lifelong milestone history without bloating the root document.

### 2. Time-Series Ledger & ML Feature Stores
Unbounded telemetry streams are modeled as independent, referenced collections linked via `user_id` foreign keys with strict Equality-Sort-Range (ESR) compound indexing:
* **`financial_records`:** Immutable, append-only cash-flow ledger localized to Indian Rupees (₹ / INR). Feeds monthly net savings aggregation pipelines directly into Scikit-Learn **Random Forest** regression models.
* **`study_activities`:** Academic course telemetry logging attendance and hours. Features a Mongoose `pre('validate')` hook that automatically computes normalized percentage scores (`quiz_marks_pct`, `exam_marks_pct`) to maintain ML feature matrix stability.
* **`habit_tracking` (4D K-Means Feature Space):** Governed by a **Daily Unique Compound Index** on `(user_id, log_date)` with automatic midnight UTC normalization. This strictly enforces **1 biometric check-in per user per day**, preventing duplicate submissions from skewing K-Means burnout clustering centroids (`sleep_hours`, `exercise_minutes`, `water_intake_liters`, `screen_time_hours`).

### 3. Native Atlas Vector Search & RAG Integration
To support Retrieval-Augmented Generation without synchronizing data to an external vector database:
* **`recommendations` & `chat_history`:** Equipped with a custom-validated **768-dimensional float array (`embedding`)** matching Google Gemini's `text-embedding-004` output.
* **Network Bandwidth Optimization:** Vector fields are explicitly excluded from standard CRUD read queries via `select: false`.
* **Semantic Recall:** `AtlasVectorClient.searchSimilarRecommendations()` executes native `$vectorSearch` aggregation pipelines over Hierarchical Navigable Small World (HNSW) cosine similarity graphs.

### 4. Automated Cloud Storage Governance (Native TTL Indexes)
We eliminate manual DBA cron jobs and prevent unbounded storage growth by deploying engine-level Time-To-Live indexes:
* **`dashboard_cache` (`idx_cache_ttl_15m`):** Governed by a **15-Minute Automatic TTL Index** (`expireAfterSeconds: 900`), serving pre-computed UI dashboard widget payloads in $<5\text{ms}$.
* **`analytics_logs` (`idx_analytics_ttl_90d`):** Governed by a **90-Day Automatic TTL Index** (`expireAfterSeconds: 7776000`), silently expiring system error and diagnostic telemetry.

---

## 📁 Enterprise Folder Architecture

```
backend/
├── package.json                          ← Configured with Mongoose 8+, TypeScript 5+, and CLI maintenance scripts
├── tsconfig.json                         ← Strict ES2022 TypeScript compiler configuration
├── .env.example                          ← MongoDB Atlas connection URI and M10+ pooling template
├── src/
│   ├── config/env.ts                     ← Compatibility alias bridging environment imports
│   └── database/
│       ├── index.ts                      ← Compatibility alias re-exporting master DB package
│       └── repositories/                 ← Alias exports for UserRepository & FinancialRecordRepository
└── database/
    ├── index.ts                          ← Master package entry point exporting DB singletons & DAOs
    ├── config/
    │   ├── db_settings.ts                ← Type-safe environment variable loader (URI, Pool Size, Timeout)
    │   └── atlas_vector_indexes.json     ← HNSW vector index definitions for Atlas Admin API / UI deploy
    ├── connections/
    │   ├── atlas_pool.ts                 ← Singleton connection manager with Atlas pooling (10–100 conns)
    │   └── vector_client.ts              ← Native Atlas Vector Search helper client ($vectorSearch RAG)
    ├── schemas/
    │   ├── enums.ts                      ← Centralized TypeScript enums with ODM enum bindings
    │   ├── subdocuments/
    │   │   ├── user_preferences.ts       ← Embedded 1:1 preferences schema (INR currency default)
    │   │   ├── active_goal.ts            ← Embedded bounded active goal schema (hard-capped at 30 items)
    │   │   ├── digital_twin_state.ts     ← Embedded 1:1 real-time AI summary snapshot schema
    │   │   └── chat_turn.ts              ← Embedded message turn schema for chat_history threads
    │   ├── user_schema.ts                ← Core User aggregate root (embeds profiles, goals, twin state)
    │   ├── finance_schema.ts             ← FinancialRecord time-series ledger (immutable cash flow)
    │   ├── academic_schema.ts            ← StudyActivity telemetry log with pre-save percentage calculation
    │   ├── habit_schema.ts               ← HabitTracking 4D K-Means log (midnight UTC daily normalization)
    │   ├── simulation_schema.ts          ← Simulation What-If scenario archive (polymorphic mixed BSON)
    │   ├── recommendation_schema.ts      ← Recommendation AI advice feed (768-dim vector embedding)
    │   ├── chat_schema.ts                ← ChatHistory conversational thread (hard-capped at 100 turns)
    │   ├── report_schema.ts              ← Report generated PDF artifact metadata schema
    │   ├── analytics_schema.ts           ← AnalyticsLog telemetry sink with 90-Day Automatic TTL Index
    │   ├── cache_schema.ts               ← DashboardCache ephemeral UI payload with 15-Minute TTL Index
    │   └── goal_archive_schema.ts        ← GoalArchive historical target store (Phase 3 #7 resolution)
    ├── models/
    │   ├── index.ts                      ← Central barrel export preventing duplicate compilation crashes
    │   ├── User.ts                       ← Compiled ODM model for users collection
    │   ├── FinancialRecord.ts            ← Compiled ODM model for financial_records collection
    │   ├── StudyActivity.ts              ← Compiled ODM model for study_activities collection
    │   ├── HabitTracking.ts              ← Compiled ODM model for habit_tracking collection
    │   ├── Simulation.ts                 ← Compiled ODM model for simulations collection
    │   ├── Recommendation.ts             ← Compiled ODM model for recommendations collection
    │   ├── ChatHistory.ts                ← Compiled ODM model for chat_history collection
    │   ├── Report.ts                     ← Compiled ODM model for reports collection
    │   ├── AnalyticsLog.ts               ← Compiled ODM model for analytics_logs collection
    │   ├── DashboardCache.ts             ← Compiled ODM model for dashboard_cache collection
    │   └── GoalArchive.ts                ← Compiled ODM model for goals archive collection
    ├── validators/
    │   ├── schema_validators.ts          ← Reusable custom validators (ISO currency, 768-dim bounds)
    │   └── atlas_json_schemas/
    │       └── all_collections_json_schemas.json ← Server-side Atlas engine validation rules
    ├── indexes/
    │   ├── index_registry.ts             ← Central declarative registry of all ESR, TTL, and unique indexes
    │   └── sync_indexes.ts               ← Idempotent CLI migration script (Model.syncIndexes())
    ├── repositories/
    │   ├── base_repository.ts            ← Generic Repository Pattern abstract class (CRUD & pagination)
    │   ├── user_repository.ts            ← User DAO featuring getTwinContext() O(1) read & goal archival
    │   ├── finance_repository.ts         ← Financial DAO featuring monthly cashflow aggregation for ML
    │   ├── study_repository.ts           ← Academic DAO featuring 3D feature matrix extraction
    │   ├── habit_repository.ts           ← Habit DAO featuring 4D K-Means feature extraction & write-back
    │   ├── simulation_repository.ts      ← Simulation DAO managing immutable What-If history retrieval
    │   └── recommendation_repository.ts  ← Recommendation DAO managing Action Center sorting & RAG vectors
    ├── seed/
    │   ├── seed_data/
    │   │   ├── mock_users.json           ← Realistic mock Indian student profile (INR, active goals)
    │   │   ├── mock_finance.json         ← Stipend income, hostel rent, and savings deposit telemetry
    │   │   ├── mock_study.json           ← Algorithms and DBMS study telemetry with quiz/exam marks
    │   │   └── mock_habits.json          ← 4D biometric check-in snapshots
    │   └── seeder.ts                     ← Automated development database wipe and seeding CLI script
    ├── migrations/
    │   ├── 001_initial_setup.ts          ← Automated index deployment migration script
    │   └── 002_vector_search_guide.md    ← Step-by-step Atlas UI HNSW vector search setup guide
    ├── scripts/
    │   ├── e2e_test_suite.ts             ← End-to-End integration test suite (18 assertions, 100% pass rate)
    │   ├── db_backup.sh                  ← Executable mongodump backup automation script (gzip compressed)
    │   ├── db_restore.sh                 ← Executable mongorestore recovery script with drop protection
    │   └── verify_integrity.ts           ← Diagnostic script verifying 100% foreign key reference integrity
    └── docs/
        ├── architecture_diagrams.md      ← Complete Mermaid ER Data Model and Read/Write Matrix
        ├── indexing_strategy.md          ← ESR index directory and query optimization rationale
        └── ml_feature_mapping.md         ← Direct mapping of ODM fields to Random Forest/K-Means/RAG
```

---

## 🚀 Getting Started & Installation

### Prerequisites
* **Node.js** v20.x or higher
* **npm** v10.x or higher
* **MongoDB Atlas** Cluster (Shared M0, Dedicated M10+, or Local MongoDB v7.0+ instance)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sofian-1507/Digital-Twin-AI---Springboard.git
cd Digital-Twin-AI---Springboard/backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory by duplicating the example template:
```bash
cp .env.example .env
```
Edit `.env` and paste your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=digital_twin_ai_prod
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=10
NODE_ENV=development
```

---

## 🛠️ Command-Line Maintenance & Verification Suite

We have engineered an automated CLI toolkit to manage database lifecycle, indexing, verification, and seeding directly from the terminal inside `backend/`:

| Command | Script Executed | Description |
| :--- | :--- | :--- |
| **`npm run typecheck`** | `tsc --noEmit` | Validates 100% TypeScript type safety across all schemas and DAOs. |
| **`npm run build`** | `tsc` | Compiles TypeScript database layer into production JavaScript (`dist/`). |
| **`npm run sync-indexes`**| `ts-node database/indexes/sync_indexes.ts` | Connects to Atlas and idempotently synchronizes all 12 declarative ESR/TTL/Unique indexes. |
| **`npm run seed`** | `ts-node database/seed/seeder.ts` | Wipes development collections and populates mock Indian student telemetry datasets. |
| **`npm run verify-integrity`**| `ts-node database/scripts/verify_integrity.ts` | Scans all foreign keys across 9 collections to confirm 0 orphaned records exist. |
| **`npm run test:e2e`** | `ts-node database/scripts/e2e_test_suite.ts` | Executes the complete E2E integration test suite (18 assertions against live Atlas cluster). |
| **`./database/scripts/db_backup.sh`** | `mongodump` archive | Creates a timestamped, gzip-compressed backup of your active Atlas cluster. |

---

## 🧪 End-to-End Integration Test Suite

Run `npm run test:e2e` to execute our automated verification suite against your active MongoDB Atlas cluster. The suite tests:
1. **Connection Pooling:** Verifies Mongoose 8+ connection pool creation and clean shutdown hooks.
2. **Zero-Hop Reads ($O(1)$ Complexity):** Confirms that fetching a user profile, preferences, active goals, and AI twin state requires exactly **1 database read**.
3. **Atomic Goal Archival:** Completes a target goal and verifies that it is cleanly pulled from `users.active_goals` and inserted into `GoalArchive` without data loss.
4. **Random Forest Cashflow Pipelines:** Executes MongoDB aggregation pipelines (`$group` by month/type) extracting structured training matrices for savings regression.
5. **Academic Feature Extraction:** Verifies pre-save middleware hooks calculating normalized percentage marks (`quiz_marks_pct`, `exam_marks_pct`).
6. **K-Means 4D Biometric Vectors & Daily Uniqueness:** Confirms that the unique compound index `(user_id, log_date)` blocks duplicate daily check-ins and verifies continuous 4D feature vector extraction (`sleep`, `exercise`, `water`, `screen_time`).

---

## 🐍 Python / FastAPI & Machine Learning Compatibility

Because MongoDB is language-agnostic, this database layer interfaces seamlessly with Python/FastAPI backend architectures:
1. **Shared Database Pattern:** Your Python/FastAPI service connects to the same Atlas cluster (`digital_twin_ai_prod`) using **Motor** (async PyMongo) or **Beanie ODM**.
2. **Feature Consumption:** Python ML scripts call the MongoDB aggregation pipelines defined in our DAOs (or replicate the exact `$group` stages) to train Scikit-Learn **Random Forest** and **K-Means** models.
3. **Twin State Write-Back:** Background Python workers update the user's twin summary by writing computed metrics back to `users.digital_twin_state`.
4. **Engine-Level Safety:** Server-side JSON schema validation rules defined in [`all_collections_json_schemas.json`](file:///Users/sofian/Documents/Springboard/backend/database/validators/atlas_json_schemas/all_collections_json_schemas.json) guarantee that MongoDB Atlas will reject invalid data regardless of whether it originates from Node.js or Python.

---

## 📄 License & Architecture Reference
Designed and engineered by the **Senior MongoDB Atlas Database Architect & Solution Architect** for the Springboard Digital Twin AI Capstone Project.
For full architectural rationales, ER diagrams, and index explain plans, refer to the documentation in [`backend/database/docs/`](file:///Users/sofian/Documents/Springboard/backend/database/docs/architecture_diagrams.md).
