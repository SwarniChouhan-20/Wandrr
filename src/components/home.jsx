import React from 'react';
import { Plane, MapPin, Compass, Globe, Sparkles } from 'lucide-react'; 
import { useNavigate } from "react-router-dom"; 
import './home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      navigate("/plan-trip");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container-modern">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Animated Badge */}
        <div className="hero-badge">
          <Sparkles className="badge-icon" />
          <span>AI-Powered Travel Planning</span>
        </div>

        {/* Main Title with Gradient */}
        <h1 className="hero-title-modern">
          Plan Your Dream
          <span className="gradient-text"> Adventure</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle-modern">
          Discover personalized itineraries crafted by AI, tailored to your mood, 
          budget, and travel style. Your perfect journey starts here.
        </p>

        {/* Feature Pills */}
        <div className="feature-pills">
          <div className="pill">
            <Compass className="pill-icon" />
            <span>Smart Itineraries</span>
          </div>
          <div className="pill">
            <Globe className="pill-icon" />
            <span>Global Destinations</span>
          </div>
          <div className="pill">
            <Sparkles className="pill-icon" />
            <span>AI Recommendations</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="cta-button-modern" onClick={handleStartPlanning}>
          <span className="button-content">
            <MapPin className="button-icon" />
            Start Your Journey
            <Plane className="button-plane" />
          </span>
          <div className="button-glow"></div>
        </button>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <strong>10K+</strong>
            <span>Trips Planned</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <strong>150+</strong>
            <span>Countries</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <strong>4.9★</strong>
            <span>User Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}