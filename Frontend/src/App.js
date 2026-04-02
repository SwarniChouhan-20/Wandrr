import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import PlanTrip from "./components/PlanTrip";
import PlanSummary from "./pages/PlanSummary";
import Login from "./components/login";
import Signup from "./components/Signup";
import AboutUs from "./components/about";
import Feedback from "./components/Feedback";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/plan-trip"
            element={
              <PrivateRoute>
                <PlanTrip />
              </PrivateRoute>
            }
          />
          <Route
            path="/plan-summary"
            element={
              <PrivateRoute>
                <PlanSummary />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
