import React, { useState, useEffect } from "react";

const DemoMode = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDemoSequenceActive, setIsDemoSequenceActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkSequenceState = () => {
      const isActive = localStorage.getItem('tina-demo-sequence-active') === 'true';
      setIsDemoSequenceActive(isActive);
      
      // Set visibility with a slight delay for fade-in effect
      if (!isActive) {
        setTimeout(() => setIsVisible(true), 100);
      } else {
        setIsVisible(false);
      }
    };

    // Check on mount
    checkSequenceState();

    // Listen for changes
    const handleSequenceChange = (event: CustomEvent) => {
      const isActive = event.detail.isActive;
      setIsDemoSequenceActive(isActive);
      
      if (!isActive) {
        // Fade in when sequence ends
        setTimeout(() => setIsVisible(true), 300);
      } else {
        // Immediately hide when sequence starts
        setIsVisible(false);
      }
    };

    window.addEventListener('tina-demo-sequence-change', handleSequenceChange as EventListener);

    // Also check periodically in case events are missed
    const interval = setInterval(checkSequenceState, 1000);

    return () => {
      window.removeEventListener('tina-demo-sequence-change', handleSequenceChange as EventListener);
      clearInterval(interval);
    };
  }, []);

  // Don't render if demo sequence is active
  if (isDemoSequenceActive) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 165, 0, 0.9)',
        color: 'white',
        padding: '12px 16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        animation: !isHovered ? 'colorPulse 2s infinite' : 'none',
        boxShadow: '0 -2px 8px rgba(255, 165, 0, 0.3)',
        opacity: isHovered ? 0 : (isVisible ? 1 : 0),
        transition: 'opacity 0.5s ease-in-out',
        cursor: 'not-allowed',
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      This is a TinaCMS demo, changes won't be saved
      
      <style jsx>{`
        @keyframes colorPulse {
          0% {
            background-color: rgba(255, 165, 0, 0.9);
            box-shadow: 0 -2px 8px rgba(255, 165, 0, 0.3);
          }
          50% {
            background-color: rgba(255, 140, 0, 1);
            box-shadow: 0 -2px 12px rgba(255, 140, 0, 0.5);
          }
          100% {
            background-color: rgba(255, 165, 0, 0.9);
            box-shadow: 0 -2px 8px rgba(255, 165, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default DemoMode;
