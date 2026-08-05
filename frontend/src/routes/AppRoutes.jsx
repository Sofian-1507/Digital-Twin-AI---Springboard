import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "../utils/ProtectedRoute";

// Protected pages are code-split — they're only ever needed after login,
// so there's no reason to bundle them into the initial (public) page load.
const Dashboard  = lazy(() => import("../pages/Dashboard"));
const Profile    = lazy(() => import("../pages/Profile"));
const Finance    = lazy(() => import("../pages/Finance"));
const Study      = lazy(() => import("../pages/Study"));
const Habits     = lazy(() => import("../pages/Habits"));
const Simulation = lazy(() => import("../pages/Simulation"));
const Assistant  = lazy(() => import("../pages/Assistant"));
const Activity   = lazy(() => import("../pages/Activity"));

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Protected Routes */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Dashboard />
            </Suspense>
          }
        />

        <Route
          path="/profile"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Profile />
            </Suspense>
          }
        />

        <Route
          path="/finance"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Finance />
            </Suspense>
          }
        />

        <Route
          path="/study"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Study />
            </Suspense>
          }
        />

        <Route
          path="/habits"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Habits />
            </Suspense>
          }
        />

        <Route
          path="/simulation"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Simulation />
            </Suspense>
          }
        />

        <Route
          path="/assistant"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Assistant />
            </Suspense>
          }
        />

        <Route
          path="/activity"
          element={
            <Suspense fallback={<h2>Loading...</h2>}>
              <Activity />
            </Suspense>
          }
        />

      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;
