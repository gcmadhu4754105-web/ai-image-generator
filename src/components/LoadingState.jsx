import React, { useState, useEffect } from 'react';

const LOADING_STEPS = [
  "Connecting to AI generation engine...",
  "Processing text prompt tokens...",
  "Running latent diffusion sampling...",
  "Synthesizing high-resolution details...",
  "Applying color grading & lighting...",
  "Finalizing artwork render..."
];

export default function LoadingState({ prompt }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card loading-box">
      <div className="loader-canvas-placeholder">
        <div className="spinner-ring" />
      </div>

      <div className="loading-status-text">
        {LOADING_STEPS[stepIndex]}
      </div>

      <div className="loading-subtext">
        Creating image for: "{prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}"
      </div>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" />
      </div>
    </div>
  );
}
