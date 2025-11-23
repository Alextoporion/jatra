import React, { useState, useEffect, useContext } from "react";
import { Menu as MenuIcon, X, LogOut, IceCream } from "lucide-react";
import { AuthContext } from "../authprovider/AuthProvider";
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Consume your existing AuthContext
  const { logOutUser, isAuthenticated } = useContext(AuthContext);

  // Smart Scroll Behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false); // Hide on scroll down
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logOutUser();
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Items", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Inject Fonts locally for this component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Quicksand:wght@500;700&display=swap');
        .font-funky { font-family: 'Fredoka', sans-serif; }
        .font-body { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* --- FLOATING NAVBAR (Desktop & Mobile Header) --- */}
      <div
        className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
        }`}
      >
        <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl shadow-orange-500/10 rounded-full pl-6 pr-2 py-2 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-100 p-1.5 rounded-full group-hover:rotate-12 transition-transform duration-300">
                <IceCream className="text-orange-500 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-funky font-bold text-gray-800 tracking-wide group-hover:text-orange-500 transition-colors">
              Jilapi<span className="text-orange-500">.</span>
            </h2>
          </Link>

          {/* Desktop Links (Hidden on Mobile) */}
          <ul className="hidden md:flex items-center gap-1 bg-gray-100/50 rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="px-5 py-2 rounded-full text-sm font-body font-bold text-gray-600 hover:bg-white hover:text-orange-500 hover:shadow-sm transition-all duration-300 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Auth & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-body font-bold text-sm hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all"
              >
                Logout
                <LogOut size={16} />
              </button>
            ) : (
              <Link to="/login">
                <button className="hidden md:block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2.5 rounded-full font-body font-bold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 transition-all">
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-700 hover:text-orange-500 active:bg-orange-50 transition-colors"
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE FULLSCREEN OVERLAY (App-like feel) --- */}
      <div
        className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:bg-red-50 hover:text-red-500 hover:rotate-90 transition-all duration-300"
        >
          <X size={24} />
        </button>

        {/* Mobile Content */}
        <div className="h-full flex flex-col items-center justify-center space-y-6">
          <div className="text-center mb-8">
             <h2 className="text-4xl font-funky font-bold text-gray-900">
              Jilapi<span className="text-orange-500">.</span>
            </h2>
             <p className="text-gray-400 font-body text-sm mt-2">Sweet moments await</p>
          </div>

          <ul className="flex flex-col items-center gap-4 w-full px-10">
            {navLinks.map((link, idx) => (
              <li key={link.name} 
                  className="w-full text-center"
                  style={{ 
                    transition: 'all 0.5s ease', 
                    transitionDelay: `${idx * 100}ms`,
                    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isOpen ? 1 : 0
                  }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-2xl font-funky text-gray-800 hover:text-orange-500 py-3 hover:bg-orange-50 rounded-2xl transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Button */}
          <div 
            className="mt-8"
            style={{ 
                transition: 'all 0.7s ease 0.3s',
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0
            }}
          >
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-transform"
              >
                Logout <LogOut size={18} />
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-10 py-3 rounded-full font-bold text-lg shadow-xl shadow-orange-500/30 active:scale-95 transition-transform">
                  Sign In Now
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;