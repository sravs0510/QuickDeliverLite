import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      alert("A password reset link has been sent to your email.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="signin-container d-flex align-items-center justify-content-center">
      <div className="signin-card p-4 shadow-sm animate-fade-in">
        <h3 className="text-center mb-4 gradient-text">
          <i className="bi bi-lock me-2"></i>Password Reset
        </h3>

        <form onSubmit={handleResetPassword}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label><i className="bi bi-envelope-fill me-2"></i>Email address</label>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-gradient">
              <i className="bi bi-envelope-arrow-up-fill me-2"></i>Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
