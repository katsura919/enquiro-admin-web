"use client"
import { useEffect, useRef } from 'react';

export const BackgroundGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.002;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create multiple "nodes" that move around
      const nodes = 5;
      for (let i = 0; i < nodes; i++) {
        const x = Math.sin(time + i * 2) * canvas.width * 0.25 + canvas.width * 0.5;
        const y = Math.cos(time + i * 2) * canvas.height * 0.25 + canvas.height * 0.5;
        
        // Draw glowing circles
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
        gradient.addColorStop(0, 'rgba(64, 156, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(64, 156, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(64, 156, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 100, 0, Math.PI * 2);
        ctx.fill();

        // Connect nodes with lines
        if (i > 0) {
          const prevX = Math.sin(time + (i - 1) * 2) * canvas.width * 0.25 + canvas.width * 0.5;
          const prevY = Math.cos(time + (i - 1) * 2) * canvas.height * 0.25 + canvas.height * 0.5;
          
          ctx.strokeStyle = 'rgba(64, 156, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-black"
      style={{ opacity: 0.8 }}
    />
  );
}; 