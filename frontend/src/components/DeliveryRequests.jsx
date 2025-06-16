import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeliveryRequests = () => {
  const [requests, setRequests] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!userEmail || !userRole) {
      window.location.href = '/login';
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/delivery/customer/${userEmail}`);
        const pending = res.data
          .filter(req => req.status === 'Pending')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRequests(pending);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h3 className="text-center mb-6 text-blue-600 text-xl font-semibold">
        Pending Delivery Requests
      </h3>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests available.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow-sm">
          <table className="w-full border border-gray-300 table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 border">Pickup</th>
                <th className="px-4 py-2 border">Dropoff</th>
                <th className="px-4 py-2 border">Package Type</th>
                <th className="px-4 py-2 border">Note</th>
                <th className="px-4 py-2 border">Requested At</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-2 border">{req.pickupAddress}</td>
                  <td className="px-4 py-2 border">{req.dropoffAddress}</td>
                  <td className="px-4 py-2 border">{req.packageType}</td>
                  <td className="px-4 py-2 border">{req.note || '-'}</td>
                  <td className="px-4 py-2 border">
                    {new Date(req.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryRequests;
