import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          QuickDeliver <span className="text-cyan-500">Lite</span>
        </Link>

        
        {/* Navigation Links */}
        <div className="w-full md:w-auto mt-3 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-blue-600">
            Orders
          </Link>
          <Link to="/track" className="text-gray-700 hover:text-blue-600">
            Track Delivery
          </Link>
          <Link to="/feedback" className="text-gray-700 hover:text-blue-600">
            Feedback
          </Link>

          {token && (
            <Link
              to="/delivery-requests"
              className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1 rounded transition"
            >
              View Requests
            </Link>
          )}

          {!token ? (
            <Link
              to="/login"
              className="border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1 rounded transition"
            >
              Login
            </Link>
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
