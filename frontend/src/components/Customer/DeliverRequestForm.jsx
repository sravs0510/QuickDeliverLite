import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Package, FileText, Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';

const DeliverRequestForm = () => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    packageNote: '',
    deliveryDate: '',
    deliveryTime: 'anytime',
    packageSize: 'small',
    priority: 'standard',
    email: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-fill email from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/delivery', formData);
      console.log('Delivery request:', response.data);
      setShowSuccess(true);

      // Reset form after successful submission
      setFormData({
        pickupAddress: '',
        dropoffAddress: '',
        packageNote: '',
        deliveryDate: '',
        deliveryTime: 'anytime',
        packageSize: 'small',
        priority: 'standard',
        email: localStorage.getItem("userEmail") || ''
      });

      // Auto-hide the success message after 4 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error submitting delivery request:', error);
      alert('Failed to submit delivery request.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative p-8">
      {/* Success Message Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-blue bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-bounceIn scale-95">
            <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Scheduled!</h2>
            <p className="text-gray-600">Your request has been submitted successfully.</p>
            <p className="text-blue-500 mt-2">Redirecting back to form...</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Request a Delivery</h2>
        <p className="text-gray-600">Fill in the details below to schedule your delivery</p>
      </div>

      {/* Delivery Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Pickup and Dropoff Address */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900">Pickup Address</span>
              </div>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Enter pickup address with landmarks..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-gray-900">Dropoff Address</span>
              </div>
              <textarea
                name="dropoffAddress"
                value={formData.dropoffAddress}
                onChange={handleChange}
                placeholder="Enter delivery address with landmarks..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
            </label>
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Package Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Package Description</span>
              </div>
              <textarea
                name="packageNote"
                value={formData.packageNote}
                onChange={handleChange}
                placeholder="Describe your package (size, weight, fragility, etc.)"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
            </label>

            <div className="space-y-4">
              <label className="block">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Package Size</span>
                </div>
                <select
                  name="packageSize"
                  value={formData.packageSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="small">Small (up to 2kg)</option>
                  <option value="medium">Medium (2-10kg)</option>
                  <option value="large">Large (10-25kg)</option>
                  <option value="extra-large">Extra Large (25kg+)</option>
                </select>
              </label>

              <label className="block">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Priority</span>
                </div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="standard">Standard (24-48 hours)</option>
                  <option value="express">Express (12-24 hours)</option>
                  <option value="urgent">Urgent (2-6 hours)</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="grid md:grid-cols-2 gap-6">
          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-900">Preferred Date</span>
            </div>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-900">Time Preference</span>
            </div>
            <select
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="anytime">Anytime</option>
              <option value="morning">Morning (8AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 5PM)</option>
              <option value="evening">Evening (5PM - 8PM)</option>
            </select>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Schedule Delivery
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliverRequestForm;
