import React, { useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    code: ""
  });

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
    code: false
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({ ...prev, [field]: false }));
  };

  const shouldFloat = (field) => {
    return form[field] || focused[field];
  };

  const sendCode = async () => {
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in name, email, and password first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/send-code", {
        email: form.email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send verification code.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.code) return setMessage("Please enter the verification code.");
    if (!form.role) return setMessage("Please select a role.");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", password: "", role: "", code: "" });
      setStep(1);
      setFocused({ name: false, email: false, password: false, code: false });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred during registration.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-bg-move bg-[length:600%_600%]">
      <style jsx>{`
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bg-move {
          animation: bgMove 12s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          } to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .gradient-text {
          background: linear-gradient(90deg, #007bff, #00c6ff);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <h3 className="text-center mb-6 text-2xl font-bold gradient-text">
          <i className="bi bi-box-arrow-in-right mr-2"></i>Create Your Account
        </h3>

        {message && (
          <div className={`rounded-lg px-4 py-3 mb-4 text-center transition-opacity duration-300 ${
            message.includes("success") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative mb-4">
            <input
              name="name"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
              value={form.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              required
              disabled={step !== 1}
            />
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none
              ${shouldFloat('name') 
                ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                : 'top-3 text-gray-500'}`}>
              <i className="bi bi-person-fill mr-2"></i>Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              required
              disabled={step !== 1}
            />
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none
              ${shouldFloat('email') 
                ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                : 'top-3 text-gray-500'}`}>
              <i className="bi bi-envelope-fill mr-2"></i>Email address
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
              disabled={step !== 1}
            />
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none
              ${shouldFloat('password') 
                ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                : 'top-3 text-gray-500'}`}>
              <i className="bi bi-lock-fill mr-2"></i>Password
            </label>
          </div>

          {/* Step 1: Send Code Button */}
          {step === 1 && (
            <div className="mb-4">
              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md"
                onClick={sendCode}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                    Sending...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          )}

          {/* Step 2: Code + Role + Submit */}
          {step === 2 && (
            <>
              {/* Verification Code */}
              <div className="relative mb-4">
                <input
                  name="code"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
                  value={form.code}
                  onChange={handleChange}
                  onFocus={() => handleFocus('code')}
                  onBlur={() => handleBlur('code')}
                  required
                />
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none
                  ${shouldFloat('code') 
                    ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                    : 'top-3 text-gray-500'}`}>
                  <i className="bi bi-shield-lock mr-2"></i>Verification Code
                </label>
              </div>

              {/* Role */}
              <div className="relative mb-6">
                <select
                  name="role"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors appearance-none bg-white"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="Customer">Customer</option>
                  <option value="Driver">Driver</option>
                </select>
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none
                  ${form.role 
                    ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                    : 'top-3 text-gray-500'}`}>
                  <i className="bi bi-person-badge-fill mr-2"></i>Role
                </label>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <i className="bi bi-chevron-down text-gray-500"></i>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}