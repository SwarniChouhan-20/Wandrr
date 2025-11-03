import React from 'react';
import { Plane, MapPin } from 'lucide-react'; 
// NOTE: Temporarily commenting out routing imports/hooks to fix the "Must be used within a Router" error 
// in the preview environment. Uncomment the line below when integrating this component back into your app.
 import { useNavigate } from "react-router-dom"; 


export default function Home() {
  // Retain the original routing hook (commented out for preview)
   const navigate = useNavigate();

  // Retain the original routing logic (adapted for temporary preview)
  const handleStartPlanning = () => {
    /* --- Routing Logic ---
      This function is currently console logging instead of navigating 
      to prevent the "Must be used within a Router" error in this preview environment. 
      UNCOMMENT the code blocks below when integrating this file back into your main application.
    */

     const token = localStorage.getItem('token');
    
     if (token) {
       navigate("/plan-trip");
     } else {
       navigate("/login");
     }

    console.log("Routing temporarily disabled. Start Planning clicked!");
    console.log("Action: Check localStorage token and navigate to /plan-trip or /login.");
  };

  return (
    <>
      <style>
        {`
          /* --- Global Styling and Variables --- */
          :root {
              --color-primary-indigo: #4f46e5; /* Indigo 600 */
              --color-primary-purple: #9333ea; /* Purple 600 */
              --color-secondary-blue: #3b82f6; /* Blue 500 */
              --color-text-dark: #1f2937; /* Gray 900 */
              --color-white: #ffffff;
          }
          
          /* Set a global fluid design and smooth scrolling */
          body {
            scroll-behavior: smooth;
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb; /* Light background */
          }

          .home-container-styled {
              min-height: 100vh;
              padding: 20px;
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }
          
          /* Background blur/gradient effect to match brand theme */
          .home-container-styled::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                radial-gradient(at 0% 100%, rgba(199, 210, 254, 0.5) 0%, transparent 40%),
                radial-gradient(at 100% 0%, rgba(221, 214, 254, 0.5) 0%, transparent 40%);
              z-index: 0;
              pointer-events: none;
          }

          .content-area {
              max-width: 800px; 
              width: 100%;
              margin: 0 auto;
              text-align: center;
              position: relative;
              z-index: 10;
              /* Padding to push content down past a fixed header if one exists */
              padding-top: 100px; 
              padding-bottom: 50px; /* Added padding to ensure scroll visibility */
          }

          /* --- Hero Section Styling --- */
          .hero-tagline {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              font-size: 1.125rem;
              font-weight: 600;
              color: var(--color-primary-purple);
              margin-bottom: 24px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
          }

          .hero-plane-icon {
              width: 24px;
              height: 24px;
              color: var(--color-secondary-blue);
              transform: rotate(45deg);
          }

          .hero-title {
              font-size: 4.5rem; 
              font-weight: 900; 
              line-height: 1.05;
              margin-bottom: 24px;
              
              /* Gradient text effect from About page */
              background: linear-gradient(to right, var(--color-secondary-blue), var(--color-primary-purple), var(--color-primary-indigo));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
          }
          @media (min-width: 768px) {
              .hero-title {
                  font-size: 5.5rem; 
              }
          }

          .hero-subtitle {
              font-size: 1.5rem; 
              color: var(--color-text-dark);
              max-width: 800px; 
              margin: 0 auto 40px auto;
              font-weight: 300;
              line-height: 1.4;
          }
          
          .hero-description {
              font-size: 1.125rem;
              color: var(--color-text-dark);
              margin-bottom: 64px;
          }

          /* --- CTA Button Styling (Replacing start-btn) --- */
          .start-btn-styled {
              display: inline-flex;
              align-items: center;
              gap: 12px;
              padding: 24px 48px;
              font-size: 1.375rem; 
              font-weight: 700;
              color: var(--color-white);
              border-radius: 9999px; /* Pill shape */
              text-decoration: none;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              cursor: pointer;
              border: none;
              
              /* Primary gradient style */
              background: linear-gradient(to right, var(--color-secondary-blue), var(--color-primary-purple));
              box-shadow: 0 15px 30px -5px rgba(139, 92, 246, 0.4), 0 4px 6px -2px rgba(139, 92, 246, 0.2); 
              
              transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .start-btn-styled:hover {
              transform: translateY(-3px) scale(1.02);
              box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.6); 
          }

          .cta-icon {
              width: 28px;
              height: 28px;
          }
        `}
      </style>
      
      {/* Updated className to distinguish the styled version */}
      <div className="home-container-styled">
        <div className="content-area">

          {/* New Tagline based on style */}
          <p className="hero-tagline">
            <Plane className="hero-plane-icon"/>
            Your Personalized Journey Starts Here
          </p>
          
          {/* Mapping original elements to new styles */}
          <h1 className="hero-title">Wandrr</h1>
          <h2 className="hero-subtitle">Your Next Adventure Awaits</h2>
          
          <p className="hero-description">
            Create dynamic, personalized itineraries that adapt to your mood, weather, and wanderlust. 
            Discover hidden gems and trending destinations tailored just for you.
          </p>
          
          {/* Updated button with new styling and original handler */}
          {/* Icons are now used correctly as JSX components */}
          <button className="start-btn-styled" onClick={handleStartPlanning}>
            <MapPin className="cta-icon"/>
            <span>Start Planning</span>
          </button>
        </div>
      </div>
    </>
  );
}
