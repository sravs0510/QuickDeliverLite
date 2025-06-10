import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SignUp.css'; // custom CSS file

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    code: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred during registration.");
    }
    setLoading(false);
  };

  return (
    <div className="register-container d-flex align-items-center justify-content-center">
      <div className="register-card p-4 shadow-sm animate-fade-in">
        <h3 className="text-center mb-3 gradient-text">
        <i className="bi bi-box-arrow-in-right me-2"></i>Create Your Account
        </h3>

        {message && (
          <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} fade show`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-floating mb-3">
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={step !== 1}
            />
            <label><i className="bi bi-person-fill me-2"></i>Full Name</label>
          </div>

          {/* Email */}
          <div className="form-floating mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={step !== 1}
            />
            <label><i className="bi bi-envelope-fill me-2"></i>Email address</label>
          </div>

          {/* Password */}
          <div className="form-floating mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={step !== 1}
            />
            <label><i className="bi bi-lock-fill me-2"></i>Password</label>
          </div>

          {/* Step 1: Send Code Button */}
          {step === 1 && (
            <div className="mb-3">
              <button type="button" className="btn btn-gradient w-100" onClick={sendCode} disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          )}

          {/* Step 2: Code + Role + Submit */}
          {step === 2 && (
            <>
              <div className="form-floating mb-3">
                <input
                  name="code"
                  type="text"
                  className="form-control"
                  placeholder="Enter code"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
                <label><i className="bi bi-shield-lock me-2"></i>Verification Code</label>
              </div>

              <div className="form-floating mb-4">
                <select
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="Customer">Customer</option>
                  <option value="Driver">Driver</option>
                </select>
                <label><i className="bi bi-person-badge-fill me-2"></i>Role</label>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-gradient" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/login" className="text-decoration-none fw-bold">Sign in</a>
        </p>
      </div>
    </div>
  );
}
