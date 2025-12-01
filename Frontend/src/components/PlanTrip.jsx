import React, { useState } from "react";
import PlanStep1 from "../pages/PlanStep1.jsx";
import PlanStep2 from "../pages/PlanStep2.jsx";
import PlanStep3 from "../pages/PlanStep3.jsx";
import PlanSummary from "../pages/PlanSummary.jsx";
import "./PlanTrip.css";

const PlanTrip = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <div className="plan-trip-container">
      {step === 1 && (
        <PlanStep1 onNext={() => setStep(2)} formData={formData} setFormData={setFormData} />
      )}
      {step === 2 && (
        <PlanStep2
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 3 && (
        <PlanStep3
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 4 && (
        <PlanSummary
          formData={formData}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
};

export default PlanTrip;
