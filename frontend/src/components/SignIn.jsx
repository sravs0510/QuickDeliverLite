import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogIn,
  Shield,
  MailOpen,
  Lock,
  Key,
  Send,
  ArrowRight,
  Eye,
  UserPlus,
} from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [focused, setFocused] = useState({
    email: false,
    password: false,
    otp: false
  });
  const navigate = useNavigate();

  // Check if label should float
  const shouldFloat = (field) => {
    return (
      (field === "email" && (email || focused.email)) ||
      (field === "password" && (password || focused.password)) ||
      (field === "otp" && (otp || focused.otp))
    );
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);

      alert(`Logged in successfully as ${user.role}`);
      if(user.role==='Customer')
      {      
        navigate("/dashboard");
      }
      else
      {
        navigate("/driver-dashboard");
      }
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
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);

      alert(`Logged in via OTP as ${user.role}`);
      if(user.role==='Customer')
        {      
          navigate("/dashboard");
        }
        else
        {
          navigate("/driver-dashboard");
        }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="min-h-screen animate-bgMove flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow hover:scale-105 hover:shadow-lg transition-transform animate-fade-in">
        <h3 className="text-center mb-6 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent font-bold text-xl flex justify-center items-center gap-2">
          <LogIn className="w-5 h-5" />
          Sign in to your account
        </h3>

        <div className="flex justify-center mb-4 space-x-2">
          <button
            className={`px-4 py-2 border rounded flex items-center gap-1 ${
              mode === "password"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-gray-400"
            }`}
            onClick={() => setMode("password")}
          >
            <Shield className="w-4 h-4" /> Password
          </button>
          <button
            className={`px-4 py-2 border rounded flex items-center gap-1 ${
              mode === "otp"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-gray-400"
            }`}
            onClick={() => setMode("otp")}
          >
            <MailOpen className="w-4 h-4" /> OTP
          </button>
        </div>

        <form
          onSubmit={mode === "password" ? handlePasswordLogin : handleVerifyOtp}
          className="space-y-4"
        >
          {/* Email Field */}
          <div className="relative mb-4">
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(f => ({...f, email: true}))}
              onBlur={() => setFocused(f => ({...f, email: false}))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
            />
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none
              ${shouldFloat("email") 
                ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                : 'top-3 text-gray-500'}`}
            >
              <MailOpen className="inline w-4 h-4 mr-1" />
              Email
            </label>
          </div>

          {mode === "password" && (
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused(f => ({...f, password: true}))}
                onBlur={() => setFocused(f => ({...f, password: false}))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none
                ${shouldFloat("password") 
                  ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                  : 'top-3 text-gray-500'}`}
              >
                <Lock className="inline w-4 h-4 mr-1" />
                Password
              </label>
            </div>
          )}

          {mode === "otp" && (
            <>
              {!otpSent ? (
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-2 rounded transition flex items-center justify-center gap-2"
                  onClick={handleSendOtp}
                >
                  <Send className="w-4 h-4" />
                  Send OTP
                </button>
              ) : (
                <div className="relative">
                  <input
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onFocus={() => setFocused(f => ({...f, otp: true}))}
                    onBlur={() => setFocused(f => ({...f, otp: false}))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
                  />
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none
                    ${shouldFloat("otp") 
                      ? '-top-2 text-xs bg-white px-1 text-blue-500' 
                      : 'top-3 text-gray-500'}`}
                  >
                    <Key className="inline w-4 h-4 mr-1" />
                    Enter OTP
                  </label>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-2 rounded transition flex justify-center items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" /> Login
          </button>

          {mode === "password" && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-blue-600 text-sm"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="button"
            className="w-full border border-gray-300 rounded py-2 mt-2 flex items-center justify-center gap-2 hover:bg-gray-100"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Login with Google
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}