import React, { useState, useEffect } from 'react';
import { Package, Truck, MessageSquare, MapPin, User } from 'lucide-react';
import DeliverRequestForm from './DeliverRequestForm';
import MyDeliveries from './MyDeliveries';
import TrackDelivery from './TrackDelivery';
import Feedback from './Feedback';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; // At top

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('request');
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();


  const tabs = [
    { id: 'request', label: 'New Delivery', icon: Package, color: 'bg-blue-500' },
    { id: 'deliveries', label: 'My Deliveries', icon: Truck, color: 'bg-green-500' },
    { id: 'track', label: 'Track Package', icon: MapPin, color: 'bg-purple-500' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, color: 'bg-orange-500' }
  ];

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

  const renderContent = () => {
    switch (activeTab) {
      case 'request':
        return <DeliverRequestForm />;
      case 'deliveries':
        return <MyDeliveries />;
      case 'track':
        return <TrackDelivery />;
      case 'feedback':
        return <Feedback />;
      default:
        return <DeliverRequestForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                <p className="text-sm text-gray-600">Customer Dashboard</p>
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
                          window.location.href = '/'; // or redirect to login page
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

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-gray-200/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;
