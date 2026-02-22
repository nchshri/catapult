/*'use client';

import { useEffect, useRef } from 'react';

export default function SpiralCursor() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const animRef = useRef(null);
  const timeRef = useRef(0);
  const isPointer = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      // Check if hovered element has pointer cursor
      let el = document.elementFromPoint(e.clientX, e.clientY);
      let found = false;
      while (el && el !== document.body) {
        const computed = window.getComputedStyle(el).cursor;
        if (computed === 'pointer') { found = true; break; }
        el = el.parentElement;
      }
      isPointer.current = found;
    };
    window.addEventListener('mousemove', onMove);

    function draw() {
      animRef.current = requestAnimationFrame(draw);
      timeRef.current += 0.06;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y } = mouse.current;
      const t = timeRef.current;
      const numArms = 3;
      const turns = 2.5;
      const maxR = 36;

      // Glow effect via shadow
      ctx.shadowColor = 'rgba(61, 191, 154, 0.8)';
      ctx.shadowBlur = 12;

      for (let arm = 0; arm < numArms; arm++) {
        const armOffset = (arm / numArms) * Math.PI * 2;

        ctx.beginPath();
        let first = true;

        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          const angle = progress * Math.PI * 2 * turns + armOffset + t;
          const r = progress * maxR;
          const px = x + Math.cos(angle) * r;
          const py = y + Math.sin(angle) * r;

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }

        const alpha = 0.7 + arm * 0.1;
        ctx.strokeStyle = `rgba(61, 191, 154, ${alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // Show a pointer arrow when hovering clickable elements
      if (isPointer.current) {
        ctx.shadowColor = 'rgba(61, 191, 154, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y + 14);
        ctx.lineTo(x + 4, y + 12);
        ctx.lineTo(x + 6, y + 18);
        ctx.lineTo(x + 3, y + 19);
        ctx.lineTo(x + 1, y + 13);
        ctx.lineTo(x - 4, y + 16);
        ctx.closePath();
        ctx.fillStyle = 'rgba(61, 191, 154, 0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Center dot
      ctx.shadowColor = 'rgba(61, 191, 154, 1)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(61, 191, 154, 1)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        cursor: 'none',
      }}
    />
  );
}*/