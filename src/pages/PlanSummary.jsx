import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import "./PlanSummary.css";

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, duration, mood, budget, travelType, foodPreferences } = formData;

  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔑 Your Gemini API Key
  const GEMINI_API_KEY = "AIzaSyCoekjWF4yyj2Chq2oDhaxpo2PIKZ8J0hI";

  // Initialize Gemini-compatible OpenAI client
  const client = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true, // ✅ Required for frontend use
  });

  useEffect(() => {
    generateAIItinerary();
  }, []);

  const generateAIItinerary = async () => {
  setLoading(true);
  setError("");

  const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.

Travel Details:
- Duration: ${duration} days
- Mood/Style: ${mood}
- Budget: $${budget}
- Travel Type: ${travelType}
- Food Preferences: ${foodPreferences.join(", ")}

Please provide a day-by-day itinerary with:
- Morning, afternoon, and evening activities
- Recommended restaurants/food spots matching preferences
- Approximate costs within the budget
- Travel tips specific to ${destination}

Format each day clearly with "Day X:" headers.`;

  try {
    const response = await fetch("http://localhost:5000/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message || "Failed to generate itinerary");

    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text || "No response from AI.";
    setItinerary(generatedText);
  } catch (err) {
    setError(err.message || "Connection error.");
    console.error("Backend Error:", err);
  } finally {
    setLoading(false);
  }
};


  const handleRestart = () => {
    navigate("/");
  };

  return (
    <div className="summary-container">
      <h2>✨ Your Personalized Itinerary for {destination || "Your Trip"} ✈️</h2>
      <p>
        <strong>Duration:</strong> {duration} days | <strong>Mood:</strong> {mood} |{" "}
        <strong>Travel Type:</strong> {travelType} | <strong>Budget:</strong> ${budget}
      </p>

      <div className="itinerary-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Crafting your perfect itinerary...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={generateAIItinerary}>Try Again</button>
          </div>
        )}

        {itinerary && !loading && (
          <div className="ai-itinerary">
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {itinerary}
            </pre>
          </div>
        )}
      </div>

      <div className="btn-group">
        <button onClick={onBack}>← Back</button>
        <button onClick={handleRestart}>Start New Plan</button>
      </div>
    </div>
  );
};

export default PlanSummary;
