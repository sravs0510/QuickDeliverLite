import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MapPin, Clock, Phone, Package, AlertCircle, CheckCircle
} from 'lucide-react';

const PendingDeliveries = ({ onAcceptDelivery }) => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/delivery/pending');
        setDeliveries(res.data);
      } catch (err) {
        console.error('Error fetching pending deliveries:', err);
      }
    };

    fetchDeliveries();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'express':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standard':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4" />;
      case 'express':
        return <Clock className="h-4 w-4" />;
      case 'standard':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Deliveries</h3>
        <p className="text-gray-500">All deliveries have been accepted. Check back later for new orders!</p>
      </div>
    );
  }
  const handleAcceptDelivery = async (deliveryId) => {
    const driverEmail = localStorage.getItem("userEmail");
    try {
      await axios.put(`http://localhost:5000/api/delivery/accept/${deliveryId}`, {
        driverEmail,
      });
  
      // Remove accepted delivery from list
      setDeliveries(prev => prev.filter(d => d._id !== deliveryId));
    } catch (err) {
      console.error("Accept delivery error:", err);
      alert("Failed to accept delivery.");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Available Deliveries</h2>
        <p className="text-sm text-gray-600">{deliveries.length} delivery{deliveries.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className="grid gap-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{delivery.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{delivery.mobile || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(delivery.priority)}`}>
                  {getPriorityIcon(delivery.priority)}
                  <span>{delivery.priority} Priority</span>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                      <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dropoff Location</p>
                      <p className="text-sm text-gray-600">{delivery.dropoffAddress}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Package Description</span>
                    <span className="text-sm text-gray-600">{delivery.packageNote}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Date</span>
                    <span className="text-sm text-gray-600">{delivery.deliveryDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Time</span>
                    <span className="text-sm text-gray-600">{delivery.deliveryTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Size</span>
                    <span className="text-sm text-gray-600">{delivery.packageSize}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleAcceptDelivery(delivery._id)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Accept Delivery
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingDeliveries;
