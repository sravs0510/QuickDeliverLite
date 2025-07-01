import React, { useState, useEffect } from 'react';
import { Truck, Clock, User } from 'lucide-react';
import PendingDeliveries from './PendingDeliveries';
import AcceptedDeliveries from './AcceptedDeliveries';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/getUserByEmail', {
          params: { email: userEmail }
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error('Error fetching user name:', err);
      }
    };
    fetchUserName();
  }, [userEmail]);

  // Fetch delivery counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/delivery/counts', {
          params: { email: userEmail }
        });
        setPendingCount(res.data.pending);
        setAcceptedCount(res.data.accepted);
      } catch (err) {
        console.error('Error fetching counts', err);
      }
    };
    fetchCounts();
  }, [userEmail]);

  const handleAcceptDelivery = (deliveryId) => {
    const delivery = pendingDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      const acceptedDelivery = {
        ...delivery,
        status: 'accepted',
        acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAcceptedDeliveries(prev => [...prev, acceptedDelivery]);
      setPendingDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    }
  };

  const handleStatusChange = (deliveryId, newStatus) => {
    setAcceptedDeliveries(prev =>
      prev.map(delivery =>
        delivery.id === deliveryId
          ? { ...delivery, status: newStatus }
          : delivery
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QuickDeliverLite</h1>
                <p className="text-sm text-gray-600">Driver Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(prev => !prev)}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold text-lg shadow-md"
                  >
                    {userName?.charAt(0).toUpperCase()}
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <button
                        onClick={() => navigate("/view-profile")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = '/';
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white w-64">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Pending Deliveries</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white w-64">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Accepted Deliveries</p>
                  <p className="text-2xl font-bold">{acceptedCount}</p>
                </div>
                <Truck className="h-8 w-8 text-green-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Deliveries ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'accepted'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Accepted Deliveries ({acceptedCount})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <PendingDeliveries
                deliveries={pendingDeliveries}
                onAcceptDelivery={handleAcceptDelivery}
              />
            )}
            {activeTab === 'accepted' && (
              <AcceptedDeliveries
                deliveries={acceptedDeliveries}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
