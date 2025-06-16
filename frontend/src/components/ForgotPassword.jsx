import React, { useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md animate-fade-in">
        <h3 className="text-center text-xl font-semibold text-gradient mb-6">
          <i className="bi bi-lock me-2"></i>Password Reset
        </h3>

        <form onSubmit={handleResetPassword}>
          <div className="relative mb-4">
            <input
              type="email"
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              <i className="bi bi-envelope-fill me-2"></i>Email address
            </label>
          </div>

          <div className="grid">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2 rounded-md hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              <i className="bi bi-envelope-arrow-up-fill me-2"></i>Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
