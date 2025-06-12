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

    const email = localStorage.getItem('userEmail'); // moved inside function

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
      email, // now always included
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
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Welcome, {role}!</h2>
      </div>

      {role === 'Customer' && (
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "650px", borderRadius: "20px" }}>
          <h4 className="mb-4 text-primary text-center">Create a Delivery Request</h4>

          {message && <div className="alert alert-info text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Pickup Address *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 123 Main St, Hyderabad"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group mb-3">
              <label>Dropoff Address *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 456 Market Rd, Bangalore"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Note About Package</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Fragile item, handle with care"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group mb-3">
              <label>Mobile Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Preferred Delivery Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Preferred Delivery Time *</label>
                <input
                  type="time"
                  className="form-control"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Package Weight (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  placeholder="e.g. 2.5"
                />
              </div>
              <div className="col-md-6 mb-4">
                <label>Package Type</label>
                <select
                  className="form-select"
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

            <button type="submit" className="btn btn-success w-100 rounded-pill">
              Submit Delivery Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;