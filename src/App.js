import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import PlanTrip from "./components/PlanTrip";
import PlanSummary from "./pages/PlanSummary";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/plan-summary" element={<PlanSummary />} />
        </Routes>
      </div>
    </Router>
  );
}
