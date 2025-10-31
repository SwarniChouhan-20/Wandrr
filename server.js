import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// NOTE: It is best practice to load this from an environment variable (process.env.GEMINI_API_KEY)
// For this example, we keep it here, but remember to replace the placeholder value.
const GEMINI_API_KEY = "AIzaSyCoekjWF4yyj2Chq2oDhaxpo2PIKZ8J0hI";

app.post("/api/itinerary", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Log the incoming prompt to ensure the client is sending data
    console.log(`Received prompt from client: ${prompt.substring(0, 50)}...`);

    // --- FIX APPLIED HERE: Model is gemini-2.5-flash ---
    // The current recommended and stable model ID.
    const API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The X-Goog-Api-Key header is correct for the v1beta endpoint
        "X-Goog-Api-Key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // Check if the response status is 200 (OK)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Error Body:", JSON.stringify(errorData, null, 2));
      // Throw an error with the specific status and message from the API
      throw new Error(
        `API call failed with status ${response.status}. See console for details.`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    // Log the full error object for better debugging
    console.error("--- Server Caught Error ---");
    console.error(err);
    res.status(500).json({ error: "Server error during API call. Check server console for details." });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
