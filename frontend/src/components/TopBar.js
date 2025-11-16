import React from "react";
import { Menu, Bell, User } from "lucide-react";

const TopBar = ({ toggleSidebar }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg flex items-center justify-between px-4 z-50">
      {/* Sidebar toggle (mobile only) */}
      <button onClick={toggleSidebar} className="md:hidden">
        <Menu size={24} />
      </button>

      {/* Logo */}
      <h1 className="text-xl font-bold tracking-wide">🍦 Jilapi Admin</h1>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer hover:text-rose-100" />
        <User className="cursor-pointer hover:text-rose-100" />
      </div>
    </div>
  );
};

export default TopBar;
