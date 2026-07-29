import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/App.css";

function MainLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-section">

        <Navbar />

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default MainLayout;