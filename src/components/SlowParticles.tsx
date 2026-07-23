import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function SlowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Subtle neon colors matching the brand identity
    const colors = [
      'rgba(0, 242, 254, ',  // Cyan
      'rgba(245, 57, 181, ',  // Pink
      'rgba(112, 0, 255, ',  // Purple
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Calculate count based on viewport area so it's consistent and non-distracting
      const baseArea = 1920 * 1080;
      const currentArea = canvas.width * canvas.height;
      const particleCount = Math.floor(65 * (currentArea / baseArea));

      for (let i = 0; i < Math.max(30, particleCount); i++) {
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const targetAlpha = 0.18 + Math.random() * 0.22; // Elevated opacity for crisp visibility without distracting

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Extremely slow drift speeds (0.1 to 0.25 pixels per frame)
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 2.0 + Math.random() * 3.5, // Slightly larger particles for beautiful visibility
          color: baseColor,
          alpha: targetAlpha,
          pulseSpeed: 0.005 + Math.random() * 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries slowly
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Elegant, slow micro-pulsing to create depth
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulsePhase) * 0.4);

        // Render ambient particle glow with enhanced shadow blurring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `${p.color}${currentAlpha * 0.95})`;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="ambient-slow-particles"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1 overflow-hidden select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
