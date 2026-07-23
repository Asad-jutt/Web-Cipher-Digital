import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  originalRadius: number;
  pulseTimer: number;
  pulseActive: boolean;
  pulseTargetIdx: number | null;
}

export default function NeuroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const nodes: Node[] = [];
    const numNodes = 26;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 300;
      const height = rect?.height || 180;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width || 300;
    const height = rect?.height || 180;

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      const radius = Math.random() * 2 + 1;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        originalRadius: radius,
        pulseTimer: 0,
        pulseActive: Math.random() < 0.25,
        pulseTargetIdx: null,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Draw loop
    const draw = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect?.width || 300;
      const h = rect?.height || 180;

      ctx.clearRect(0, 0, w, h);

      // Mouse attraction
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        node.x += node.vx;
        node.y += node.vy;

        // Gentle boundaries bouncing
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > w - 10) { node.x = w - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > h - 10) { node.y = h - 10; node.vy *= -1; }

        // Magnet attraction
        if (mActive) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) * 0.0003;
            node.vx += dx * force;
            node.vy += dy * force;
            
            // Limit speed
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (speed > 1.2) {
              node.vx = (node.vx / speed) * 1.2;
              node.vy = (node.vy / speed) * 1.2;
            }

            // Expand radius slightly
            node.radius = node.originalRadius + (1 - dist / 100) * 1.5;
          } else {
            node.radius = node.radius * 0.95 + node.originalRadius * 0.05;
          }
        } else {
          node.radius = node.radius * 0.95 + node.originalRadius * 0.05;
          // Apply friction to slow down to normal speed
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (speed > 0.5) {
            node.vx *= 0.98;
            node.vy *= 0.98;
          }
        }
      }

      const connectionDist = 72;
      // Draw links
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        let connections = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            connections++;
            const alpha = (1 - dist / connectionDist) * 0.38;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Render a traveling pulse signal along the connection
            if (n1.pulseActive && n1.pulseTargetIdx === null && Math.random() < 0.03) {
              n1.pulseTargetIdx = j;
            }

            if (n1.pulseActive && n1.pulseTargetIdx === j) {
              n1.pulseTimer += 0.015;
              if (n1.pulseTimer >= 1) {
                n1.pulseTimer = 0;
                n1.pulseActive = false;
                n1.pulseTargetIdx = null;
                // Activate pulse on target
                n2.pulseActive = true;
              } else {
                const px = n1.x + dx * n1.pulseTimer;
                const py = n1.y + dy * n1.pulseTimer;
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#f472b6'; // hot pink signal
                ctx.shadowColor = '#f472b6';
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
              }
            }
          }
        }

        // Periodically restart inactive pulses
        if (!n1.pulseActive && Math.random() < 0.002) {
          n1.pulseActive = true;
          n1.pulseTimer = 0;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        
        // Node colors based on active signals
        if (n1.pulseActive) {
          ctx.fillStyle = 'rgba(244, 114, 182, 0.95)'; // glowing pink
          ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.85)'; // bright purple
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-y-0 right-0 w-1/2 md:w-3/5 overflow-hidden pointer-events-none opacity-95 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto block" />
    </div>
  );
}
