import React from "react";
import { Home, BarChart2, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { FaIceCream } from "react-icons/fa";
import { SiPopos } from "react-icons/si";

const Sidebar = ({ isOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col w-64  bg-pink-100 text-stone-700 shadow-lg h-screen fixed top-14 left-0 transition-transform duration-300`}
      >
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <Link className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <Home size={18} /> Dashboard
          </Link>
          <Link to={'/admin/purchase-item'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <Users size={18} /> Purchase
          </Link>
          <Link to={'/admin/inventory'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <BarChart2 size={18} /> Inventory
          </Link>
          <Link to={'/admin/make-item'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <Settings size={18} /> Manufacturing
          </Link>
          <Link to={'/admin/ice-cream-stock'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <FaIceCream size={18} /> Ice Cream Stock
          </Link>
          <Link to={'/admin/pos'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <SiPopos size={18} /> POS
          </Link>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div
        className={`fixed md:hidden bottom-0 left-0 w-full  bg-pink-100 text-stone-700 border-t flex justify-around py-2 z-50 transition-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link className="flex flex-col items-center text-orange-500">
          <Home size={20} /> <span className="text-xs">Home</span>
        </Link>
        <Link className="flex flex-col items-center text-gray-700">
          <Users size={20} /> <span className="text-xs">Users</span>
        </Link>
        <Link className="flex flex-col items-center text-gray-700">
          <BarChart2 size={20} /> <span className="text-xs">Stats</span>
        </Link>
        <Link className="flex flex-col items-center text-gray-700">
          <Settings size={20} /> <span className="text-xs">Settings</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
