import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanSummary.css";

const PlanSummary = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { destination, duration, mood, budget, travelType, foodPreferences } = formData;

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    generateAIItinerary();
  }, []);

  const parseItinerary = (text) => {
    const days = [];
    let budgetBreakdown = "";

    const budgetMatch = text.match(/BUDGET BREAKDOWN\s*([\s\S]*?)(?=DAY 1:|$)/i);
    if (budgetMatch) {
      budgetBreakdown = budgetMatch[1].trim();
    }

    const dayRegex = /DAY (\d+):\s*([^\n]+)\s*([\s\S]*?)(?=DAY \d+:|$)/gi;
    let match;

    while ((match = dayRegex.exec(text)) !== null) {
      const dayNumber = match[1];
      const dayTitle = match[2].trim();
      const dayContent = match[3];

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
        dayTip: dayTipMatch ? dayTipMatch[1].trim() : "",
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

IMPORTANT LOCATION PLANNING RULE:
Group locations by proximity. Each day should cover places that are geographically close to each other to minimize travel time and maximize enjoyment. Start with the most central or iconic area on Day 1, then move outward to nearby zones on Day 2, and so on. Never randomly mix far-apart locations in the same day. Mention the area/zone/neighborhood each day covers so the traveler knows which part of the city they are exploring.

Structure your response exactly like this:

BUDGET BREAKDOWN
Give 3-5 bullet points showing how to split the $${budget} budget across accommodations, food, activities, and transport. Keep it simple and realistic.

Then for each day, follow this format:

DAY 1: [Brief catchy title - include the area/zone being covered]

Places to Visit:
List 2-3 must-see spots with a sentence or two about each. Keep it conversational. Mention why these places are close to each other.

Food & Dining:
Suggest 2-3 restaurants or food experiences (breakfast, lunch, dinner spots or local food to try). Mention the type of cuisine and vibe.

Extra Tips:
Any special notes - best time to visit, what to bring, local customs, or money-saving hacks.

Day Tip: One quick, helpful tip for the day (transportation hack, hidden gem, or insider advice).

---

Repeat this exact structure for each of the ${duration} days. Write naturally without using hashtags, asterisks, or markdown symbols. Just write it like you're chatting with a friend about their trip.`;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "Failed to generate itinerary");

      let generatedText =
        data.candidates[0]?.content?.parts?.[0]?.text || "No response from AI.";

      generatedText = generatedText
        .replace(/[#*_`]/g, "")
        .replace(/\*\*/g, "")
        .replace(/##/g, "")
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

        return (
          <div key={idx} style={{ marginBottom: "8px" }}>
            {trimmed}
          </div>
        );
      })
      .filter(Boolean);
  };

  // ─── PDF Download with proper formatting ───────────────────────────────────
  const downloadPDF = () => {
    if (!itinerary) return;

    // Build a self-contained HTML string for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Lato', Arial, sans-serif;
            color: #1a1a2e;
            background: #ffffff;
            font-size: 11pt;
            line-height: 1.6;
          }

          /* ── Cover Banner ── */
          .cover {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
            color: white;
            padding: 48px 40px 40px;
            text-align: center;
            margin-bottom: 0;
          }
          .cover-emoji { font-size: 48px; margin-bottom: 12px; display: block; }
          .cover h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 30pt;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .cover-subtitle {
            font-size: 12pt;
            opacity: 0.85;
            margin-bottom: 20px;
          }
          .cover-tags {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 16px;
          }
          .cover-tag {
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            padding: 4px 14px;
            font-size: 10pt;
          }

          /* ── Divider ── */
          .divider {
            height: 4px;
            background: linear-gradient(90deg, #e94560, #0f3460, #533483);
            margin-bottom: 32px;
          }

          /* ── Section Wrapper ── */
          .section { padding: 0 40px; margin-bottom: 32px; }

          /* ── Budget Section ── */
          .budget-box {
            background: #f8f9ff;
            border: 1px solid #d0d8ff;
            border-left: 5px solid #0f3460;
            border-radius: 8px;
            padding: 20px 24px;
          }
          .budget-box h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16pt;
            color: #0f3460;
            margin-bottom: 12px;
          }
          .budget-item {
            padding: 6px 0;
            border-bottom: 1px solid #e8ecf8;
            font-size: 11pt;
          }
          .budget-item:last-child { border-bottom: none; }
          .budget-label { font-weight: 700; color: #1a1a2e; }

          /* ── Day Section ── */
          .day-block {
            margin-bottom: 36px;
            page-break-inside: avoid;
          }
          .day-header-bar {
            background: linear-gradient(135deg, #0f3460, #533483);
            color: white;
            padding: 12px 24px;
            border-radius: 8px 8px 0 0;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 14pt;
          }
          .day-header-bar .day-num {
            font-size: 9pt;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 2px;
            display: block;
            margin-bottom: 2px;
          }

          /* ── Three Cards Row ── */
          .cards-row {
            display: flex;
            gap: 0;
            border: 1px solid #e0e4f0;
            border-top: none;
            border-radius: 0 0 8px 8px;
            overflow: hidden;
          }
          .card {
            flex: 1;
            padding: 16px;
            border-right: 1px solid #e0e4f0;
            background: #ffffff;
          }
          .card:last-child { border-right: none; }

          .card-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid;
          }
          .places-card .card-header { border-color: #e94560; }
          .food-card   .card-header { border-color: #f5a623; }
          .tips-card   .card-header { border-color: #27ae60; }

          .card-emoji { font-size: 14pt; }
          .card-title {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .places-card .card-title { color: #e94560; }
          .food-card   .card-title { color: #d4870a; }
          .tips-card   .card-title { color: #27ae60; }

          .card-body { font-size: 9.5pt; line-height: 1.55; color: #333; }
          .card-item { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
          .card-item:last-child { border-bottom: none; margin-bottom: 0; }
          .card-item-name { font-weight: 700; color: #1a1a2e; }

          /* ── Day Tip ── */
          .day-tip-box {
            background: linear-gradient(135deg, #fff8e1, #fff3cd);
            border: 1px solid #ffc107;
            border-left: 4px solid #ffc107;
            border-radius: 6px;
            padding: 10px 16px;
            margin-top: 10px;
            font-size: 10pt;
            color: #5d4e00;
          }
          .day-tip-label { font-weight: 700; margin-right: 4px; }

          /* ── Footer ── */
          .footer {
            margin-top: 40px;
            background: #1a1a2e;
            color: rgba(255,255,255,0.6);
            text-align: center;
            padding: 16px 40px;
            font-size: 9pt;
          }
        </style>
      </head>
      <body>

        <!-- Cover -->
        <div class="cover">
          <span class="cover-emoji">✈️</span>
          <h1>${destination}</h1>
          <p class="cover-subtitle">Your Personalized ${duration}-Day Itinerary</p>
          <div class="cover-tags">
            <span class="cover-tag">🗓 ${duration} Days</span>
            <span class="cover-tag">✨ ${mood}</span>
            <span class="cover-tag">👤 ${travelType}</span>
            <span class="cover-tag">💵 $${budget}</span>
            ${foodPreferences.map(f => `<span class="cover-tag">🍽 ${f}</span>`).join("")}
          </div>
        </div>
        <div class="divider"></div>

        <!-- Budget Breakdown -->
        ${itinerary.budgetBreakdown ? `
        <div class="section">
          <div class="budget-box">
            <h2>💰 Budget Breakdown</h2>
            ${itinerary.budgetBreakdown.split("\n").filter(l => l.trim()).map(line => {
              const trimmed = line.trim();
              const colonIdx = trimmed.indexOf(":");
              if (colonIdx > -1) {
                const label = trimmed.slice(0, colonIdx).replace(/^[-•]\s*/, "");
                const val = trimmed.slice(colonIdx + 1).trim();
                return `<div class="budget-item"><span class="budget-label">${label}:</span> ${val}</div>`;
              }
              return `<div class="budget-item">${trimmed.replace(/^[-•]\s*/, "")}</div>`;
            }).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Days -->
        ${itinerary.days.map(day => `
        <div class="section">
          <div class="day-block">
            <div class="day-header-bar">
              <span class="day-num">Day ${day.dayNumber}</span>
              ${day.dayTitle}
            </div>

            <div class="cards-row">
              <!-- Places -->
              <div class="card places-card">
                <div class="card-header">
                  <span class="card-emoji">📍</span>
                  <span class="card-title">Places to Visit</span>
                </div>
                <div class="card-body">
                  ${formatTextForPDF(day.places)}
                </div>
              </div>

              <!-- Food -->
              <div class="card food-card">
                <div class="card-header">
                  <span class="card-emoji">🍽️</span>
                  <span class="card-title">Food & Dining</span>
                </div>
                <div class="card-body">
                  ${formatTextForPDF(day.food)}
                </div>
              </div>

              <!-- Tips -->
              <div class="card tips-card">
                <div class="card-header">
                  <span class="card-emoji">💡</span>
                  <span class="card-title">Extra Tips</span>
                </div>
                <div class="card-body">
                  ${formatTextForPDF(day.tips)}
                </div>
              </div>
            </div>

            ${day.dayTip ? `
            <div class="day-tip-box">
              <span class="day-tip-label">💫 Day Tip:</span>${day.dayTip}
            </div>
            ` : ""}
          </div>
        </div>
        `).join("")}

        <!-- Footer -->
        <div class="footer">
          Generated by Wandrr &nbsp;|&nbsp; Happy Travels! 🌍
        </div>

      </body>
      </html>
    `;

    // Open in new window and print as PDF
    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  // Helper: convert plain text lines to styled HTML for PDF
  const formatTextForPDF = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .filter(l => l.trim())
      .map(line => {
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
            {itinerary.budgetBreakdown && (
              <div className="budget-section">
                <h3>💰 Budget Breakdown</h3>
                <div className="budget-content">
                  {formatCardContent(itinerary.budgetBreakdown)}
                </div>
              </div>
            )}

            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="day-section">
                <h3 className="day-header">
                  DAY {day.dayNumber}: {day.dayTitle}
                </h3>

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