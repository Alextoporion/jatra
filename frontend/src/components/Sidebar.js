import React from "react";
import { Home, BarChart2, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { FaIceCream } from "react-icons/fa";
import { SiPopos } from "react-icons/si";
import { FcSalesPerformance } from "react-icons/fc";

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
            <Settings size={18} /> Add New Ice Cream
          </Link>
          <Link to={'/admin/ice-cream-stock'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <FaIceCream size={18} /> Ice Cream Stock
          </Link>
          <Link to={'/admin/pos'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <SiPopos size={18} /> POS
          </Link>
          <Link to={'/admin/sales-history'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
            <FcSalesPerformance size={18} /> Sales History
          </Link>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      {/* Mobile Bottom Nav */}
      <div
        className={`fixed md:hidden bottom-0 left-0 w-full bg-pink-100 text-stone-700 
  border-t flex overflow-x-auto whitespace-nowrap py-2 z-50 transition-transform 
  ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <Link className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <Home size={18} /> Dashboard
        </Link>

        <Link to={"/admin/purchase-item"} className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <Users size={18} /> Purchase
        </Link>

        <Link to={"/admin/inventory"} className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <BarChart2 size={18} /> Inventory
        </Link>

        <Link to={"/admin/make-item"} className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <Settings size={18} /> Manufacturing
        </Link>

        <Link to={"/admin/ice-cream-stock"} className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <FaIceCream size={18} /> Ice Cream Stock
        </Link>

        <Link to={"/admin/pos"} className="flex flex-col items-center justify-center min-w-[70px] text-xs">
          <SiPopos size={18} /> POS
        </Link>
        <Link to={'/admin/sales-history'} className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg">
          <FcSalesPerformance size={18} /> Sales History
        </Link>
      </div>

    </>
  );
};

export default Sidebar;
