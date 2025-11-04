import React, { useState } from 'react';
import { Star, Send, Heart } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    overallRating: 0,
    tripExperience: 0,
    itineraryQuality: 0,
    websiteUsability: 0,
    tripDetails: '',
    improvements: '',
    recommend: ''
  });

  const [hoveredRating, setHoveredRating] = useState({
    overallRating: 0,
    tripExperience: 0,
    itineraryQuality: 0,
    websiteUsability: 0
  });

  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (field, rating) => {
    setFormData({ ...formData, [field]: rating });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const StarRating = ({ field, label }) => (
    <div className="rating-group">
      <label className="rating-label">{label}</label>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star ${
              star <= (hoveredRating[field] || formData[field]) ? 'filled' : ''
            }`}
            onMouseEnter={() => setHoveredRating({ ...hoveredRating, [field]: star })}
            onMouseLeave={() => setHoveredRating({ ...hoveredRating, [field]: 0 })}
            onClick={() => handleRatingClick(field, star)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="review-page">
      

      <div className="review-container">
        <div className="review-content">
          <div className="review-hero">
            <h1 className="review-title">Share Your Experience</h1>
            <p className="review-subtitle">
              Your feedback helps us create better travel experiences for everyone
            </p>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            {/* Question 1: Overall Rating */}
            <StarRating field="overallRating" label="1. Overall Experience Rating" />

            {/* Question 2: Trip Experience */}
            <StarRating field="tripExperience" label="2. How was your trip experience?" />

            {/* Question 3: Itinerary Quality */}
            <StarRating
              field="itineraryQuality"
              label="3. AI Itinerary Quality & Personalization"
            />

            {/* Question 4: Website Usability */}
            <StarRating
              field="websiteUsability"
              label="4. Website Ease of Use & Navigation"
            />

            {/* Question 5: Trip Details */}
            <div className="form-group">
              <label className="form-label">
                5. Tell us about your trip (destination, highlights, memorable moments)
              </label>
              <textarea
                name="tripDetails"
                value={formData.tripDetails}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Share your favorite moments and experiences..."
              />
            </div>

            {/* Question 6: Improvements */}
            <div className="form-group">
              <label className="form-label">
                6. What can we improve? (website features, itinerary planning, support)
              </label>
              <textarea
                name="improvements"
                value={formData.improvements}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Your suggestions help us grow..."
              />
            </div>

            {/* Recommendation */}
            <div className="form-group">
              <label className="form-label">Would you recommend Wandrr to others?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recommend"
                    value="definitely"
                    checked={formData.recommend === 'definitely'}
                    onChange={handleInputChange}
                  />
                  <span>Definitely!</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recommend"
                    value="maybe"
                    checked={formData.recommend === 'maybe'}
                    onChange={handleInputChange}
                  />
                  <span>Maybe</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recommend"
                    value="not-sure"
                    checked={formData.recommend === 'not-sure'}
                    onChange={handleInputChange}
                  />
                  <span>Not Sure</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Send className="btn-icon" />
              Submit Review
            </button>

            {submitted && (
              <div className="success-message">
                <Heart className="success-icon" />
                Thank you for your valuable feedback!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;