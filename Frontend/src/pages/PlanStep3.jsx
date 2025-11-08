import React, { useState } from "react";
import "./PlanStep3.css";

const PlanStep3 = ({ onNext, onBack, formData, setFormData }) => {
  const [budget, setBudget] = useState(formData.budget || 1000);
  const [travelType, setTravelType] = useState(formData.travelType || "");
  const [foodPreferences, setFoodPreferences] = useState(formData.foodPreferences || []);

  const toggleFoodPreference = (option) => {
    setFoodPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    // ✅ Save all preferences in main form data
    setFormData({
      ...formData,
      budget,
      travelType,
      foodPreferences,
    });
    onNext(); // move to summary
  };

  return (
    <div className="plan-step3">
      <h2>Set Your Preferences</h2>
      <p>Tell us about your travel style so we can personalize your trip!</p>

      {/* Budget Slider */}
      <div className="form-group">
        <label>Budget: ${budget}</label>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <div className="range-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Travel Type */}
      <div className="form-group">
        <label>Travel Type:</label>
        <div className="travel-type-options">
          {["Family", "Friends", "Solo", "Couple"].map((type) => (
            <button
              key={type}
              className={travelType === type ? "selected" : ""}
              onClick={() => setTravelType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Food Preferences */}
      <div className="form-group">
        <label>Food Preferences:</label>
        <div className="food-options">
          {[
            "Local Cuisine",
            "Veg",
            "Vegan",
            "Street Food",
            "Non-Veg",
            "Fine Dine",
          ].map((option) => (
            <button
              key={option}
              className={foodPreferences.includes(option) ? "selected" : ""}
              onClick={() => toggleFoodPreference(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="back" onClick={onBack}>
          ← Back
        </button>
        <button
          className="next"
          onClick={handleNext}
          disabled={!travelType || foodPreferences.length === 0}
        >
          Plan Trip →
        </button>
      </div>
    </div>
  );
};

export default PlanStep3;
