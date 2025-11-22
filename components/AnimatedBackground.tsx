import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    let time = 0;

    // Configuration
    const lineCount = 35;
    const particleCount = 100;
    
    // Ambient Light Orbs (Moving blobs of color in background)
    const orbs = [
        { x: width * 0.2, y: height * 0.3, r: 400, color: 'rgba(29, 78, 216, 0.15)', vx: 0.5, vy: 0.2 }, // Blue
        { x: width * 0.8, y: height * 0.7, r: 500, color: 'rgba(126, 34, 206, 0.12)', vx: -0.3, vy: -0.4 }, // Purple
        { x: width * 0.5, y: height * 0.5, r: 300, color: 'rgba(14, 165, 233, 0.1)', vx: 0.2, vy: 0.1 }, // Cyan
    ];

    const animate = () => {
      if (!ctx) return;
      time += 0.005;

      // 1. Background Fill (Not Black!)
      // We redraw the background every frame but with a distinct deep blue/slate color
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#020617'); // Slate 950
      bgGradient.addColorStop(0.5, '#0f172a'); // Slate 900
      bgGradient.addColorStop(1, '#1e1b4b'); // Indigo 950
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Ambient Orbs (The "Glow" foundation)
      ctx.globalCompositeOperation = 'screen'; // Blend mode for glow
      orbs.forEach(orb => {
          // Move orbs slowly
          orb.x += orb.vx;
          orb.y += orb.vy;

          // Bounce off edges
          if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
          if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

          // Pulsate radius
          const currentR = orb.r + Math.sin(time * 2) * 20;

          const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentR);
          gradient.addColorStop(0, orb.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, currentR, 0, Math.PI * 2);
          ctx.fill();
      });

      // 3. Draw Neon Lines (The "Grid" or "Aurora")
      ctx.globalCompositeOperation = 'lighten';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        
        const yBase = height * 0.5 + (i - lineCount/2) * 15;
        const intensity = 1 - Math.abs(i - lineCount/2) / (lineCount/2); // Brighter in middle
        
        // Vibrant Colors
        const r = 50 + Math.sin(time + i * 0.1) * 50;
        const g = 100 + Math.cos(time * 1.2 + i * 0.1) * 50;
        const b = 255;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * intensity})`;

        for (let x = 0; x <= width; x += width / 20) {
           // Wave math
           const yOffset = 
             Math.sin(x * 0.003 + time + i * 0.2) * 60 +
             Math.sin(x * 0.01 - time * 0.5) * 30;

           // Perspective distortion (closer lines move more)
           const y = yBase + yOffset;
           
           if (x === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 4. Floating Particles (Dust / Stars)
      ctx.globalCompositeOperation = 'source-over';
      for(let j = 0; j < particleCount; j++) {
          const pX = (Math.sin(j * 32.1 + time * 0.2) + 1) / 2 * width;
          const pY = (Math.cos(j * 43.2 + time * 0.1) + 1) / 2 * height;
          const size = (Math.sin(j * 12.3 + time) + 2); 
          const opacity = (Math.sin(time * 3 + j) + 1) / 2 * 0.6; // Higher opacity
          
          ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`; // Light Blue
          ctx.beginPath();
          ctx.arc(pX, pY, size * 0.8, 0, Math.PI * 2);
          ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};