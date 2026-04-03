import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanSummary.css";

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, origin, duration, mood, budget, travelType, foodPreferences } = formData;

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // "saving" | "saved" | "error"
  const contentRef = useRef(null);

  useEffect(() => {
    generateAIItinerary();
  }, []);

  // ─── Parse raw AI text into structured object ─────────────────────────────
  const parseItinerary = (text) => {
    const days = [];
    let budgetBreakdown = "";
    let transportSection = "";

    // Extract transport section
    const transportMatch = text.match(/TRANSPORT GUIDE\s*([\s\S]*?)(?=BUDGET BREAKDOWN|DAY 1:|$)/i);
    if (transportMatch) transportSection = transportMatch[1].trim();

    // Extract budget breakdown
    const budgetMatch = text.match(/BUDGET BREAKDOWN\s*([\s\S]*?)(?=DAY 1:|$)/i);
    if (budgetMatch) budgetBreakdown = budgetMatch[1].trim();

    // Extract days
    const dayRegex = /DAY (\d+):\s*([^\n]+)\s*([\s\S]*?)(?=DAY \d+:|$)/gi;
    let match;
    while ((match = dayRegex.exec(text)) !== null) {
      const dayNumber = match[1];
      const dayTitle = match[2].trim();
      const dayContent = match[3];

      const placesMatch = dayContent.match(/Places to Visit:\s*([\s\S]*?)(?=Food & Dining:|$)/i);
      const foodMatch   = dayContent.match(/Food & Dining:\s*([\s\S]*?)(?=Extra Tips:|$)/i);
      const tipsMatch   = dayContent.match(/Extra Tips:\s*([\s\S]*?)(?=Day Tip:|$)/i);
      const dayTipMatch = dayContent.match(/Day Tip:\s*([\s\S]*?)(?=---|$)/i);

      days.push({
        dayNumber,
        dayTitle,
        places:  placesMatch ? placesMatch[1].trim() : "",
        food:    foodMatch   ? foodMatch[1].trim()   : "",
        tips:    tipsMatch   ? tipsMatch[1].trim()   : "",
        dayTip:  dayTipMatch ? dayTipMatch[1].trim() : "",
      });
    }

    return { transportSection, budgetBreakdown, days };
  };

  // ─── Generate itinerary from backend ──────────────────────────────────────
  const generateAIItinerary = async () => {
    setLoading(true);
    setError("");
    setSaveStatus("");

    const prompt = `You're a friendly travel buddy helping plan a ${duration}-day trip to ${destination}. Write a casual, conversational itinerary like you're texting a friend.

Trip Details:
- Travelling FROM: ${origin}
- Destination: ${destination}
- Duration: ${duration} days
- Vibe: ${mood}
- Total Budget: $${budget}
- Travel Style: ${travelType}
- Food Preferences: ${foodPreferences.join(", ")}

IMPORTANT LOCATION PLANNING RULE:
Group locations by proximity. Each day should cover places geographically close to each other to minimize travel time. Start with the most central/iconic area on Day 1, then move outward on subsequent days. Never randomly mix far-apart locations in the same day. Mention the neighborhood/zone each day covers.

Structure your response EXACTLY like this (in this order):

TRANSPORT GUIDE
Write 4-6 lines about how to get from ${origin} to ${destination} and back. Cover:
- Best ways to fly or travel there (airlines, train routes, or road options depending on distance)
- Estimated one-way travel cost per person
- Best time to book for cheapest fares
- How to get from the airport/station to the city center on arrival
- Tips for the return journey

BUDGET BREAKDOWN
Give 5-6 bullet points showing how to split the $${budget} total budget:
- Round-trip transport from ${origin}: estimated cost
- Accommodation (${duration} nights): estimated cost
- Food & dining: estimated cost
- Activities & entry fees: estimated cost
- Local transport within ${destination}: estimated cost
- Buffer/shopping: remaining amount

Then for each day use this exact format:

DAY 1: [Brief catchy title — include the area/zone being covered]

Places to Visit:
List 2-3 must-see spots with a sentence or two about each. Mention why these places are close to each other.

Food & Dining:
Suggest 2-3 restaurants or food experiences (breakfast, lunch, dinner or local food to try). Mention cuisine type and vibe.

Extra Tips:
Special notes — best time to visit, what to bring, local customs, or money-saving hacks.

Day Tip: One quick helpful tip for the day (transport hack, hidden gem, or insider advice).

---

Repeat for all ${duration} days. Write naturally — no hashtags, asterisks, or markdown symbols. Just casual, friendly text.`;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "Failed to generate itinerary");

      let generatedText = data.candidates[0]?.content?.parts?.[0]?.text || "No response from AI.";
      generatedText = generatedText.replace(/[#*_`]/g, "").replace(/\*\*/g, "").replace(/##/g, "").trim();

      const parsed = parseItinerary(generatedText);
      setItinerary(parsed);

      // Auto-save after successful generation
      await saveItinerary(parsed, generatedText);
    } catch (err) {
      setError(err.message || "Connection error.");
      console.error("Backend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Save itinerary to DB ─────────────────────────────────────────────────
  const hasSaved = useRef(false);

const saveItinerary = async (parsedItinerary, rawText) => {
  if (hasSaved.current) return; // ← block second call
  hasSaved.current = true;

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  if (!user || !token) return;

    setSaveStatus("saving");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/itineraries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination,
          origin,
          duration,
          mood,
          budget,
          travelType,
          foodPreferences,
          rawText,
          parsedItinerary,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
    }
  };

  // ─── Format card content for on-screen display ────────────────────────────
  const formatCardContent = (text) => {
    return text
      .split("\n")
      .map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const match = trimmed.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          return (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <strong style={{ color: "#2d5a8f" }}>{match[1]}:</strong> {match[2]}
            </div>
          );
        }
        return <div key={idx} style={{ marginBottom: "8px" }}>{trimmed}</div>;
      })
      .filter(Boolean);
  };

  // ─── PDF: convert plain text to HTML cards ────────────────────────────────
  const formatTextForPDF = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .filter((l) => l.trim())
      .map((line) => {
        const trimmed = line.trim();
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx > -1 && colonIdx < 40) {
          const name = trimmed.slice(0, colonIdx);
          const desc = trimmed.slice(colonIdx + 1).trim();
          return `<div class="card-item"><span class="card-item-name">${name}:</span> ${desc}</div>`;
        }
        return `<div class="card-item">${trimmed}</div>`;
      })
      .join("");
  };

  // ─── PDF Download ─────────────────────────────────────────────────────────
  const downloadPDF = () => {
    if (!itinerary) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Lato', Arial, sans-serif; color: #1a1a2e; background: #ffffff; font-size: 11pt; line-height: 1.6; }

          .cover { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); color: white; padding: 48px 40px 40px; text-align: center; }
          .cover-emoji { font-size: 48px; margin-bottom: 12px; display: block; }
          .cover h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 30pt; letter-spacing: 1px; margin-bottom: 8px; }
          .cover-subtitle { font-size: 12pt; opacity: 0.85; margin-bottom: 8px; }
          .cover-origin { font-size: 10pt; opacity: 0.7; margin-bottom: 20px; }
          .cover-tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
          .cover-tag { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 4px 14px; font-size: 10pt; }

          .divider { height: 4px; background: linear-gradient(90deg, #e94560, #0f3460, #533483); margin-bottom: 32px; }
          .section { padding: 0 40px; margin-bottom: 32px; }

          /* Transport */
          .transport-box { background: #f0f7ff; border: 1px solid #b8d4f5; border-left: 5px solid #1a73e8; border-radius: 8px; padding: 20px 24px; }
          .transport-box h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 16pt; color: #1a73e8; margin-bottom: 12px; }
          .transport-item { padding: 6px 0; border-bottom: 1px solid #d8eafc; font-size: 10.5pt; }
          .transport-item:last-child { border-bottom: none; }

          /* Budget */
          .budget-box { background: #f8f9ff; border: 1px solid #d0d8ff; border-left: 5px solid #0f3460; border-radius: 8px; padding: 20px 24px; }
          .budget-box h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 16pt; color: #0f3460; margin-bottom: 12px; }
          .budget-item { padding: 6px 0; border-bottom: 1px solid #e8ecf8; font-size: 11pt; }
          .budget-item:last-child { border-bottom: none; }
          .budget-label { font-weight: 700; color: #1a1a2e; }

          /* Days */
          .day-block { margin-bottom: 36px; page-break-inside: avoid; }
          .day-header-bar { background: linear-gradient(135deg, #0f3460, #533483); color: white; padding: 12px 24px; border-radius: 8px 8px 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 14pt; }
          .day-header-bar .day-num { font-size: 9pt; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 2px; font-family: 'Lato', Arial, sans-serif; }
          .cards-row { display: flex; gap: 0; border: 1px solid #e0e4f0; border-top: none; border-radius: 0 0 8px 8px; overflow: hidden; }
          .card { flex: 1; padding: 16px; border-right: 1px solid #e0e4f0; background: #ffffff; }
          .card:last-child { border-right: none; }
          .card-header { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid; }
          .places-card .card-header { border-color: #e94560; }
          .food-card   .card-header { border-color: #f5a623; }
          .tips-card   .card-header { border-color: #27ae60; }
          .card-emoji { font-size: 14pt; }
          .card-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .places-card .card-title { color: #e94560; }
          .food-card   .card-title { color: #d4870a; }
          .tips-card   .card-title { color: #27ae60; }
          .card-body { font-size: 9.5pt; line-height: 1.55; color: #333; }
          .card-item { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
          .card-item:last-child { border-bottom: none; margin-bottom: 0; }
          .card-item-name { font-weight: 700; color: #1a1a2e; }

          .day-tip-box { background: linear-gradient(135deg, #fff8e1, #fff3cd); border: 1px solid #ffc107; border-left: 4px solid #ffc107; border-radius: 6px; padding: 10px 16px; margin-top: 10px; font-size: 10pt; color: #5d4e00; }
          .day-tip-label { font-weight: 700; margin-right: 4px; }

          .footer { margin-top: 40px; background: #1a1a2e; color: rgba(255,255,255,0.6); text-align: center; padding: 16px 40px; font-size: 9pt; }
        </style>
      </head>
      <body>
        <div class="cover">
          <span class="cover-emoji">✈️</span>
          <h1>${destination}</h1>
          <p class="cover-subtitle">Your Personalized ${duration}-Day Itinerary</p>
          <p class="cover-origin">📍 Travelling from ${origin}</p>
          <div class="cover-tags">
            <span class="cover-tag">🗓 ${duration} Days</span>
            <span class="cover-tag">✨ ${mood}</span>
            <span class="cover-tag">👤 ${travelType}</span>
            <span class="cover-tag">💵 $${budget}</span>
            ${foodPreferences.map((f) => `<span class="cover-tag">🍽 ${f}</span>`).join("")}
          </div>
        </div>
        <div class="divider"></div>

        ${itinerary.transportSection ? `
        <div class="section">
          <div class="transport-box">
            <h2>🛫 Getting There & Back (${origin} → ${destination})</h2>
            ${itinerary.transportSection.split("\n").filter((l) => l.trim()).map((line) => {
              const trimmed = line.trim().replace(/^[-•]\s*/, "");
              const colonIdx = trimmed.indexOf(":");
              if (colonIdx > -1 && colonIdx < 40) {
                return `<div class="transport-item"><strong>${trimmed.slice(0, colonIdx)}:</strong> ${trimmed.slice(colonIdx + 1).trim()}</div>`;
              }
              return `<div class="transport-item">${trimmed}</div>`;
            }).join("")}
          </div>
        </div>
        ` : ""}

        ${itinerary.budgetBreakdown ? `
        <div class="section">
          <div class="budget-box">
            <h2>💰 Budget Breakdown</h2>
            ${itinerary.budgetBreakdown.split("\n").filter((l) => l.trim()).map((line) => {
              const trimmed = line.trim().replace(/^[-•]\s*/, "");
              const colonIdx = trimmed.indexOf(":");
              if (colonIdx > -1) {
                return `<div class="budget-item"><span class="budget-label">${trimmed.slice(0, colonIdx)}:</span> ${trimmed.slice(colonIdx + 1).trim()}</div>`;
              }
              return `<div class="budget-item">${trimmed}</div>`;
            }).join("")}
          </div>
        </div>
        ` : ""}

        ${itinerary.days.map((day) => `
        <div class="section">
          <div class="day-block">
            <div class="day-header-bar">
              <span class="day-num">Day ${day.dayNumber}</span>
              ${day.dayTitle}
            </div>
            <div class="cards-row">
              <div class="card places-card">
                <div class="card-header"><span class="card-emoji">📍</span><span class="card-title">Places to Visit</span></div>
                <div class="card-body">${formatTextForPDF(day.places)}</div>
              </div>
              <div class="card food-card">
                <div class="card-header"><span class="card-emoji">🍽️</span><span class="card-title">Food & Dining</span></div>
                <div class="card-body">${formatTextForPDF(day.food)}</div>
              </div>
              <div class="card tips-card">
                <div class="card-header"><span class="card-emoji">💡</span><span class="card-title">Extra Tips</span></div>
                <div class="card-body">${formatTextForPDF(day.tips)}</div>
              </div>
            </div>
            ${day.dayTip ? `<div class="day-tip-box"><span class="day-tip-label">💫 Day Tip:</span>${day.dayTip}</div>` : ""}
          </div>
        </div>
        `).join("")}

        <div class="footer">Generated by Wandrr &nbsp;|&nbsp; Happy Travels! 🌍</div>
      </body>
      </html>
    `;

    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  const handleRestart = () => navigate("/");

  return (
    <div className="summary-container">
      <h2>✨ Your Personalized Itinerary for {destination || "Your Trip"} ✈️</h2>
      <p>
        <strong>From:</strong> {origin} | <strong>Duration:</strong> {duration} days |{" "}
        <strong>Mood:</strong> {mood} | <strong>Travel Type:</strong> {travelType} |{" "}
        <strong>Budget:</strong> ${budget}
      </p>

      {/* Save status badge */}
      {saveStatus === "saving" && <p className="save-status saving">💾 Saving your itinerary...</p>}
      {saveStatus === "saved"  && <p className="save-status saved">✅ Itinerary saved to your account!</p>}
      {saveStatus === "error"  && <p className="save-status save-error">⚠️ Could not save itinerary.</p>}

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

            {/* Transport Section */}
            {itinerary.transportSection && (
              <div className="transport-section">
                <h3>🛫 Getting There & Back ({origin} → {destination})</h3>
                <div className="transport-content">
                  {formatCardContent(itinerary.transportSection)}
                </div>
              </div>
            )}

            {/* Budget Breakdown */}
            {itinerary.budgetBreakdown && (
              <div className="budget-section">
                <h3>💰 Budget Breakdown</h3>
                <div className="budget-content">
                  {formatCardContent(itinerary.budgetBreakdown)}
                </div>
              </div>
            )}

            {/* Days */}
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="day-section">
                <h3 className="day-header">DAY {day.dayNumber}: {day.dayTitle}</h3>
                <div className="cards-container">
                  <div className="itinerary-card places-card">
                    <div className="card-icon">📍</div>
                    <h4>Places to Visit</h4>
                    <div className="card-content">{formatCardContent(day.places)}</div>
                  </div>
                  <div className="itinerary-card food-card">
                    <div className="card-icon">🍽️</div>
                    <h4>Food & Dining</h4>
                    <div className="card-content">{formatCardContent(day.food)}</div>
                  </div>
                  <div className="itinerary-card tips-card">
                    <div className="card-icon">💡</div>
                    <h4>Extra Tips</h4>
                    <div className="card-content">{formatCardContent(day.tips)}</div>
                  </div>
                </div>
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
          <button onClick={downloadPDF} className="download-btn">📥 Download PDF</button>
        )}
        <button onClick={handleRestart}>Start New Plan</button>
      </div>
    </div>
  );
};

export default PlanSummary;