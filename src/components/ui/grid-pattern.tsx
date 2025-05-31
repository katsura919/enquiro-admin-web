"use client"
import { useEffect, useRef } from 'react';

export const GridPattern = () => {
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

    const drawGrid = () => {
      const cellSize = 50;
      const rows = Math.ceil(canvas.height / cellSize);
      const cols = Math.ceil(canvas.width / cellSize);

      ctx.strokeStyle = 'rgba(64, 156, 255, 0.1)';
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = i * cellSize + Math.sin(time + i * 0.1) * 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = i * cellSize + Math.cos(time + i * 0.1) * 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add pulsing dots at intersections
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * cellSize + Math.sin(time + i * 0.1) * 2;
          const y = j * cellSize + Math.cos(time + j * 0.1) * 2;
          const radius = 1 + Math.sin(time * 2 + i * j * 0.1) * 1;

          ctx.fillStyle = 'rgba(64, 156, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
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
      className="fixed inset-0 -z-20 h-full w-full bg-black/90"
      style={{ opacity: 0.4 }}
    />
  );
}; 