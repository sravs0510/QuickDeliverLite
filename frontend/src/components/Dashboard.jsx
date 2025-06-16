import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || "User";
  const userEmail = localStorage.getItem('userEmail');

  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [note, setNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [weight, setWeight] = useState('');
  const [packageType, setPackageType] = useState('Documents');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userEmail || role !== 'Customer') {
      navigate('/login');
    }
  }, [navigate, role, userEmail]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!/^\d{10}$/.test(mobileNumber)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const email = localStorage.getItem('userEmail');

    const deliveryRequest = {
      pickupAddress,
      dropoffAddress,
      note,
      deliveryDate,
      deliveryTime,
      weight,
      packageType,
      mobileNumber,
      status: "Pending",
      email,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:5000/api/delivery', deliveryRequest);
      if (response.status === 201) {
        setMessage("✅ Delivery request created successfully!");
        setPickupAddress('');
        setDropoffAddress('');
        setNote('');
        setDeliveryDate('');
        setDeliveryTime('');
        setWeight('');
        setPackageType('Documents');
        setMobileNumber('');
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create delivery request.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {role}!</h2>
      </div>

      {role === 'Customer' && (
        <div className="bg-white shadow-lg p-6 rounded-2xl max-w-2xl mx-auto">
          <h4 className="mb-4 text-blue-600 text-center text-lg font-semibold">Create a Delivery Request</h4>

          {message && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Pickup Address *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. 123 Main St, Hyderabad"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Dropoff Address *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. 456 Market Rd, Bangalore"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Note About Package</label>
              <textarea
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="3"
                placeholder="e.g. Fragile item, handle with care"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block font-medium mb-1">Mobile Number *</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            <div className="md:flex gap-4">
              <div className="md:w-1/2">
                <label className="block font-medium mb-1">Preferred Delivery Date *</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                />
              </div>

              <div className="md:w-1/2">
                <label className="block font-medium mb-1">Preferred Delivery Time *</label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="md:flex gap-4">
              <div className="md:w-1/2">
                <label className="block font-medium mb-1">Package Weight (kg)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  placeholder="e.g. 2.5"
                />
              </div>

              <div className="md:w-1/2">
                <label className="block font-medium mb-1">Package Type</label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                >
                  <option value="Documents">Documents</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full w-full transition"
            >
              Submit Delivery Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
