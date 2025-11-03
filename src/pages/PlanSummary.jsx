import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import "./PlanSummary.css";
import html2pdf from 'html2pdf.js';

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, duration, mood, budget, travelType, foodPreferences } = formData;

  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef(null);

  // 🔑 Your Gemini API Key
  const GEMINI_API_KEY = "AIzaSyCoekjWF4yyj2Chq2oDhaxpo2PIKZ8J0hI";

  // Initialize Gemini-compatible OpenAI client
  const client = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    generateAIItinerary();
  }, []);

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
        .replace(/[#*_`]/g, '') // Remove markdown symbols
        .replace(/\*\*/g, '')   // Remove bold markers
        .replace(/##/g, '')     // Remove headers
        .split('\n')
        .map(line => {
          // Add bullet points to lines that start with content (not empty, not headers)
          const trimmedLine = line.trim();
          
          // Skip empty lines and main headers
          if (!trimmedLine || 
              trimmedLine.startsWith('BUDGET BREAKDOWN') ||
              trimmedLine.startsWith('DAY') ||
              trimmedLine.startsWith('---') ||
              trimmedLine.startsWith('Places to Visit:') ||
              trimmedLine.startsWith('Food & Dining:') ||
              trimmedLine.startsWith('Extra Tips:') ||
              trimmedLine.startsWith('Day Tip:')) {
            return line;
          }
          
          // Add bullet point if line doesn't already start with one
          if (trimmedLine && !trimmedLine.startsWith('•')) {
            return '  • ' + trimmedLine;
          }
          
          return line;
        })
        .join('\n')
        .trim();
      
      setItinerary(generatedText);
    } catch (err) {
      setError(err.message || "Connection error.");
      console.error("Backend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to format text with bold and underlined place names
  const formatItinerary = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check if line contains a place name (ends with colon after bullet point)
      const placeNameMatch = line.match(/^(\s*•\s*)([^:]+)(:.*)/);
      
      if (placeNameMatch) {
        const [, bullet, placeName, description] = placeNameMatch;
        return (
          <div key={index}>
            {bullet}
            <strong style={{ textDecoration: 'underline' }}>{placeName}</strong>
            {description}
          </div>
        );
      }
      
      return <div key={index}>{line || '\u00A0'}</div>;
    });
  };

  const downloadPDF = async () => {
    try {
      // Using html2pdf library
      const element = contentRef.current;
      const opt = {
        margin: 1,
        filename: `${destination}-itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Check if html2pdf is available
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
            <div style={{ fontFamily: "inherit", lineHeight: "1.8" }}>
              {formatItinerary(itinerary)}
            </div>
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