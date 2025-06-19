import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, Calendar } from 'lucide-react';

const MyDeliveries = () => {
  const [deliveries] = useState([
    {
      id: 'DEL001',
      status: 'in-transit',
      pickup: '123 Main St, Downtown',
      dropoff: '456 Oak Ave, Suburbs',
      date: '2024-01-15',
      time: '2:30 PM',
      driver: 'Mike Johnson',
      driverPhone: '+1 (555) 123-4567',
      package: 'Electronics - Laptop',
      estimatedDelivery: '4:00 PM'
    },
    {
      id: 'DEL002',
      status: 'delivered',
      pickup: '789 Pine St, City Center',
      dropoff: '321 Elm St, Riverside',
      date: '2024-01-14',
      time: '11:15 AM',
      driver: 'Sarah Wilson',
      driverPhone: '+1 (555) 987-6543',
      package: 'Documents - Legal Papers',
      deliveredAt: '12:45 PM'
    },
    {
      id: 'DEL003',
      status: 'pending',
      pickup: '555 Cedar Rd, Northside',
      dropoff: '777 Birch Lane, Westend',
      date: '2024-01-16',
      time: '10:00 AM',
      package: 'Gift Box - Birthday Present',
      scheduledFor: 'Tomorrow'
    },
    {
      id: 'DEL004',
      status: 'cancelled',
      pickup: '999 Maple Dr, Eastside',
      dropoff: '111 Spruce St, Southside',
      date: '2024-01-13',
      package: 'Books - Text Books',
      cancelledReason: 'Address not found'
    }
  ]);

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Deliveries</h2>
        <p className="text-gray-600">Track and manage all your delivery requests</p>
      </div>

      <div className="space-y-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(delivery.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">#{delivery.id}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(delivery.status)}`}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{delivery.date}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Pickup</p>
                    <p className="text-gray-600 text-sm">{delivery.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Dropoff</p>
                    <p className="text-gray-600 text-sm">{delivery.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Package</p>
                    <p className="text-gray-600 text-sm">{delivery.package}</p>
                  </div>
                </div>
                
                {delivery.driver && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Driver</p>
                      <p className="text-gray-600 text-sm">{delivery.driver}</p>
                      <p className="text-gray-500 text-xs">{delivery.driverPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status specific information */}
            {delivery.status === 'in-transit' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Estimated Delivery: {delivery.estimatedDelivery}</p>
                <p className="text-blue-600 text-sm">Your package is on the way!</p>
              </div>
            )}

            {delivery.status === 'delivered' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">Delivered at: {delivery.deliveredAt}</p>
                <p className="text-green-600 text-sm">Package delivered successfully!</p>
              </div>
            )}

            {delivery.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">Scheduled for: {delivery.scheduledFor}</p>
                <p className="text-yellow-600 text-sm">We'll notify you when pickup starts.</p>
              </div>
            )}

            {delivery.status === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Cancelled: {delivery.cancelledReason}</p>
                <p className="text-red-600 text-sm">Please contact support for assistance.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
              {delivery.status === 'in-transit' && (
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                  Track Live
                </button>
              )}
              {delivery.status === 'pending' && (
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200">
                  Cancel
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDeliveries;