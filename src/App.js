import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import PlanTrip from "./components/PlanTrip";
import PlanSummary from "./pages/PlanSummary";
import Login from "./components/login";
import Signup from "./components/Signup";
import AboutUs from "./components/about";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/plan-summary" element={<PlanSummary />} />
          <Route path="*" element={<Home />} />  {/* default redirect */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}
