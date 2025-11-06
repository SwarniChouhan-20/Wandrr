import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import "./PlanSummary.css";
import html2pdf from 'html2pdf.js';

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, duration, mood, budget, travelType, foodPreferences } = formData;

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef(null);

  // 🔑 Gemini API Key from env
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  // Initialize Gemini-compatible OpenAI client
  const client = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    generateAIItinerary();
  }, []);

  const parseItinerary = (text) => {
    const days = [];
    let budgetBreakdown = "";
    
    // Extract budget breakdown
    const budgetMatch = text.match(/BUDGET BREAKDOWN\s*([\s\S]*?)(?=DAY 1:|$)/i);
    if (budgetMatch) {
      budgetBreakdown = budgetMatch[1].trim();
    }

    // Split by days
    const dayRegex = /DAY (\d+):\s*([^\n]+)\s*([\s\S]*?)(?=DAY \d+:|$)/gi;
    let match;

    while ((match = dayRegex.exec(text)) !== null) {
      const dayNumber = match[1];
      const dayTitle = match[2].trim();
      const dayContent = match[3];

      // Extract sections
      const placesMatch = dayContent.match(/Places to Visit:\s*([\s\S]*?)(?=Food & Dining:|$)/i);
      const foodMatch = dayContent.match(/Food & Dining:\s*([\s\S]*?)(?=Extra Tips:|$)/i);
      const tipsMatch = dayContent.match(/Extra Tips:\s*([\s\S]*?)(?=Day Tip:|$)/i);
      const dayTipMatch = dayContent.match(/Day Tip:\s*([\s\S]*?)(?=---|$)/i);

      days.push({
        dayNumber,
        dayTitle,
        places: placesMatch ? placesMatch[1].trim() : "",
        food: foodMatch ? foodMatch[1].trim() : "",
        tips: tipsMatch ? tipsMatch[1].trim() : "",
        dayTip: dayTipMatch ? dayTipMatch[1].trim() : ""
      });
    }

    return { budgetBreakdown, days };
  };

  const generateAIItinerary = async () => {
    setLoading(true);
    setError("");

    const prompt = `You're a friendly travel buddy helping plan a ${duration}-day trip to ${destination}. Write a casual, conversational itinerary like you're texting a friend.

Trip Details:
- ${duration} days in ${destination}
- Vibe: ${mood}
- Budget: $${budget}
- Style: ${travelType}
- Food: ${foodPreferences.join(", ")}

Structure your response exactly like this:

BUDGET BREAKDOWN
Give 3-5 bullet points showing how to split the $${budget} budget across accommodations, food, activities, and transport. Keep it simple and realistic.

Then for each day, follow this format:

DAY 1: [Brief catchy title]

Places to Visit:
List 2-3 must-see spots with a sentence or two about each. Keep it conversational.

Food & Dining:
Suggest 2-3 restaurants or food experiences (breakfast, lunch, dinner spots or local food to try). Mention the type of cuisine and vibe.

Extra Tips:
Any special notes - best time to visit, what to bring, local customs, or money-saving hacks.

Day Tip: One quick, helpful tip for the day (transportation hack, hidden gem, or insider advice).

---

Repeat this exact structure for each of the ${duration} days. Write naturally without using hashtags, asterisks, or markdown symbols. Just write it like you're chatting with a friend about their trip.`;

    try {
      const response = await fetch("http://localhost:5000/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "Failed to generate itinerary");

      let generatedText = data.candidates[0]?.content?.parts?.[0]?.text || "No response from AI.";
      
      // Clean up the text - remove markdown symbols but keep structure
      generatedText = generatedText
        .replace(/[#*_`]/g, '')
        .replace(/\*\*/g, '')
        .replace(/##/g, '')
        .trim();
      
      const parsed = parseItinerary(generatedText);
      setItinerary(parsed);
    } catch (err) {
      setError(err.message || "Connection error.");
      console.error("Backend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      // Check if line contains a place/item name (format: "Name: description")
      const match = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        return (
          <div key={idx} style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#2d5a8f' }}>{match[1]}:</strong> {match[2]}
          </div>
        );
      }
      
      return <div key={idx} style={{ marginBottom: '8px' }}>{trimmed}</div>;
    }).filter(Boolean);
  };

  const downloadPDF = async () => {
    try {
      const element = contentRef.current;
      const opt = {
        margin: 1,
        filename: `${destination}-itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please add the html2pdf script to your index.html');
        return;
      }

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
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

      <div className="itinerary-content" ref={contentRef}>
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
            {/* Budget Breakdown Section */}
            {itinerary.budgetBreakdown && (
              <div className="budget-section">
                <h3>💰 Budget Breakdown</h3>
                <div className="budget-content">
                  {formatCardContent(itinerary.budgetBreakdown)}
                </div>
              </div>
            )}

            {/* Days Itinerary */}
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="day-section">
                <h3 className="day-header">
                  DAY {day.dayNumber}: {day.dayTitle}
                </h3>
                
                <div className="cards-container">
                  {/* Places to Visit Card */}
                  <div className="itinerary-card places-card">
                    <div className="card-icon">📍</div>
                    <h4>Places to Visit</h4>
                    <div className="card-content">
                      {formatCardContent(day.places)}
                    </div>
                  </div>

                  {/* Food & Dining Card */}
                  <div className="itinerary-card food-card">
                    <div className="card-icon">🍽️</div>
                    <h4>Food & Dining</h4>
                    <div className="card-content">
                      {formatCardContent(day.food)}
                    </div>
                  </div>

                  {/* Extra Tips Card */}
                  <div className="itinerary-card tips-card">
                    <div className="card-icon">💡</div>
                    <h4>Extra Tips</h4>
                    <div className="card-content">
                      {formatCardContent(day.tips)}
                    </div>
                  </div>
                </div>

                {/* Day Tip */}
                {day.dayTip && (
                  <div className="day-tip">
                    <strong>💫 Day Tip:</strong> {day.dayTip}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="btn-group">
        <button onClick={onBack}>← Back</button>
        {itinerary && !loading && (
          <button onClick={downloadPDF} className="download-btn">
            📥 Download PDF
          </button>
        )}
        <button onClick={handleRestart}>Start New Plan</button>
      </div>
    </div>
  );
};

export default PlanSummary;