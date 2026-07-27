# Digital Twin AI — Machine Learning & AI Feature Store Mapping

This document maps Mongoose database collection fields directly to Python/Node.js Machine Learning feature matrices and Retrieval-Augmented Generation (RAG) vector embeddings.

---

## 1. Random Forest Regressor (Financial Savings & Academic Mark Prediction)

### Financial Savings Prediction Pipeline
* **Input Collection**: `financial_records`
* **Aggregation Method**: `financialRecordRepository.getMonthlyCashflowPipeline(userId)`
* **Feature Columns**:
  * `total_income` (Sum of `amount` where `type === 'INCOME'`)
  * `total_expense` (Sum of `amount` where `type === 'EXPENSE'`)
  * `housing_ratio` (`HOUSING` expense / `total_income`)
* **Target Label**: Next Month Savings (`total_income - total_expense`)

### Academic Mark Prediction Pipeline
* **Input Collection**: `study_activities`
* **Aggregation Method**: `studyActivityRepository.extractRandomForestFeatureMatrix(userId)`
* **Feature Columns**:
  * `study_hours` (Continuous float)
  * `attendance_pct` (Continuous float 0–100%)
  * `quiz_marks_pct` (Normalized pre-save float 0–100%)
* **Target Label**: `exam_marks_pct` (Final exam percentage)

---

## 2. K-Means Burnout Clustering (4D Biometric Feature Space)

* **Input Collection**: `habit_tracking`
* **Aggregation Method**: `habitTrackingRepository.extractKMeansFeatureSpace(userId, 30)`
* **4D Feature Vector per Daily Row**:
  1. `sleep_hours` (0.0–24.0)
  2. `exercise_minutes` (0–1440)
  3. `water_intake_liters` (0.0–20.0)
  4. `screen_time_hours` (0.0–24.0)
* **Write-Back Target**: `habitTracking.burnout_risk_cluster` (`LOW_RISK` | `MODERATE_RISK` | `HIGH_RISK` | `CRITICAL_BURNOUT`)

---

## 3. Native Atlas Vector Search (RAG Semantic Advice Recall)

* **Input Collection**: `recommendations` & `chat_history`
* **Embedding Model**: Google Gemini `text-embedding-004` (Exactly 768 Float Dimensions)
* **Similarity Metric**: Cosine Similarity via HNSW Graph Index (`$vectorSearch`)
* **Network Optimization**: Field `embedding` is excluded from standard CRUD projections via `select: false`.
