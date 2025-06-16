import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import GoogleSuccess from './components/GoogleSuccess';
import GoogleFailure from './components/GoogleFailure';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DeliveryRequests from './components/DeliveryRequests';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/google-failure" element={<GoogleFailure />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/delivery-requests" element={<DeliveryRequests />} /> {/* 🆕 added */}
      </Routes>
    </Router>
  );
};

export default App;
