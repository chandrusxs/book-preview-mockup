import React, { useState, useEffect, useRef } from 'react';

// --- EYE ALIGNMENT CONFIGURATION ---
// Tweak these values if the animated eyes don't perfectly align with the image's eyes!
// rx and ry control the width/height of the eye cutout.
// cx and cy control the position.
const LEFT_EYE = { cx: '35%', cy: '36%', rx: '8%', ry: '10%' };
const RIGHT_EYE = { cx: '65%', cy: '36%', rx: '8%', ry: '10%' };
const MAX_EYE_MOVE = 7; // Maximum pixels the eye can move to track the mouse
// -----------------------------------

const PandaReal = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef(null);

  // Blinking logic: "blink slow ah"
  useEffect(() => {
    let timeout;
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300); // 300ms is a smooth, slow blink
      
      const nextBlink = Math.random() * 4000 + 3000;
      timeout = setTimeout(blink, nextBlink);
    };
    timeout = setTimeout(blink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Mouse tracking: "mouse traccktion speed equal to the cursor" (Instant)
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const faceX = rect.left + rect.width / 2;
    const faceY = rect.top + rect.height / 3;

    const deltaX = mousePos.x - faceX;
    const deltaY = mousePos.y - faceY;
    
    const percentX = deltaX / (window.innerWidth / 2);
    const percentY = deltaY / (window.innerHeight / 2);
    
    const clampedX = Math.max(-1, Math.min(1, percentX));
    const clampedY = Math.max(-1, Math.min(1, percentY));

    setPupilOffset({
      x: clampedX * MAX_EYE_MOVE,
      y: clampedY * MAX_EYE_MOVE
    });
  }, [mousePos]);

  return (
    <div 
      className="panda-container" 
      style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
    >
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '280px', 
          height: '280px',
          filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))'
        }}
      >
        {/* Base Image */}
        <img 
          src="/panda_real.png" 
          alt="Cute Panda" 
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain' }} 
        />
        
        {/* White patches to hide the original eyes underneath when the animated eyes move */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'white',
          clipPath: `ellipse(${LEFT_EYE.rx} ${LEFT_EYE.ry} at ${LEFT_EYE.cx} ${LEFT_EYE.cy})`
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'white',
          clipPath: `ellipse(${RIGHT_EYE.rx} ${RIGHT_EYE.ry} at ${RIGHT_EYE.cx} ${RIGHT_EYE.cy})`
        }} />

        {/* Animated Eyes Layer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          // Scale Y to 0 when blinking to create a smooth eyelid closing effect
          transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px) scaleY(${isBlinking ? 0 : 1})`,
          transformOrigin: '50% 36%', 
          // Use a very snappy transition for tracking to match mouse speed perfectly, but keep blink smooth
          transition: isBlinking ? 'transform 0.15s ease-in' : 'transform 0.05s linear' 
        }}>
          {/* Left Eye Cutout */}
          <img 
            src="/panda_real.png" 
            style={{ 
              width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain',
              clipPath: `ellipse(${LEFT_EYE.rx} ${LEFT_EYE.ry} at ${LEFT_EYE.cx} ${LEFT_EYE.cy})`
            }} 
          />
          {/* Right Eye Cutout */}
          <img 
            src="/panda_real.png" 
            style={{ 
              width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain',
              clipPath: `ellipse(${RIGHT_EYE.rx} ${RIGHT_EYE.ry} at ${RIGHT_EYE.cx} ${RIGHT_EYE.cy})`
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PandaReal;
