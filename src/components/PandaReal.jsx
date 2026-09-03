import React, { useState, useEffect, useRef } from 'react';

// --- REALISTIC EYE CONFIGURATION ---
// rx and ry control the width/height of the eye overlay.
// cx and cy control the position.
const LEFT_EYE = { cx: '38%', cy: '39%', rx: '6%', ry: '7.5%' };
const RIGHT_EYE = { cx: '62%', cy: '39%', rx: '6%', ry: '7.5%' };
const MAX_PUPIL_MOVE = 8; // Maximum pixels the black pupil can move
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
      x: clampedX * MAX_PUPIL_MOVE,
      y: clampedY * MAX_PUPIL_MOVE
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
        
        {/* Realistic Eyes Overlay */}
        <RealisticEye 
          config={LEFT_EYE} 
          pupilOffset={pupilOffset} 
          isBlinking={isBlinking} 
        />
        <RealisticEye 
          config={RIGHT_EYE} 
          pupilOffset={pupilOffset} 
          isBlinking={isBlinking} 
        />
      </div>
    </div>
  );
};

const RealisticEye = ({ config, pupilOffset, isBlinking }) => {
  const { cx, cy, rx, ry } = config;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      // Blinking scales the eye vertically
      transform: `scaleY(${isBlinking ? 0 : 1})`,
      transformOrigin: `${cx} ${cy}`,
      transition: isBlinking ? 'transform 0.1s ease-in' : 'transform 0.15s ease-out',
      pointerEvents: 'none'
    }}>
      {/* 1. Base Iris: Covers the original eye in the image with a beautiful blue gradient */}
      <div style={{
        position: 'absolute',
        left: `calc(${cx} - ${rx})`,
        top: `calc(${cy} - ${ry})`,
        width: `calc(${rx} * 2)`,
        height: `calc(${ry} * 2)`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 30%, #60a5fa, #2563eb, #1e3a8a)', // Bright to dark blue iris
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' // Inner shadow for depth
      }} />

      {/* 2. Moving Black Pupil */}
      <div style={{
        position: 'absolute',
        // Center the pupil inside the iris
        left: `calc(${cx} - ${rx} * 0.65)`,
        top: `calc(${cy} - ${ry} * 0.65)`,
        width: `calc(${rx} * 1.3)`,
        height: `calc(${ry} * 1.3)`,
        borderRadius: '50%',
        backgroundColor: '#020617', // Pitch black pupil
        // Instant mouse tracking for the pupil
        transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
        boxShadow: '0 0 5px rgba(0,0,0,0.9)'
      }} />

      {/* 3. Fixed White Reflections (Highlights) - These stay completely still for realism! */}
      {/* Primary Highlight */}
      <div style={{
        position: 'absolute',
        left: `calc(${cx} + ${rx} * 0.15)`,
        top: `calc(${cy} - ${ry} * 0.45)`,
        width: `calc(${rx} * 0.45)`,
        height: `calc(${ry} * 0.45)`,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 0 4px rgba(255,255,255,0.9)'
      }} />
      
      {/* Secondary Highlight */}
      <div style={{
        position: 'absolute',
        left: `calc(${cx} - ${rx} * 0.35)`,
        top: `calc(${cy} + ${ry} * 0.25)`,
        width: `calc(${rx} * 0.15)`,
        height: `calc(${ry} * 0.15)`,
        borderRadius: '50%',
        backgroundColor: 'white',
        opacity: 0.9
      }} />
    </div>
  );
};

export default PandaReal;
