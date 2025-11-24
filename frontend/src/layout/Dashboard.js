import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Right Side (TopBar + Content) */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content Area */}
        <main
          className={`flex-1 pt-16 md:pt-20 transition-all duration-300 min-w-0 ${
            isSidebarOpen ? "md:pl-64" : "md:pl-20"
          } p-4`}
        >
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
