import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Existing Itinerary Route
app.post("/api/itinerary", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(`Received prompt from client: ${prompt.substring(0, 50)}...`);

    const API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GEMINI_API_KEY, // Now using .env
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Error Body:", JSON.stringify(errorData, null, 2));
      throw new Error(
        `API call failed with status ${response.status}. See console for details.`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("--- Server Caught Error ---");
    console.error(err);
    res.status(500).json({ error: "Server error during API call. Check server console for details." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));