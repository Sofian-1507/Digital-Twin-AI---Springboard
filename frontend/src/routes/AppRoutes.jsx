import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Finance from "../pages/Finance";
import Study from "../pages/Study";
import Habits from "../pages/Habits";
import Simulation from "../pages/Simulation";
import Assistant from "../pages/Assistant";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "../utils/ProtectedRoute";

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
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/finance"
          element={<Finance />}
        />

        <Route
          path="/study"
          element={<Study />}
        />

        <Route
          path="/habits"
          element={<Habits />}
        />

        <Route
          path="/simulation"
          element={<Simulation />}
        />

        <Route
          path="/assistant"
          element={<Assistant />}
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