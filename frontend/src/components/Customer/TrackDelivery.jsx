import React, { useState } from 'react';
import { Search, MapPin, Truck, CheckCircle, Clock, Package, Phone, Navigation } from 'lucide-react';

const TrackDelivery = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock tracking data
      const mockData = {
        id: trackingId,
        status: 'in-transit',
        currentLocation: 'Downtown Distribution Center',
        estimatedDelivery: '2:30 PM',
        package: 'Electronics Package',
        pickup: '123 Main St, Downtown',
        dropoff: '456 Oak Ave, Suburbs',
        driver: {
          name: 'Mike Johnson',
          phone: '+1 (555) 123-4567',
          vehicle: 'Blue Toyota Camry - ABC123'
        },
        timeline: [
          {
            status: 'Package Received',
            time: '9:00 AM',
            date: 'Today',
            location: 'Main Warehouse',
            completed: true
          },
          {
            status: 'Out for Pickup',
            time: '10:30 AM',
            date: 'Today',
            location: '123 Main St',
            completed: true
          },
          {
            status: 'Package Picked Up',
            time: '11:15 AM',
            date: 'Today',
            location: '123 Main St',
            completed: true
          },
          {
            status: 'In Transit',
            time: '11:45 AM',
            date: 'Today',
            location: 'Downtown Distribution Center',
            completed: true,
            current: true
          },
          {
            status: 'Out for Delivery',
            time: '2:00 PM',
            date: 'Today',
            location: 'Delivery Vehicle',
            completed: false
          },
          {
            status: 'Delivered',
            time: '2:30 PM',
            date: 'Today',
            location: '456 Oak Ave',
            completed: false
          }
        ]
      };
      
      setTrackingData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  const getTimelineIcon = (status, completed, current) => {
    if (current) {
      return <Truck className="h-5 w-5 text-blue-600" />;
    }
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Your Delivery</h2>
        <p className="text-gray-600">Enter your tracking ID to get real-time updates</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="mb-8">
        <div className="flex gap-4 max-w-md">
          <div className="flex-1">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., DEL001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span>{isLoading ? 'Tracking...' : 'Track'}</span>
          </button>
        </div>
      </form>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Package Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">#{trackingData.id}</h3>
                  <p className="text-gray-600">{trackingData.package}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {trackingData.status.replace('-', ' ').toUpperCase()}
                </div>
                <p className="text-sm text-gray-600 mt-1">ETA: {trackingData.estimatedDelivery}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">From</p>
                    <p className="text-gray-600 text-sm">{trackingData.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">To</p>
                    <p className="text-gray-600 text-sm">{trackingData.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Navigation className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Current Location</p>
                    <p className="text-gray-600 text-sm">{trackingData.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Driver</p>
                    <p className="text-gray-600 text-sm">{trackingData.driver.name}</p>
                    <p className="text-gray-500 text-xs">{trackingData.driver.phone}</p>
                    <p className="text-gray-500 text-xs">{trackingData.driver.vehicle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Timeline</h3>
            
            <div className="space-y-4">
              {trackingData.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    {getTimelineIcon(event.status, event.completed, event.current)}
                    {index < trackingData.timeline.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${event.completed ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                  
                  <div className={`flex-1 pb-4 ${event.current ? 'bg-blue-50 -mx-4 px-4 py-2 rounded-lg' : ''}`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${event.current ? 'text-blue-900' : event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {event.status}
                        {event.current && <span className="ml-2 text-blue-600 text-sm">(Current)</span>}
                      </h4>
                      <div className={`text-sm ${event.current ? 'text-blue-600' : event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {event.time} • {event.date}
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${event.current ? 'text-blue-700' : event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors duration-200">
              Call Driver
            </button>
            <button className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-medium hover:bg-green-200 transition-colors duration-200">
              View on Map
            </button>
            <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-medium hover:bg-purple-200 transition-colors duration-200">
              Share Tracking
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {trackingId && !trackingData && !isLoading && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information found</h3>
          <p className="text-gray-600">Please check your tracking ID and try again.</p>
        </div>
      )}
    </div>
  );
};

export default TrackDelivery;