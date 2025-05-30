import React, { useState } from "react";
import { ImageField, wrapFieldsWithMeta } from "tinacms";

const ImagePickerInput = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);

  // Disable the media manager by overriding the onClick behavior
  const disabledProps = {
    ...props,
    // Prevent the media manager from opening
    input: {
      ...props.input,
      onChange: () => {}, // Disable changes
    },
    // Override any click handlers
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block', padding: '12px', marginBottom: '10px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ pointerEvents: 'none' }}>
        <ImageField {...disabledProps} />
      </div>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            padding: '8px 16px',
            animation: isHovered ? 'colorPulse 2s infinite' : 'none',
            width: '100%',
            maxWidth: '100%',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(255, 165, 0, 0.3)',
            boxSizing: 'border-box',
          }}
        >
          <p style={{ 
            hyphens: 'none',
            margin: 0,
            lineHeight: '1.2',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}>Media management only available in the full version of TinaCMS</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes colorPulse {
          0% {
            background-color: rgba(255, 165, 0, 0.9);
            box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
          }
          50% {
            background-color: rgba(255, 140, 0, 1);
            box-shadow: 0 2px 12px rgba(255, 140, 0, 0.5);
          }
          100% {
            background-color: rgba(255, 165, 0, 0.9);
            box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default ImagePickerInput;