import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <div className="ml-64 min-h-screen">

        <Navbar />

        <main className="w-full p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default MainLayout;