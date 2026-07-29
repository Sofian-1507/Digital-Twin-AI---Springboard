# 🤖 Digital Twin AI — Personal Life Simulation & Decision Assistant


## 📁 Enterprise Folder Architecture

```
backend_api/ (NEW: Python FastAPI Layer)
├── main.py                     ← FastAPI application factory & router wiring
├── requirements.txt            ← Pinned dependencies (FastAPI, Motor, Beanie, Pydantic)
├── core/                       ← Settings, database lifecycle, security (JWT), exceptions
├── models/                     ← Beanie ODMs (Python ports of Mongoose schemas)
├── schemas/                    ← Pydantic DTOs for request/response validation
├── services/                   ← Business logic & aggregation pipelines
└── api/v1/                     ← 18 REST endpoints across Auth, Finance, Study, Habits

backend/ (Original Database Admin Toolkit)
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

### 3. Start the FastAPI Python Server
The live API backend is located in the `backend_api/` folder.
First, make sure you have added a JWT secret key to your `.env` file in the `backend_api/` folder:
```env
JWT_SECRET_KEY=your_secure_generated_key
```

Then, install dependencies and start the server:
```bash
cd ../backend_api
pip install -r requirements.txt
export PYTHONPATH=$(pwd)
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger UI Docs are available at: `http://localhost:8000/api/docs`

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




