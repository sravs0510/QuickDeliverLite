import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand fw-bold text-primary" to="/">
        QuickDeliver <span className="text-info">Lite</span>
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/track">Track Delivery</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/feedback">Feedback</Link></li>
          <li className="nav-item"><Link className="nav-link btn btn-outline-primary" to="/login">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
