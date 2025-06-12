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
        const res = await axios.get('http://localhost:5000/api/delivery');
        // Filter for pending only and sort by latest timestamp
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
    <div className="container mt-5">
      <h3 className="text-center mb-4 text-primary">Pending Delivery Requests</h3>

      {requests.length === 0 ? (
        <p className="text-center">No pending requests available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Package Type</th>
                <th>Note</th>
                <th>Requested At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={index}>
                  <td>{req.pickupAddress}</td>
                  <td>{req.dropoffAddress}</td>
                  <td>{req.packageType}</td>
                  <td>{req.note || '-'}</td>
                  <td>{new Date(req.timestamp).toLocaleString()}</td>
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