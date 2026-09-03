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
  const containerRef = useRef(null);

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
        />
        <RealisticEye 
          config={RIGHT_EYE} 
          pupilOffset={pupilOffset} 
        />
      </div>
    </div>
  );
};

const RealisticEye = ({ config, pupilOffset }) => {
  const { cx, cy, rx, ry } = config;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none'
    }}>
      {/* 1. Base Socket: PERMANENTLY Covers the original eye with white. 
          It NEVER scales down, so the old eye is ALWAYS hidden. */}
      <div style={{
        position: 'absolute',
        left: `calc(${cx} - ${rx})`,
        top: `calc(${cy} - ${ry})`,
        width: `calc(${rx} * 2)`,
        height: `calc(${ry} * 2)`,
        borderRadius: '50%',
        backgroundColor: 'white', // White sclera
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)', // Inner shadow for depth
        overflow: 'hidden' // Keeps everything cleanly inside the eye socket
      }}>
        {/* 2. Moving Black Pupil */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          // Pupil is large inside the eye
          width: '75%',
          height: '75%',
          marginLeft: '-37.5%', // center it
          marginTop: '-37.5%',  // center it
          borderRadius: '50%',
          backgroundColor: '#020617', // Pitch black pupil
          // Instant mouse tracking
          transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
          boxShadow: '0 0 5px rgba(0,0,0,0.9)'
        }} />

        {/* 3. Fixed White Reflections (Highlights) - Stay still for realism! */}
        {/* Primary Highlight */}
        <div style={{
          position: 'absolute',
          left: '55%',
          top: '15%',
          width: '35%',
          height: '35%',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 4px rgba(255,255,255,0.9)'
        }} />
        
        {/* Secondary Highlight */}
        <div style={{
          position: 'absolute',
          left: '20%',
          top: '55%',
          width: '15%',
          height: '15%',
          borderRadius: '50%',
          backgroundColor: 'white',
          opacity: 0.8
        }} />
      </div>
    </div>
  );
};

export default PandaReal;
