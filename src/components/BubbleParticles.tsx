import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  alpha: number;
  hue: number;
}

interface BubbleParticlesProps {
  burstTrigger?: number; // When incremented, trigger burst of bubbles
  color?: string; // 'green' | 'lime' | 'red'
  density?: number;
  className?: string;
}

export const BubbleParticles: React.FC<BubbleParticlesProps> = ({
  burstTrigger = 0,
  color = 'lime',
  density = 24,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize base bubbles
    const bubbles: Bubble[] = [];
    for (let i = 0; i < density; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 2,
        speed: Math.random() * 1.2 + 0.5,
        wobbleSpeed: Math.random() * 0.04 + 0.01,
        wobbleDistance: Math.random() * 12 + 4,
        alpha: Math.random() * 0.4 + 0.2,
        hue: color === 'red' ? 350 : color === 'green' ? 142 : 88,
      });
    }
    bubblesRef.current = bubbles;

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      bubblesRef.current.forEach((b) => {
        b.y -= b.speed;
        const currentX = b.x + Math.sin(time * b.wobbleSpeed) * b.wobbleDistance;

        // Reset if goes off top
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        // Draw bubble with glass highlight
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${b.hue}, 85%, 65%, ${b.alpha})`;
        ctx.fill();

        // Inner rim
        ctx.strokeStyle = `hsla(${b.hue}, 100%, 90%, ${b.alpha * 1.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular highlight dot
        ctx.beginPath();
        ctx.arc(
          currentX - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.25,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 1.5})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [density, color]);

  // Burst effect when burstTrigger changes
  useEffect(() => {
    if (!burstTrigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    // Spawn 40 fast bubbles from center bottom
    const burstCount = 35;
    for (let i = 0; i < burstCount; i++) {
      bubblesRef.current.push({
        x: width * 0.5 + (Math.random() - 0.5) * 80,
        y: height * 0.35 + (Math.random() - 0.5) * 40,
        radius: Math.random() * 7 + 3,
        speed: Math.random() * 4 + 2.5,
        wobbleSpeed: Math.random() * 0.08 + 0.02,
        wobbleDistance: Math.random() * 20 + 5,
        alpha: Math.random() * 0.6 + 0.4,
        hue: color === 'red' ? 350 : 92,
      });
    }

    // Limit array size
    if (bubblesRef.current.length > 90) {
      bubblesRef.current = bubblesRef.current.slice(-90);
    }
  }, [burstTrigger, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    />
  );
};
