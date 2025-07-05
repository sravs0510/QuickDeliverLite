import React, { useState } from 'react';
import {
  PackageCheck,
  UsersRound,
  ClipboardList,
  BarChart3,
  Settings2,
  User,
  Truck,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import ViewDrivers from './ViewDrivers';
import ViewCustomers from './ViewCustomers';
import StatsDashboard from './StatsDashboard';
import { useNavigate } from 'react-router-dom';
import AdminChatPanel from './AdminChatPanel';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [adminName, setAdminName] = useState('Admin');
  const [showDropdown, setShowDropdown] = useState(false);

  const [unreadTotal, setUnreadTotal] = useState(0); // 🔴 For unseen messages
  const navigate = useNavigate();

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'drivers', label: 'Drivers', icon: Truck, color: 'bg-green-500' },
    { id: 'customers', label: 'Customers', icon: UsersRound, color: 'bg-yellow-500' },
    { id: 'feedbacks', label: 'Feedbacks', icon: ClipboardList, color: 'bg-purple-500' },
    {
      id: 'chat',
      label: 'Live Chat',
      icon: MessageSquare,
      color: 'bg-red-500',
      badge: unreadTotal > 0 ? unreadTotal : null, // 🔴 Badge setup
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'drivers':
        return <ViewDrivers />;
      case 'customers':
        return <ViewCustomers />;
      case 'feedbacks':
        return <div className="p-4">Feedbacks Page Coming Soon</div>;
      case 'chat':
        return <AdminChatPanel onUnreadCountChange={setUnreadTotal} />;
      default:
        return <StatsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 rounded-lg">
                <PackageCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QuickDeliverLite</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>

            {/* Admin dropdown */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(prev => !prev)}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold text-lg shadow-md"
                  >
                    {adminName?.charAt(0).toUpperCase()}
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <button
                        onClick={() => navigate("/admin/profile")}
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

      {/* Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-gray-200/50">
          {
            tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "chat") setUnreadTotal(0); // 👈 Clear badge on open
                  }}
                  className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                      ? `${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>

                  {/* ✅ Show live badge only for chat */}
                  {tab.id === 'chat' && unreadTotal > 0 && (
                    <span className="absolute top-0 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              );
            })
          }

        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
