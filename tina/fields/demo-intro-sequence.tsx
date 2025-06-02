import React, { useState, useEffect } from 'react';

interface DemoStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const demoSteps: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Tina Demo!',
    content: 'This is a demonstration of the Tina CMS editor.\n You can explore the interface, but please note that new pages and content cannot be saved in this demo environment.',
    position: 'center'
  },
  {
    id: 'save-bar',
    title: 'Save Controls',
    content: 'This is where you would normally save your changes. In demo mode, saves are disabled to prevent modifications.',
    target: 'save-bar',
    position: 'top'
  },
  {
    id: 'collection-menu',
    title: 'Collection Menu',
    content: 'Here you can navigate between different collections and content types. Try exploring the available collections!',
    target: 'collection-menu',
    position: 'bottom'
  },
  {
    id: 'content-area',
    title: 'Content Editor',
    content: 'This is the main content editing area where you can modify your content using Tina\'s intuitive interface. Feel free to explore!',
    target: 'content-area',
    position: 'left'
  }
];

interface DemoIntroSequenceProps {
  onComplete?: () => void;
  isActive?: boolean;
  forceShow?: boolean; // Allow forcing the demo to show even if completed
}

export const DemoIntroSequence: React.FC<DemoIntroSequenceProps> = ({ 
  onComplete, 
  isActive = true,
  forceShow = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if demo has been completed before
  useEffect(() => {
    const hasCompletedDemo = localStorage.getItem('tina-demo-completed') === 'true';
    
    if (!forceShow && hasCompletedDemo) {
      setIsVisible(false);
      setDemoSequenceActive(false);
    } else {
      setIsVisible(true);
      setDemoSequenceActive(true);
    }
  }, [isActive, forceShow]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      setDemoSequenceActive(false);
    };
  }, []);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 500);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleComplete = () => {
    // Mark demo as completed in localStorage
    localStorage.setItem('tina-demo-completed', 'true');
    localStorage.setItem('tina-demo-completed-date', new Date().toISOString());
    
    setIsCompleting(true);
    setTimeout(() => {
      setIsVisible(false);
      setDemoSequenceActive(false);
      onComplete?.();
    }, 800);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = demoSteps[currentStep];
  const isLastStep = currentStep === demoSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Overlay to prevent interaction */}
      <div 
        className={`fixed w-screen h-screen inset-0 bg-black/40 z-[9998] transition-all duration-700 ease-out ${
          isCompleting ? 'opacity-0' : (isAnimating ? 'opacity-90' : 'opacity-100')
        }`}
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Backdrop blur overlay with cutout for focused area */}
      {currentStepData.target ? (
        <div 
          className={`fixed inset-0 pointer-events-none z-[9997] transition-all duration-700 ease-out ${
            isCompleting ? 'opacity-0' : (isAnimating ? 'opacity-70' : 'opacity-100')
          }`
        }
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            mask: currentStepData.target === 'content-area'
              ? `radial-gradient(ellipse 400px 320px at 20% 30%, transparent 200px, black 120px)`
              : `radial-gradient(circle at ${getTargetPosition(currentStepData.target)}, transparent 120px, black 160px)`,
            WebkitMask: currentStepData.target === 'content-area'
              ? `radial-gradient(ellipse 400px 320px at 20% 30%, transparent 200px, black 140px)`
              : `radial-gradient(circle at ${getTargetPosition(currentStepData.target)}, transparent 120px, black 160px)`
          }}
        />
      ) : (
        <div 
          className={`fixed inset-0 pointer-events-none z-[9997] backdrop-blur-sm transition-all duration-700 ease-out ${
            isCompleting ? 'opacity-0' : (isAnimating ? 'opacity-70' : 'opacity-100')
          }`}
        />
      )}
      
      {/* Demo Dialog */}
      <div 
        className={`fixed z-[9999] bg-[#e2e8f0]/80 backdrop-blur-md rounded-2xl shadow-2xl h-[400px] border border-gray-200/50 w-80 p-8 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform top-1/2 -translate-y-1/2 flex flex-col lg:translate-x-[115%] md:translate-x-[90%] ${
          isCompleting
            ? 'opacity-0'
            : 'opacity-100'
        }`}
        style={{ 
          pointerEvents: 'auto',
          right: '16px'
        }}
      >
        {/* Header */}
        <div className={`flex items-start justify-between mb-6 transition-all duration-1000 delay-100 ease-out ${
          isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {currentStepData.title}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Demo Mode</span>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            aria-label="Skip tour"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - flexible area */}
        <div className={`flex-1 box-border w-full max-w-full overflow transition-all duration-10000 delay-200 ease-out ${
          isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          <p className="text-gray-700 text-base leading-relaxed" style={{
            hyphens: 'none',
            margin: 0,
            lineHeight: '1.6',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}>
            {currentStepData.content}
          </p>
        </div>

        {/* Progress Indicator - pushed to bottom */}
        <div className={`flex items-center justify-between mb-6 transition-all duration-500 delay-300 ease-out ${
          isAnimating ? 'opacity-60 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          <div className="flex space-x-3">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  index === currentStep 
                    ? 'w-8 bg-blue-500' 
                    : index < currentStep 
                    ? 'w-2 bg-blue-300' 
                    : 'w-2 bg-gray-400'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {currentStep + 1} of {demoSteps.length}
          </span>
        </div>

        {/* Navigation Buttons - at bottom */}
        <div className={`flex justify-between items-center space-x-4 transition-all duration-500 delay-400 ease-out ${
          isAnimating ? 'opacity-60 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isFirstStep
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            ← Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            {isLastStep ? 'Explore →' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Highlight ring for targeted elements */}
      {currentStepData.target ? (
        <HighlightOverlay target={currentStepData.target} isAnimating={isAnimating} isCompleting={isCompleting} />
      ) : (
        // Render empty highlight overlay to handle fade-out when no target
        <HighlightOverlay target="" isAnimating={isAnimating} isCompleting={isCompleting} />
      )}
    </>
  );
};

// Helper component to highlight specific areas
const HighlightOverlay: React.FC<{ target: string; isAnimating: boolean; isCompleting: boolean }> = ({ target, isAnimating, isCompleting }) => {
  const isContentArea = target === 'content-area';
  const [isVisible, setIsVisible] = useState(false);
  
  // Fade in the highlights after a brief delay, but only if there's a target
  useEffect(() => {
    if (!target) {
      setIsVisible(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [target]);
  
  // Reset visibility when target changes
  useEffect(() => {
    setIsVisible(false);
    
    if (!target) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [target]);
  
  // Don't render anything if there's no target
  if (!target) return null;
  
  return (
    <>
      {/* Bright white spotlight that moves with the target */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9996]"
        style={{
          background: isContentArea 
            ? `radial-gradient(ellipse 400px 300px at ${getTargetPosition(target)}, 
                rgba(255, 255, 255, 0.4) 0px,
                rgba(255, 255, 255, 0.25) 60px,
                rgba(255, 255, 255, 0.15) 100px,
                rgba(255, 255, 255, 0.05) 140px,
                transparent 180px
              )`
            : `radial-gradient(circle at ${getTargetPosition(target)}, 
                rgba(255, 255, 255, 0.4) 0px,
                rgba(255, 255, 255, 0.25) 60px,
                rgba(255, 255, 255, 0.15) 100px,
                rgba(255, 255, 255, 0.05) 140px,
                transparent 180px
              )`,
          transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: isCompleting ? 0 : (isVisible ? 1 : 0)
        }}
      />
      
      {/* White highlight rings/rectangles */}
      <div className={`fixed inset-0 pointer-events-none z-[9998] transition-all duration-700 ease-out ${
        isCompleting ? 'opacity-0 scale-95' : (isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95')
      }`}>
        {isContentArea ? (
          <>
            {/* Outer rectangle with white glow */}
            <div 
              className={`absolute border-2 border-white/60 animate-pulse transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                width: '350px',
                height: '500px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 250px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 175px)`,
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.3)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
            
            {/* Inner rectangle with bright white glow */}
            <div 
              className={`absolute border-2 border-white/80 transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                width: '310px',
                height: '460px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 230px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 155px)`,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
            
            {/* Central bright white rectangle */}
            <div 
              className={`absolute bg-white/20 transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-30 scale-95' : 'opacity-70 scale-100'
              }`}
              style={{
                width: '250px',
                height: '400px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 200px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 125px)`,
                boxShadow: '0 0 50px rgba(255, 255, 255, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
                filter: 'blur(8px)'
              }}
            />
          </>
        ) : (
          <>
            {/* Outer ring with white glow */}
            <div 
              className={`absolute border-2 border-white/60 rounded-full animate-pulse transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                width: '280px',
                height: '280px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 140px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 140px)`,
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.3)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
            
            {/* Inner ring with bright white glow */}
            <div 
              className={`absolute border-2 border-white/80 rounded-full transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                width: '240px',
                height: '240px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 120px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 120px)`,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
            
            {/* Central bright white spot */}
            <div 
              className={`absolute bg-white/20 rounded-full transition-all duration-700 ease-out ${
                isAnimating ? 'opacity-30 scale-95' : 'opacity-70 scale-100'
              }`}
              style={{
                width: '160px',
                height: '160px',
                left: `calc(${getTargetPosition(target).split(' ')[0]} - 80px)`,
                top: `calc(${getTargetPosition(target).split(' ')[1]} - 80px)`,
                boxShadow: '0 0 50px rgba(255, 255, 255, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
                filter: 'blur(8px)'
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

// Helper function to get target position for highlight
function getTargetPosition(target: string): string {
  switch (target) {
    case 'save-bar':
      return '68% 100%';
    case 'collection-menu':
      return '10% 5%';
    case 'content-area':
      return '65% 30%';
    default:
      return '50% 50%';
  }
}

const DemoIntroWrapper = (props) => {
    props.input.onChange(true);
    return <DemoIntroSequence />
}

export default DemoIntroWrapper;

// Utility functions for managing demo state
export const resetTinaDemo = () => {
  localStorage.removeItem('tina-demo-completed');
  localStorage.removeItem('tina-demo-completed-date');
};

export const hasTinaDemoBeenCompleted = () => {
  return localStorage.getItem('tina-demo-completed') === 'true';
};

export const getTinaDemoCompletionDate = () => {
  const dateString = localStorage.getItem('tina-demo-completed-date');
  return dateString ? new Date(dateString) : null;
};

// Global state management for demo sequence visibility
export const setDemoSequenceActive = (isActive: boolean) => {
  if (isActive) {
    localStorage.setItem('tina-demo-sequence-active', 'true');
  } else {
    localStorage.removeItem('tina-demo-sequence-active');
  }
  
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new CustomEvent('tina-demo-sequence-change', { 
    detail: { isActive } 
  }));
};

export const isDemoSequenceActive = () => {
  return localStorage.getItem('tina-demo-sequence-active') === 'true';
};
