import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const destinations = ["Tokyo", "Paris", "New York", "Bali", "London", "Dubai", "Singapore", "Rome", "Barcelona", "Bangkok"];

const PlanStep1 = ({ onNext, formData, setFormData }) => {
  const [destination, setDestination] = useState(formData.destination || "");
  const [origin, setOrigin] = useState(formData.origin || "");
  const [duration, setDuration] = useState(formData.duration || 7);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!destination.trim()) {
      alert("Please enter a destination.");
      return;
    }
    if (!origin.trim()) {
      alert("Please enter where you're travelling from.");
      return;
    }
    setFormData({ ...formData, destination, origin, duration });
    onNext();
  };

  return (
    <div className="plan-step">
      <h2>Where would you like to go?</h2>
      <p>Tell us your dream destination and how long you'd like to stay</p>

      <label>Travelling From</label>
      <input
        type="text"
        placeholder="e.g. Mumbai, India"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />

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

      <label>Trip Duration: {duration} days</label>
      <input
        type="range"
        min="1"
        max="30"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="duration-slider"
      />
      <div className="range-labels">
        <span>1 day</span>
        <span>30 days</span>
      </div>

      <div className="btn-group" style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")}>← Back</button>
        <button onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
};

export default PlanStep1;