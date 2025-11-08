import React, { useState } from "react";

const moods = ["Party", "Relaxing", "Adventure", "Cultural", "Romantic", "Wellness"];

const PlanStep2 = ({ onBack, onNext, formData, setFormData }) => {  // ✅ Add these props
  const [selectedMood, setSelectedMood] = useState(formData.mood || "");

  const handleNext = () => {
    setFormData({ ...formData, mood: selectedMood });
    onNext();
  };

  return (
    <div className="plan-step">
      <h2>What's your travel mood?</h2>
      <p>Choose one that best matches how you want to feel on this trip</p>

      <div className="mood-grid">
        {moods.map((mood) => (
          <div
            key={mood}
            className={`mood-card ${selectedMood === mood ? "selected" : ""}`}
            onClick={() => setSelectedMood(mood)}
          >
            {mood}
          </div>
        ))}
      </div>

      <div className="btn-group">
        <button onClick={onBack}>← Back</button>
        <button
          disabled={!selectedMood}
          onClick={handleNext}  
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PlanStep2;