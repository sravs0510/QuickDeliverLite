import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle, User, Calendar } from 'lucide-react';
import axios from 'axios';

const Feedback = () => {
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [previousFeedback, setPreviousFeedback] = useState([]);

  const feedbackCategories = [
    { id: 'general', label: 'General Experience' },
    { id: 'driver', label: 'Driver Service' },
    { id: 'speed', label: 'Delivery Speed' },
    { id: 'packaging', label: 'Package Condition' },
    { id: 'communication', label: 'Communication' },
    { id: 'app', label: 'App Experience' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('userEmail'); // or wherever you store it

      const deliveryRes = await axios.get('http://localhost:5000/api/feedback/deliveries', {
        params: { email: userEmail }
      });

      const feedbackRes = await axios.get('http://localhost:5000/api/feedback/all');
      console.log('Delivery response:', deliveryRes.data);

      const deliveries = deliveryRes.data
        .filter((d) => !d.feedbackGiven && d.status.toLowerCase() === 'delivered')
        .map((d) => ({
          id: d.trackingId,
          date: d.deliveryDate,
          package: `${d.packageNote || 'No Description'} (${d.pickupAddress} → ${d.dropoffAddress})`
        }));

      const feedbacks = feedbackRes.data.map((item) => ({
        deliveryId: item.trackingId,
        rating: item.feedback.rating,
        comment: item.feedback.comment,
        category: item.feedback.category,
        date: new Date(item.feedback.date).toLocaleDateString()
      }));

      setRecentDeliveries(deliveries);
      setPreviousFeedback(feedbacks);
    };


    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/feedback', {
      deliveryId: selectedDelivery,
      rating,
      comment: feedback,
      category,
    });
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedDelivery('');
      setRating(0);
      setFeedback('');
      setCategory('general');
    }, 3000);
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${!readonly ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'} transition-colors duration-200`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our service.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Feedback Submitted</p>
            <p className="text-green-600 text-sm">Rating: {rating} stars</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h2>
        <p className="text-gray-600">Help us improve our service by sharing your experience</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Submit New Feedback</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Select Delivery</label>
              <select
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Choose a recent delivery...</option>
                {recentDeliveries.map((delivery) => (
                  <option key={delivery.id} value={delivery.id}>
                    {delivery.id} - {delivery.package} ({delivery.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {feedbackCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Overall Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} />
              <p className="text-sm text-gray-500 mt-1">
                {rating === 0 && "Please select a rating"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Your Comments</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDelivery || rating === 0 || !feedback.trim() || recentDeliveries.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Submit Feedback</span>
            </button>
          </form>
        </div>

        {/* Previous Feedback */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Previous Feedback</h3>

          <div className="space-y-4">
            {previousFeedback.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">#{item.deliveryId}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <StarRating rating={item.rating} readonly={true} />
                </div>

                <p className="text-gray-700 text-sm mb-2">{item.comment}</p>

                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">
                    {feedbackCategories.find(cat => cat.id === item.category)?.label}
                  </span>
                </div>
              </div>
            ))}

            {previousFeedback.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No previous feedback yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
