import React, { useState, useEffect } from 'react';

const MenuBar = () => {
  // State to track the scroll position
  const [scrolled, setScrolled] = useState(false);

  // Function to handle the scroll event
  const handleScroll = () => {
    const offset = window.scrollY;
    // We check if the scroll is greater than 100px
    if (offset > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // useEffect to attach and clean up the scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Define Tailwind CSS classes dynamically based on the 'scrolled' state
  const navbarClasses = `
     top-0 left-0 w-full z-50
    py-3 transition-all duration-300 ease-in-out
    ${scrolled ? 'bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'}
    // Note: Border added for subtle separation when background is white
  `;

  const linkClasses = `
    text-base font-medium mx-3 cursor-pointer
    text-gray-800 hover:text-indigo-600 // Text is always black/dark for readability
    transition-colors duration-300
  `;
  
  // Class for the brand name/logo
  const brandClasses = `
    text-2xl font-extrabold transition-colors duration-300
    ${scrolled ? 'text-indigo-600' : 'text-gray-800'} // Logo text remains dark for visibility
  `;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0">
            <span className={brandClasses}>
              🍨 Creamery
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            <a href="#home" className={linkClasses}>Home</a>
            <a href="#menu" className={linkClasses}>Menu</a>
            <a href="#specials" className={linkClasses}>Specials</a>
            <a href="#contact" className={linkClasses}>Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;