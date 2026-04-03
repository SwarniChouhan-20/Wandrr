import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: { type: String, required: true },
    origin:      { type: String, required: true },
    duration:    { type: Number, required: true },
    mood:        { type: String },
    budget:      { type: Number },
    travelType:  { type: String },
    foodPreferences: [{ type: String }],

    // Full raw AI response text (useful for re-rendering / search)
    rawText: { type: String },

    // Structured parsed data
    parsedItinerary: {
      transportSection: { type: String },
      budgetBreakdown:  { type: String },
      days: [
        {
          dayNumber: String,
          dayTitle:  String,
          places:    String,
          food:      String,
          tips:      String,
          dayTip:    String,
        },
      ],
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
export default Itinerary;