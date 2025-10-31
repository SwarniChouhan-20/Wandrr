import React, { useState } from "react";

const destinations = ["Tokyo", "Paris", "New York", "Bali", "London"];

const PlanStep1 = ({ onNext, formData, setFormData }) => {  // ✅ Add these props
  const [destination, setDestination] = useState(formData.destination || "");
  const [duration, setDuration] = useState(formData.duration || 7);

  const handleNext = () => {
    setFormData({ ...formData, destination, duration });
    onNext();
  };

  return (
    <div className="plan-step">
      <h2>Where would you like to go?</h2>
      <p>Tell us your dream destination and how long you'd like to stay</p>

      <label>Destination</label>
      <input
        list="destinations"
        placeholder="e.g. Tokyo, Japan"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <datalist id="destinations">
        {destinations.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>

      <label>Trip Duration</label>
      <div className="duration-options">
        {[3, 7, 10].map((days) => (
          <button
            key={days}
            className={duration === days ? "selected" : ""}
            onClick={() => setDuration(days)}
          >
            {days} days
          </button>
        ))}
      </div>

      <div className="btn-group">
        <button disabled>← Back</button>
        <button onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
};

export default PlanStep1;