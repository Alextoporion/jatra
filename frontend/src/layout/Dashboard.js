import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 flex">
      <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      {/* Content Area */}
      <main className="flex-1 pt-16 md:pt-20 md:pl-64 p-4 transition-all">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
