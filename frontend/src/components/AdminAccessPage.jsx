import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';

const AdminAccessPage = () => {
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('Verifying access...');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setStatus('❌ No token provided.');
      return;
    }

    axios.post('http://localhost:5000/api/admin/verify-token', { token })
      .then(res => {
        if (res.data.valid) {
          setVerified(true);
          setStatus('');
        } else {
          setStatus('❌ Invalid or expired token.');
        }
      })
      .catch(() => setStatus('❌ Error verifying token.'));
  }, []);

  if (!verified) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Admin Access</h2>
        <p>{status}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminDashboard/>
    </div>
  );
};

export default AdminAccessPage;