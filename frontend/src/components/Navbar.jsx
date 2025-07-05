import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaTruck } from 'react-icons/fa'; 

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  // List of routes where Navbar should be shown
  const visibleRoutes = ['/', '/login', '/signup'];

  // If current path is not in the list, hide Navbar
  if (!visibleRoutes.includes(location.pathname)) {
    return null;
  }

  // Scroll to section on the homepage
  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Check if current route is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="bg-gray-100 shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
       
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <FaTruck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QuickDeliverLite</h1>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="w-full md:w-auto mt-3 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          
          {/* Show section links only on homepage */}
          {location.pathname === '/' && (
            <>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                Features
              </button>
              
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                How It Works
              </button>
              
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                Testimonials
              </button>
            </>
          )}

          {/* Login/Logout Button */}
          {!token ? (
            <>
              {isAuthPage ? (
                location.pathname === '/login' ? (
                  <Link
                    to="/signup"
                    className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1 rounded transition"
                  >
                    Register
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1 rounded transition"
                  >
                    Login
                  </Link>
                )
              ) : (
                <>
                  <Link
                    to="/login"
                    className="border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1 rounded transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1 rounded transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;