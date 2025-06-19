import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Clock, Phone, Package, CheckCircle, Truck, Navigation } from 'lucide-react';

const AcceptedDeliveries = ({ onStatusChange }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [driverEmail, setDriverEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");

    if (storedEmail && storedRole === "Driver") {
      setDriverEmail(storedEmail);

      axios
        .get(`http://localhost:5000/api/delivery/accepted?email=${storedEmail}`)
        .then((res) => setDeliveries(res.data))
        .catch((err) => console.error("Error fetching accepted deliveries:", err));
    }
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'accepted': return 'in_transit';
      case 'in_transit': return 'delivered';
      default: return currentStatus;
    }
  };

  const getNextStatusText = (currentStatus) => {
    switch (currentStatus) {
      case 'accepted': return 'Mark as In Transit';
      case 'in_transit': return 'Mark as Delivered';
      default: return 'Complete';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://localhost:5000/api/delivery/status/${id}`, { newStatus })
      .then((res) => {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
        );
      })
      .catch((err) => console.error("Failed to update status:", err));
  };


  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Accepted Deliveries</h3>
        <p className="text-gray-500">Accept deliveries from the pending tab to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Active Deliveries</h2>
        <p className="text-sm text-gray-600">{deliveries.length} active delivery{deliveries.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{delivery.driverName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{delivery.customerMobile}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                    {getStatusIcon(delivery.status)}
                    <span>{getStatusText(delivery.status)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                      <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Location</p>
                      <p className="text-sm text-gray-600">{delivery.dropoffAddress}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Package Type</span>
                    <span className="text-sm text-gray-600">{delivery.packageSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Priority</span>
                    <span className="text-sm text-gray-600">{delivery.priority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Delivery Date</span>
                    <span className="text-sm text-gray-600">{delivery.deliveryDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Delivery Time</span>
                    <span className="text-sm text-gray-600">{delivery.deliveryTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
                {delivery.status !== 'delivered' ? (
                  <button
                    onClick={() => handleStatusChange(delivery._id, getNextStatus(delivery.status))}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {getNextStatusText(delivery.status)}
                  </button>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-green-600 font-medium">
                    <CheckCircle className="h-5 w-5" />
                    <span>Delivery Complete</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedDeliveries;
