// routes/itineraryRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// ─── Auth middleware ──────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // adjust if your JWT payload uses a different key
    next();
  } catch {
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

// ─── POST /api/itineraries — save a new itinerary ───────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const {
      destination, origin, duration, mood, budget,
      travelType, foodPreferences, rawText, parsedItinerary,
    } = req.body;

    const itinerary = await Itinerary.create({
      userId: req.userId,
      destination,
      origin,
      duration,
      mood,
      budget,
      travelType,
      foodPreferences,
      rawText,
      parsedItinerary,
    });

    res.status(201).json({ success: true, itinerary });
  } catch (err) {
    console.error("Save itinerary error:", err);
    res.status(500).json({ error: "Failed to save itinerary" });
  }
});

// ─── GET /api/itineraries — get all itineraries for logged-in user ───────────
router.get("/", protect, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("-rawText"); // exclude heavy raw text from list view
    res.json({ success: true, itineraries });
  } catch (err) {
    console.error("Fetch itineraries error:", err);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

// ─── GET /api/itineraries/:id — get single itinerary ─────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    res.json({ success: true, itinerary });
  } catch (err) {
    console.error("Fetch itinerary error:", err);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

// ─── DELETE /api/itineraries/:id ─────────────────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    res.json({ success: true, message: "Itinerary deleted" });
  } catch (err) {
    console.error("Delete itinerary error:", err);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

export default router;