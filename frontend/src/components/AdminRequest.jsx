import React, { useState } from 'react';
import axios from 'axios';

const AdminRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();

    console.log("Sending admin email:", email); // Debug log

    try {
      const res = await axios.post('http://localhost:5000/api/admin/token-request', { email });
      setMessage('✅ Magic link sent to your email');
    } catch (err) {
      console.error('❌ Axios error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Error sending link');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Request Admin Access</h1>
      <form onSubmit={handleRequest} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Admin Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send Access Link
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-700">{message}</p>
    </div>
  );
};

export default AdminRequest;
