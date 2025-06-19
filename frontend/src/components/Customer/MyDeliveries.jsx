import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, Calendar } from 'lucide-react';

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');

        if (!userEmail || !token) {
          alert("User not logged in.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/delivery/customer/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        alert("Failed to load deliveries.");
      }
    };

    fetchDeliveries();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <Package className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this delivery?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/delivery/cancel/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the deliveries list after cancellation
      setDeliveries(prev =>
        prev.map(del => del._id === id ? { ...del, status: 'cancelled' } : del)
      );
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel delivery');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Deliveries</h2>
        <p className="text-gray-600">Track and manage all your delivery requests</p>
      </div>

      <div className="space-y-6">
        {deliveries.length === 0 ? (
          <p className="text-gray-600">No deliveries found.</p>
        ) : (
          deliveries.map((delivery, index) => (
            <div key={delivery._id || index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">#{delivery._id}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(delivery.status)}`}>
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{delivery.deliveryDate}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup</p>
                      <p className="text-gray-600 text-sm">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Dropoff</p>
                      <p className="text-gray-600 text-sm">{delivery.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Package</p>
                      <p className="text-gray-600 text-sm">{delivery.packageNote}</p>
                    </div>
                  </div>

                  {delivery.driverName && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Driver</p>
                        <p className="text-gray-600 text-sm">{delivery.driverName}</p>
                        <p className="text-gray-500 text-xs">{delivery.driverPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {delivery.status === 'in-transit' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Estimated Delivery: {delivery.estimatedDelivery || 'N/A'}</p>
                  <p className="text-blue-600 text-sm">Your package is on the way!</p>
                </div>
              )}

              {delivery.status === 'delivered' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">Delivered at: {delivery.deliveredAt || 'N/A'}</p>
                  <p className="text-green-600 text-sm">Package delivered successfully!</p>
                </div>
              )}

              {delivery.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">Scheduled for: {delivery.deliveryTime}</p>
                  <p className="text-yellow-600 text-sm">We'll notify you when pickup starts.</p>
                </div>
              )}

              {delivery.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Cancelled</p>
                  <p className="text-red-600 text-sm">Please contact support for assistance.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                {delivery.status === 'in-transit' && (
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                    Track Live
                  </button>
                )}
                {delivery.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(delivery._id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}

                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyDeliveries;
