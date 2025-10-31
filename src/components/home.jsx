import { useNavigate } from "react-router-dom";
import "./home.css";
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
console.log(apiKey);
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="title">Wandrr</h1>
      <h2 className="tagline">Your next adventure awaits</h2>
      <p className="desc">
        Create dynamic, personalized itineraries that adapt to your mood, weather, and wanderlust. 
        Discover hidden gems and trending destinations tailored just for you.
      </p>
      <button className="start-btn" onClick={() => navigate("/plan-trip")}>
        Start Planning
      </button>
    </div>
  );
}
