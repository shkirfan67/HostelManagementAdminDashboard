import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./backbutton.css";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setHistoryIndex(prev => prev + 1);
  }, [location.key]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < window.history.length - 1;

  return (
    <div className="nav-minimal">
      <button
        onClick={() => navigate(-1)}
        disabled={!canGoBack}
        className={`nav-btn-mini ${!canGoBack ? 'nav-btn-mini--disabled' : ''}`}
        title="Go back"
      >
        <span className="nav-icon-mini">←</span>
      </button>
      
      <button
        onClick={() => navigate(1)}
        disabled={!canGoForward}
        className={`nav-btn-mini ${!canGoForward ? 'nav-btn-mini--disabled' : ''}`}
        title="Go forward"
      >
        <span className="nav-icon-mini">→</span>
      </button>
    </div>
  );
};

export default BackButton;
