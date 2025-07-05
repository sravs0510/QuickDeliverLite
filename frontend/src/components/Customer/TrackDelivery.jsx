import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Phone,
  Navigation,
} from 'lucide-react';

const TrackDelivery = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/delivery/track/${trackingId}`);
      if (!response.ok) {
        setTrackingData(null);
        throw new Error('Tracking ID not found');
      }
      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      console.error(err.message);
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!trackingId) return;

    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/delivery/track/${trackingId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => setTrackingData(data))
        .catch(() => setTrackingData(null));
    }, 10000);

    return () => clearInterval(interval);
  }, [trackingId]);

  const getTimelineIcon = (status, completed, current) => {
    if (current) return <Truck className="h-5 w-5 text-blue-600" />;
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Your Delivery</h2>
        <p className="text-gray-600">Enter your tracking ID to get real-time updates</p>
      </div>

      <form onSubmit={handleTrack} className="mb-8">
        <div className="flex gap-4 max-w-md">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID (e.g., TRK123456)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
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

      {trackingData && (
        <div className="space-y-6">
          {/* Package Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">#{trackingData.trackingId}</h3>
                  <p className="text-gray-600">{trackingData.packageNote || 'Package'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {trackingData.status.replace('-', ' ').toUpperCase()}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ETA: {trackingData.estimatedDelivery ? trackingData.estimatedDelivery : 'Calculating ETA...'}
                </p>
              </div>
            </div>

            {/* Addresses & Driver */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">From</p>
                    <p className="text-gray-600 text-sm">{trackingData.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">To</p>
                    <p className="text-gray-600 text-sm">{trackingData.dropoffAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Navigation className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Current Location</p>
                    <p className="text-gray-600 text-sm">
                      {trackingData.currentLocation ? trackingData.currentLocation : 'Driver is preparing for pickup'}
                    </p>
                  </div>
                </div>

                {trackingData.driver && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Driver</p>
                      <p className="text-gray-600 text-sm">{trackingData.driver.name}</p>
                      <p className="text-gray-500 text-xs">{trackingData.driver.phone}</p>
                      <p className="text-gray-500 text-xs">{trackingData.driver.vehicle}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          {trackingData.timeline?.length > 0 && (
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
                        <h4 className={`font-medium ${event.current ? 'text-blue-900' : event.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                          {event.status}
                          {event.current && <span className="ml-2 text-blue-600 text-sm">(Current)</span>}
                        </h4>
                        <div className={`text-sm ${event.current ? 'text-blue-600' : event.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                          {event.time} • {event.date}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${event.current ? 'text-blue-700' : event.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <a
              href={`https://wa.me/91${trackingData?.driver?.phone}?text=${encodeURIComponent(
                `Hi ${trackingData?.driver?.name}, I am tracking my delivery ${trackingData?.trackingId}. Where are you now?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors duration-200"
            >
              WhatsApp Driver
            </a>

            <button
              onClick={() => {
                if (trackingData?.currentLocation) {
                  window.location.href = `/track-map?location=${encodeURIComponent(trackingData.currentLocation)}`;
                } else {
                  alert("Location not available yet.");
                }
              }}
              className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-medium hover:bg-green-200 transition-colors duration-200"
            >
              View on Map
            </button>
            <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-medium hover:bg-purple-200 transition-colors duration-200">
              Share Tracking
            </button>
          </div>
        </div>
      )}

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
