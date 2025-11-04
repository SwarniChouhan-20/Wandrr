import React from 'react';
import { Sparkles, Map, Feather, UserCog, Rocket } from 'lucide-react'; 

// The main component must be named App and exported as default
const App = () => {
  // Define the features/values 
  const values = [
    {
      icon: UserCog,
      title: "Hyper-Personalization",
      description: "We dive deep into your travel mood—be it 'Romantic,' 'Adventure,' or 'Wellness'—to craft an itinerary that truly feels like yours. Your journey, your rules.",
      colorClass: "icon-purple", 
    },
    {
      icon: Feather,
      title: "Effortless Planning",
      description: "From setting your budget and duration to selecting specific food preferences, our simple 3-step interface takes the stress out of trip planning.",
      colorClass: "icon-indigo",
    },
    {
      icon: Map,
      title: "Global Discovery",
      description: "Whether you dream of the bustling streets of Tokyo or a remote, relaxing beach, our platform connects you with validated destinations and curated experiences worldwide.",
      colorClass: "icon-pink",
    },
  ];

  // Component to render a single Value Card
  const ValueCard = ({ icon: Icon, title, description, colorClass }) => (
    <div className="value-card">
      <Icon className={`value-icon ${colorClass}`} />
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );

  return (
    <>
      <style>
        {`
          /* --- Global Styling and Variables --- */
          :root {
              --color-primary-indigo: #4f46e5;
              --color-primary-purple: #9333ea;
              --color-secondary-blue: #3b82f6;
              --color-text-dark: #1f2937; /* Gray 900 */
              --color-text-medium: #4b5563; /* Gray 700 */
              --color-light-bg: #f9fafb; /* Gray 50 */
              --color-white: #ffffff;
          }
          
          /* FIX: Ensure smooth scrolling is enabled */
          body {
            scroll-behavior: smooth;
          }

          .about-container {
              min-height: 100vh;
              /* Increased top padding significantly to ensure content starts below fixed external navbar */
              padding: 120px 20px 40px; 
              position: relative;
              overflow: hidden;
              background-color: var(--color-light-bg);
              /* Subtle background gradient from the original CSS */
              background-image: radial-gradient(at 10% 10%, rgba(199, 210, 254, 0.4) 0%, transparent 50%),
                                radial-gradient(at 90% 90%, rgba(221, 214, 254, 0.4) 0%, transparent 50%);
              font-family: 'Inter', sans-serif;
          }

          .about-content {
              max-width: 1280px; 
              margin: 0 auto;
              position: relative;
              z-index: 10;
              display: flex;
              flex-direction: column;
              gap: 64px; 
          }

          /* --- Header Section --- */
          .header-section {
              text-align: center;
              /* Removed the redundant padding-top since it's now on the container */
              padding-top: 0; 
              padding-bottom: 24px;
          }

          .mission-tag {
              font-size: 0.875rem; 
              font-weight: 600;
              text-transform: uppercase;
              color: var(--color-primary-purple);
              letter-spacing: 0.1em;
              margin-bottom: 8px;
          }

          .hero-title {
              font-size: 4rem; 
              font-weight: 800; 
              margin-bottom: 20px;
              line-height: 1.1;
              /* Gradient text effect */
              background: linear-gradient(to right, #1d4ed8, var(--color-primary-purple));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
          }
          @media (min-width: 768px) {
              .hero-title {
                  font-size: 4.5rem; 
              }
          }

          .hero-subtitle {
              font-size: 1.25rem; 
              color: var(--color-text-medium);
              max-width: 896px; 
              margin: 0 auto;
              font-weight: 300;
          }

          /* --- Core Philosophy Block --- */
          .philosophy-block {
              /* Gradient background matching the design inspiration */
              background: linear-gradient(to bottom right, #4f46e5, #7c3aed);
              color: var(--color-white);
              padding: 64px;
              border-radius: 24px;
              box-shadow: 0 20px 25px -5px rgba(126, 34, 206, 0.2), 0 8px 10px -6px rgba(126, 34, 206, 0.1);
          }

          .philosophy-inner {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
          }

          .philosophy-icon {
              width: 64px;
              height: 64px;
              margin-bottom: 24px;
              color: #fde047; /* yellow-300 */
              transform: rotate(12deg);
          }

          .philosophy-title {
              font-size: 2.25rem; 
              font-weight: 800;
              margin-bottom: 12px;
          }

          .philosophy-subtitle {
              font-size: 1.25rem; 
              font-weight: 300;
              opacity: 0.9;
          }

          /* Adapt for medium screens and up */
          @media (min-width: 768px) {
              .philosophy-inner {
                  flex-direction: row;
                  text-align: left;
                  justify-content: space-between;
              }
              .philosophy-icon {
                  margin-bottom: 0;
              }
              .philosophy-text-area {
                  margin-left: 32px;
              }
          }

          /* --- Value Proposition Grid --- */
          .value-section {
              padding-top: 32px;
              padding-bottom: 32px;
          }

          .value-heading {
              font-size: 2.25rem; 
              font-weight: 700;
              text-align: center;
              margin-bottom: 48px;
              color: var(--color-text-dark);
          }

          .value-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 40px; 
          }

          /* Adapt for medium screens and up */
          @media (min-width: 768px) {
              .value-grid {
                  grid-template-columns: repeat(3, 1fr);
              }
          }

          /* Value Card Styling */
          .value-card {
              background-color: var(--color-white);
              padding: 32px;
              border-radius: 24px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
              border: 1px solid #f3f4f6; 
              cursor: pointer;
              transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1); 
          }

          .value-card:hover {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08); 
              transform: translateY(-4px);
          }

          .value-icon {
              width: 40px;
              height: 40px;
              margin-bottom: 16px;
          }

          /* Icon colors */
          .icon-purple { color: var(--color-primary-purple); }
          .icon-indigo { color: var(--color-primary-indigo); }
          .icon-pink { color: #db2777; } 

          .card-title {
              font-size: 1.25rem; 
              font-weight: 700;
              margin-bottom: 12px;
              color: var(--color-text-dark);
          }

          .card-description {
              font-size: 1rem; 
              color: var(--color-text-medium);
          }

          /* --- Team Note Section --- */
          .team-note-section {
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
              border: 1px solid #f3f4f6; 
              /* Subtle background gradient */
              background: linear-gradient(to bottom right, var(--color-white), #f9faff); 
          }

          .team-note-title {
              font-size: 1.875rem; 
              font-weight: 700;
              margin-bottom: 16px;
              color: var(--color-text-dark);
              padding-bottom: 8px;
              border-bottom: 2px solid #e9d5ff; 
          }

          .team-note-text {
              color: #374151; 
              line-height: 1.7;
              font-size: 1.125rem; 
          }

          /* --- CTA Section --- */
          .cta-section {
              text-align: center;
              padding-top: 40px;
              padding-bottom: 40px;
          }

          .cta-button {
              display: inline-flex;
              align-items: center;
              gap: 12px;
              padding: 20px 40px;
              font-size: 1.25rem; 
              font-weight: 700;
              color: var(--color-white);
              border-radius: 9999px; 
              text-decoration: none;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              cursor: pointer;

              /* Primary gradient style */
              background: linear-gradient(to right, var(--color-secondary-blue), var(--color-primary-purple));
              box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.5), 0 8px 10px -6px rgba(139, 92, 246, 0.3); 
              
              transition: all 0.3s ease-in-out;
          }

          .cta-button:hover {
              transform: scale(1.05);
              box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.7); 
          }

          .cta-icon {
              width: 28px;
              height: 28px;
          }
        `}
      </style>
      
      <div className="about-container">
        {/* Main content z-10 */}
        <div className="about-content">
          
          {/* Header Section */}
          <header className="header-section">
            <p className="mission-tag">Our Mission</p>
            <h1 className="hero-title">
              Travel, Reimagined.
            </h1>
            <p className="hero-subtitle">
              We cut the complexity and use the power of modern design and intelligence to craft a travel experience that is truly unique, memorable, and effortlessly personalized to your *exact* mood and budget.
            </p>
          </header>

          {/* Core Philosophy Section - Gradient Block */}
          <section className="philosophy-block">
            <div className="philosophy-inner">
              <Sparkles className="philosophy-icon"/>
              <div className="philosophy-text-area">
                <h2 className="philosophy-title">Beyond the Generic Itinerary</h2>
                <p className="philosophy-subtitle">
                  Our platform isn't just a booking tool; it's a dedicated AI planner. You tell us your budget, duration, and desired *vibe*, and we handle the intricate logistics for a seamless journey.
                </p>
              </div>
            </div>
          </section>

          {/* Value Proposition Grid */}
          <section className="value-section">
            <h2 className="value-heading">The Power of Choice & Simplicity</h2>
            <div className="value-grid">
              {values.map((value) => (
                <ValueCard key={value.title} {...value} />
              ))}
            </div>
          </section>

          {/* Founder/Team Message */}
          <section className="team-note-section">
              <h2 className="team-note-title">A Note from the Team</h2>
              <p className="team-note-text">
                We started this platform because we were tired of the "one-size-fits-all" travel guides. We envisioned a world where finding the perfect 'Cultural' trip with a 'Street Food' preference was as easy as a few clicks. Every feature, from the budget slider to the mood selector, is designed to respect your individuality and inspire you to travel better, not just more. Thank you for being part of our journey.
              </p>
          </section>

          {/* Final CTA - Button */}
          <section className="cta-section">
              <a 
                href="/plan-trip" 
                className="cta-button"
              >
                <Rocket className="cta-icon"/>
                <span>Plan Your Personalized Trip Today</span>
              </a>
          </section>

        </div>
      </div>
    </>
  );
};

export default App;
