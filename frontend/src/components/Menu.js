import React, { useState, useEffect, useContext } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import UseAuth from "../hook/UseAuth";
import { AuthContext } from "../authprovider/AuthProvider";
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { logOutUser, isAuthenticated, user } = useContext(AuthContext);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logOutUser();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <h2 className="text-xl font-bold text-orange-500">Jilapi</h2>

        {/* Center: Menu */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium mx-auto absolute left-1/2 -translate-x-1/2">
         <Link to={'/'}> <li className="hover:text-orange-500 cursor-pointer" >Home</li></Link>
          <li className="hover:text-orange-500 cursor-pointer">About</li>
          <li className="hover:text-orange-500 cursor-pointer">Items</li>
          <li className="hover:text-orange-500 cursor-pointer">Contact</li>
        </ul>

        {/* Right: Avatar / Sign In */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
            >
              Logout
            </button>
          ) : (
           <Link to={'/login'}>
            <button className="hidden md:block bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
              Sign In
            </button></Link>
          )}

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="md:hidden flex flex-col bg-white border-t text-gray-700 font-medium">
          <li className="px-4 py-2 hover:bg-orange-100">Home</li>
          <li className="px-4 py-2 hover:bg-orange-100">About</li>
          <li className="px-4 py-2 hover:bg-orange-100">Items</li>
          <li className="px-4 py-2 hover:bg-orange-100">Contact</li>

          {isAuthenticated ? (
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-orange-100 text-orange-500 font-semibold"
            >
              Logout
            </li>
          ) : (
            <Link to={'/login'}>
              <li className="px-4 py-2 hover:bg-orange-100 text-orange-500 font-semibold">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      )}
    </div>
  );
};

export default Menu;
