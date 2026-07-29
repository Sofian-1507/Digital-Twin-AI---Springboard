import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";

import Profile from "../pages/profile/Profile";

import Financial from "../pages/financial/Financial";

import Academic from "../pages/academic/Academic";

import Habits from "../pages/habits/Habits";

import Simulation from "../pages/simulation/Simulation";

import Recommendations from "../pages/recommendations/Recommendations";

import Reports from "../pages/reports/Reports";

import Settings from "../pages/profile/Settings";

function AppRoutes() {
  return (
    <Routes>

      {/* Authentication Pages */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Main Application Layout */}
      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/financial"
          element={<Financial />}
        />

        <Route
          path="/academic"
          element={<Academic />}
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
          path="/recommendations"
          element={<Recommendations />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

      {/* Default Route */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Invalid Route */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;