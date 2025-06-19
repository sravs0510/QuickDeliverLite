import React, { useState } from 'react';
import { Package, Truck, MessageSquare, MapPin, User } from 'lucide-react';
import DeliverRequestForm from './DeliverRequestForm';
import MyDeliveries from './MyDeliveries';
import TrackDelivery from './TrackDelivery';
import Feedback from './Feedback';


function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('request');

  const tabs = [
    { id: 'request', label: 'New Delivery', icon: Package, color: 'bg-blue-500' },
    { id: 'deliveries', label: 'My Deliveries', icon: Truck, color: 'bg-green-500' },
    { id: 'track', label: 'Track Package', icon: MapPin, color: 'bg-purple-500' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, color: 'bg-orange-500' }
  ];

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
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuickDeliver
                </h1>
                <p className="text-sm text-gray-500">Fast & Reliable Delivery</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-gray-200/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-lg shadow-${tab.color}/25 transform scale-105`
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
