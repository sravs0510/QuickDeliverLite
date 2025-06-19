import React, { useState } from 'react';
import { Truck, MapPin, Clock, User } from 'lucide-react';
import PendingDeliveries from './PendingDeliveries';
import AcceptedDeliveries from './AcceptedDeliveries';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingDeliveries, setPendingDeliveries] = useState([
    {
      id: 1,
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      pickupAddress: '123 Main St, Downtown',
      deliveryAddress: '456 Oak Ave, Westside',
      packageType: 'Electronics',
      estimatedTime: '30 mins',
      priority: 'High',
      orderValue: '$299.99',
      distance: '2.5 km'
    },
    {
      id: 2,
      customerName: 'Mike Chen',
      customerPhone: '+1 (555) 987-6543',
      pickupAddress: '789 Pine Rd, Central',
      deliveryAddress: '321 Elm St, Eastside',
      packageType: 'Food',
      estimatedTime: '15 mins',
      priority: 'Medium',
      orderValue: '$45.50',
      distance: '1.8 km'
    },
    {
      id: 3,
      customerName: 'Emma Davis',
      customerPhone: '+1 (555) 456-7890',
      pickupAddress: '555 Maple Ave, North',
      deliveryAddress: '777 Cedar Ln, South',
      packageType: 'Clothing',
      estimatedTime: '45 mins',
      priority: 'Low',
      orderValue: '$129.99',
      distance: '4.2 km'
    }
  ]);

  const [acceptedDeliveries, setAcceptedDeliveries] = useState([
    {
      id: 4,
      customerName: 'John Smith',
      customerPhone: '+1 (555) 234-5678',
      pickupAddress: '999 Broadway, Center',
      deliveryAddress: '111 Park Ave, North',
      packageType: 'Documents',
      status: 'picked_up',
      orderValue: '$15.00',
      distance: '3.1 km',
      acceptedAt: '2:30 PM'
    }
  ]);

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
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Online</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">Driver #12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Pending Deliveries</p>
                  <p className="text-2xl font-bold">{pendingDeliveries.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Accepted Deliveries</p>
                  <p className="text-2xl font-bold">{acceptedDeliveries.length}</p>
                </div>
                <Truck className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Today's Earnings</p>
                  <p className="text-2xl font-bold">$125.50</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Distance</p>
                  <p className="text-2xl font-bold">15.2 km</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
                Pending Deliveries ({pendingDeliveries.length})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'accepted'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Accepted Deliveries ({acceptedDeliveries.length})
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