import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Finance from "./pages/Finance";
import Study from "./pages/Study";
import Habits from "./pages/Habits";
import Simulation from "./pages/Simulation";
import Assistant from "./pages/Assistant";

import "./styles/App.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;