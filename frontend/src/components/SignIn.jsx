import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("password");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);

      alert(`Logged in successfully as ${user.role}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email");

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      alert("OTP sent to email");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email || !otp) return alert("Enter both email and OTP");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);

      alert(`Logged in via OTP as ${user.role}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="signin-container d-flex align-items-center justify-content-center">
      <div className="signin-card p-4 shadow-sm animate-fade-in">
        <h3 className="text-center mb-4 gradient-text">
          <i className="bi bi-box-arrow-in-right me-2"></i>Sign in to your account
        </h3>

        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn btn-outline-primary me-2 ${mode === "password" ? "active" : ""}`}
            onClick={() => {
              setMode("password");
            }}
          >
            <i className="bi bi-shield-lock-fill me-1"></i> Password
          </button>
          <button
            className={`btn btn-outline-secondary ${mode === "otp" ? "active" : ""}`}
            onClick={() => {
              setMode("otp");
            }}
          >
            <i className="bi bi-envelope-open-fill me-1"></i> OTP
          </button>
        </div>

        <form onSubmit={mode === "password" ? handlePasswordLogin : handleVerifyOtp}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label><i className="bi bi-envelope-fill me-2"></i>Email</label>
          </div>

          {mode === "password" && (
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label><i className="bi bi-lock-fill me-2"></i>Password</label>
            </div>
          )}

          {mode === "otp" && (
            <>
              {!otpSent ? (
                <div className="d-grid mb-3">
                  <button type="button" className="btn btn-gradient" onClick={handleSendOtp}>
                    <i className="bi bi-send-check-fill me-2"></i>Send OTP
                  </button>
                </div>
              ) : (
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <label><i className="bi bi-key-fill me-2"></i>Enter OTP</label>
                </div>
              )}
            </>
          )}

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-gradient">
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </button>
          </div>

          {/* Forgot Password Option */}
          {mode === "password" && (
            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

            </div>
          )}

          <div className="d-grid mb-3">
            <button type="button" className="btn btn-light border" onClick={handleGoogleLogin}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                style={{ width: "20px", marginRight: "10px" }}
              />
              Login with Google
            </button>
          </div>

          <p className="text-center mt-3 text-muted">
            Don’t have an account? <a href="/signup" className="text-decoration-none fw-bold">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
