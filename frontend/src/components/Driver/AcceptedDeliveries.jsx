
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MapPin,
  Clock,
  Phone,
  Package,
  CheckCircle,
  Truck,
  Navigation,
  MessageCircleHeart
} from 'lucide-react';

const AcceptedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [driverEmail, setDriverEmail] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");

  useEffect(() => {
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

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "delivered") {
      try {
        await axios.post("http://localhost:5000/api/otp/send-otp", { deliveryId: id });
        setSelectedDeliveryId(id);
        setShowOtpPopup(true);
      } catch (error) {
        console.error("Failed to send OTP:", error);
      }
    } else {
      axios
        .put(`http://localhost:5000/api/delivery/status/${id}`, { newStatus })
        .then(() => {
          setDeliveries((prev) =>
            prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
          );
        })
        .catch((err) => console.error("Failed to update status:", err));
    }
  };

  const verifyOtpAndMarkDelivered = () => {
    axios
      .post("http://localhost:5000/api/otp/verify-otp", {
        deliveryId: selectedDeliveryId,
        enteredOtp,
      })
      .then((res) => {
        setDeliveries((prev) =>
          prev.map((d) =>
            d._id === selectedDeliveryId ? { ...d, status: "delivered" } : d
          )
        );
        setShowOtpPopup(false);
        setEnteredOtp("");
      })
      .catch((err) => {
        alert("Invalid OTP or error. Try again.");
        console.error("OTP verification failed:", err);
      });
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Active Deliveries</h2>
          <p className="text-sm text-gray-600">{deliveries.length} active delivery{deliveries.length !== 1 ? 'ies' : ''}</p>
        </div>

        <div className="grid gap-6">
          {deliveries.map((delivery) => (
            <div key={delivery._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{delivery.email}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{delivery.customerMobile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      <span>{getStatusText(delivery.status)}</span>
                    </div>

                    {delivery.feedbackGiven && (
                      <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                        <MessageCircleHeart className="h-4 w-4" />
                        <span>Feedback</span>
                      </div>
                    )}
                  </div>
                </div>

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
                </div>

                <div className="flex justify-end mt-6">
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

      {/* OTP Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Enter OTP for Delivery Confirmation</h2>
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded text-sm"
              placeholder="Enter 6-digit OTP"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowOtpPopup(false);
                  setEnteredOtp("");
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => verifyOtpAndMarkDelivered()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcceptedDeliveries;