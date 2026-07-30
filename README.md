# 🤖 Digital Twin AI — Personal Life Simulation & Decision Assistant

An end-to-end full-stack personal life simulation system powered by **FastAPI**, **MongoDB Atlas**, and **React (Vite)**. The platform tracks personal finance, academic telemetry, daily biometric habits, and generates actionable AI twin recommendations.

---

## 📁 Repository Structure

```text
Digital-Twin-AI---Springboard/
├── backend_api/        ← FastAPI Python Backend Application Layer
│   ├── api/v1/         ← REST Endpoints (Auth, Profile, Finance, Study, Habits, Recommendations)
│   ├── core/           ← Settings, Database (Motor/Beanie), JWT Security, Exceptions
│   ├── models/         ← Beanie ODM Models (User, Finance, Study, Habit, etc.)
│   ├── schemas/        ← Pydantic Validation Schemas & DTOs
│   ├── services/       ← Business Logic & Analytical Aggregations
│   ├── main.py         ← FastAPI App Entry Point
│   └── requirements.txt
│
├── frontend/           ← React + Vite Single Page Application
│   ├── src/
│   │   ├── components/ ← Reusable UI Components (Navbar, Sidebar, Forms, Charts)
│   │   ├── context/    ← Auth Context & Global State Management
│   │   ├── pages/      ← Core Dashboard Pages (Home, Login, Signup, Profile, Finance, Study, Habits)
│   │   ├── services/   ← API Service Connectors (Axios with Auth Interceptors)
│   │   └── styles/     ← Modern Scoped CSS Stylesheets
│   ├── package.json
│   └── vite.config.js
│
└── backend/            ← Mongoose TypeScript Database Seeding & Maintenance Suite
    ├── database/       ← Schema Validators, Index Registries, Seeder Scripts, E2E Test Suite
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v20.x or higher
* **Python** v3.10 or higher
* **MongoDB Atlas** Cluster (or local MongoDB v7.0+)

---

### 1. Backend Setup (FastAPI)

1. Navigate to `backend_api/`:
   ```bash
   cd backend_api
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file inside `backend_api/`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   MONGODB_DB_NAME=digital_twin_ai_prod
   JWT_SECRET_KEY=your_secure_generated_key
   ```
4. Start the backend server:
   ```bash
   export PYTHONPATH=$(pwd)
   python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   * **Swagger API Documentation**: `http://localhost:8000/api/docs`

---

### 2. Frontend Setup (React + Vite)

1. In a new terminal window, navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   * **Web Application Interface**: `http://localhost:5173`

---

## ✨ Features & Architecture

* **🔐 Authentication & Security**: JWT-based bearer authentication with automatic token persistence and Axios request interceptors.
* **💰 Financial Tracking**: Income, expense, and savings goal management with real-time balance aggregations.
* **📚 Academic Analytics**: Study session logger, weekly hours visualization, and subject performance metrics.
* **🏃 Habit & Health Telemetry**: 4D biometric tracking (`sleep`, `exercise`, `water`, `screen_time`).
* **🤖 AI Twin Engine**: Unified user context aggregation and personalized decision recommendation feed.
* **💅 UI & UX**: Toast feedback (`react-toastify`), dynamic icons (`lucide-react`), and clean responsive layouts.

---

## 🧪 Database Maintenance Suite

Inside `backend/`, CLI tools are available for indexing and test verification:

| Command | Description |
| :--- | :--- |
| `npm run typecheck` | Validates TypeScript type safety across database schemas. |
| `npm run sync-indexes` | Synchronizes declarative ESR and unique indexes on Atlas. |
| `npm run seed` | Resets and seeds development telemetry data. |
| `npm run test:e2e` | Runs end-to-end database verification assertions. |
