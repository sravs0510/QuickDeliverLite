import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <Link className="navbar-brand fw-bold text-primary" to="/">
        QuickDeliver <span className="text-info">Lite</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/orders">Orders</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/track">Track Delivery</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/feedback">Feedback</Link>
          </li>

          {/* Show View Requests if logged in */}
          {token && (
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-success ms-2" to="/delivery-requests">
                View Requests
              </Link>
            </li>
          )}

          {/* Auth Button */}
          {!token ? (
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-primary ms-2" to="/login">Login</Link>
            </li>
          ) : (
            <li className="nav-item">
              <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;