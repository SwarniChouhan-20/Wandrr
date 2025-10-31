import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlanSummary.css";

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, duration, mood, budget, travelType, foodPreferences } = formData;

  // Generate itinerary based on mood + duration
  const generateItinerary = () => {
    const days = Number(duration) || 3;
    const plan = [];
    for (let i = 1; i <= days; i++) {
      let activity = "";
      switch (mood) {
        case "Party":
          activity = "Enjoy the nightlife, beach parties, and local clubs.";
          break;
        case "Relaxing":
          activity = "Visit spas, beaches, and scenic cafés for unwinding.";
          break;
        case "Adventure":
          activity = "Try trekking, water sports, and outdoor exploration.";
          break;
        case "Cultural":
          activity = "Explore museums, heritage walks, and local art.";
          break;
        default:
          activity = "Discover local highlights and hidden gems.";
      }

      const meal =
        foodPreferences && foodPreferences.length
          ? `Try ${foodPreferences[Math.floor(Math.random() * foodPreferences.length)]}.`
          : "Try local dishes and street food.";

      plan.push({
        day: i,
        title: `Day ${i}`,
        activity,
        meal,
      });
    }
    return plan;
  };

  const itinerary = generateItinerary();

  const handleRestart = () => {
    navigate("/"); // ✅ Redirects to Home Page
  };

  return (
    <div className="summary-container">
      <h2>✨ Your Personalized Itinerary for {destination || "Your Trip"} ✈️</h2>
      <p>
        <strong>Duration:</strong> {duration} days | <strong>Mood:</strong> {mood} |{" "}
        <strong>Travel Type:</strong> {travelType} | <strong>Budget:</strong> ${budget}
      </p>

      <div className="day-plan">
        {itinerary.map((day) => (
          <div key={day.day} className="day-card">
            <h3>{day.title}</h3>
            <p>{day.activity}</p>
            <p>{day.meal}</p>
          </div>
        ))}
      </div>

      <div className="btn-group">
        <button onClick={onBack}>← Back</button>
        <button onClick={handleRestart}>Start New Plan</button>
      </div>
    </div>
  );
};

export default PlanSummary;
