import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    alert("❌ You are not registered. Please contact admin or sign up using email & password.");
    console.log("Failed");
    navigate("/login");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleFailure;
