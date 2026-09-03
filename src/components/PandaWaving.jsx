import React, { useState, useEffect, useRef } from 'react';

const PandaWaving = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const svgRef = useRef(null);

  // Blinking logic
  useEffect(() => {
    let timeout;
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // fast blink
      const nextBlink = Math.random() * 4000 + 2000;
      timeout = setTimeout(blink, nextBlink);
    };
    timeout = setTimeout(blink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Mouse tracking logic
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const faceX = rect.left + rect.width / 2;
    const faceY = rect.top + rect.height / 3;

    const deltaX = mousePos.x - faceX;
    const deltaY = mousePos.y - faceY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    
    const maxOffset = 5;
    const offsetDistance = Math.min(distance / 50, maxOffset); 
    
    setPupilOffset({
      x: Math.cos(angle) * offsetDistance,
      y: Math.sin(angle) * offsetDistance
    });
  }, [mousePos]);

  return (
    <div className="panda-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
      <svg 
        ref={svgRef}
        width="180" 
        height="180" 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
      >
        <g transform="rotate(10 100 100)">
          {/* Right Leg */}
          <ellipse cx="120" cy="160" rx="15" ry="25" fill="black" transform="rotate(-15 120 160)" />
          {/* Left Leg */}
          <ellipse cx="80" cy="160" rx="15" ry="25" fill="black" transform="rotate(15 80 160)" />
          
          {/* Right Arm (resting) */}
          <path d="M 125 110 Q 150 140 145 160 Q 135 170 110 150 Z" fill="black" />
          
          {/* Left Arm (waving up) */}
          <path d="M 75 100 C 40 80, 20 20, 40 10 C 60 0, 80 40, 85 90 Z" fill="black" />
          
          {/* Body */}
          <ellipse cx="100" cy="120" rx="45" ry="50" fill="white" stroke="black" strokeWidth="6" />
          
          {/* Head Base & Ears */}
          <circle cx="55" cy="45" r="20" fill="black" />
          <circle cx="145" cy="45" r="20" fill="black" />

          {/* Head */}
          <ellipse cx="100" cy="85" rx="65" ry="55" fill="white" stroke="black" strokeWidth="6" />
          
          {/* Pink Cheeks */}
          <ellipse cx="55" cy="95" rx="12" ry="8" fill="#ffb3c6" />
          <ellipse cx="145" cy="95" rx="12" ry="8" fill="#ffb3c6" />

          {/* Eyes (if blinking, show closed eyes, else open) */}
          {!isBlinking ? (
            <>
              {/* Eye Patches */}
              <ellipse cx="70" cy="80" rx="16" ry="22" fill="black" transform="rotate(-25 70 80)" />
              <ellipse cx="130" cy="80" rx="16" ry="22" fill="black" transform="rotate(25 130 80)" />
              
              {/* Pupils with slow tracking transition */}
              <g style={{ transition: 'transform 0.4s ease-out' }} transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                <circle cx="73" cy="77" r="4" fill="white" />
                <circle cx="127" cy="77" r="4" fill="white" />
              </g>
            </>
          ) : (
            <>
              {/* Closed Eyes */}
              <path d="M 55 80 Q 70 90 85 80" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
              <path d="M 115 80 Q 130 90 145 80" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="100" cy="90" rx="6" ry="4" fill="black" />
          
          {/* Mouth */}
          <path d="M 90 100 Q 95 105 100 100 Q 105 105 110 100" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default PandaWaving;
