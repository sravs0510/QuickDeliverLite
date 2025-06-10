import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log("Token from URL:", token); // ✅ Debug log

    

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { email, role } = decoded;

        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);

        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to decode token:", err);
        alert("Login failed");
        navigate("/signin");
      }
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;
