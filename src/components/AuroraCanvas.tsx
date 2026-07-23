import React, { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

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
    
    // Resize observer to handle dynamic sizing
    const observer = new ResizeObserver(resize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
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
      time += 0.015;
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 300;
      const height = rect?.height || 180;

      // Clear with clean slight translucent background
      ctx.clearRect(0, 0, width, height);

      // We want to draw a pseudo 3D wireframe grid waving.
      const rows = 14;
      const cols = 22;
      const grid: [number, number][][] = [];

      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // Generate nodes with waving and perspective
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          // Normalize coordinates -0.5 to 0.5
          const nx = (c / (cols - 1)) - 0.5;
          const ny = (r / (rows - 1)) - 0.5;

          // Spatial calculations
          const x3d = nx * width * 1.3;
          const z3d = (ny + 0.6) * height * 1.1; // z represents depth here

          // Double-sine wave simulation
          const dist = Math.sqrt(nx * nx + ny * ny);
          const waveHeight = Math.sin(c * 0.3 - time * 1.5) * Math.cos(r * 0.4 + time) * 15 
                           + Math.sin(dist * 6 - time * 2) * 8;

          // Mouse magnet displacement
          let magnet = 0;
          if (mouseRef.current.active) {
            const mX = mouseRef.current.x;
            const mY = mouseRef.current.y;
            
            // Unproject approximation to find distance to grid node
            const approxX = centerX + x3d * (180 / (180 + z3d));
            const approxY = centerY + (waveHeight + (ny * 30)) * (180 / (180 + z3d)) + (ny * 40);
            
            const dx = mX - approxX;
            const dy = mY - approxY;
            const mouseDist = Math.sqrt(dx * dx + dy * dy);
            if (mouseDist < 80) {
              const force = (80 - mouseDist) / 80;
              magnet = force * -15; // push down or up
            }
          }

          // Projection scale based on depth (z3d)
          const focalLength = 190;
          const scale = focalLength / (focalLength + z3d);

          const px = centerX + x3d * scale;
          // Offset the baseline height to make it look like a 3D ground plane tilted forward
          const py = centerY + (ny * 60) + (waveHeight + magnet) * scale * 1.2;

          grid[r][c] = [px, py];
        }
      }

      // Render horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const [x, y] = grid[r][c];
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        // Dynamic opacity based on row depth
        const depthFactor = r / (rows - 1); // 0 (back) to 1 (front)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 + depthFactor * 0.32})`;
        ctx.lineWidth = 1 + depthFactor * 0.8;
        ctx.stroke();
      }

      // Render vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const [x, y] = grid[r][c];
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const depthFactor = c / (cols - 1);
        ctx.strokeStyle = `rgba(6, 182, 212, 0.15)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Add a subtle glowing overlay at the top of waves
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 3) {
          const [x, y] = grid[r][c];
          if (x > 0 && x < width && y > 0 && y < height) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(165, 243, 252, ${0.25 + (r / rows) * 0.4})`;
            ctx.fill();
          }
        }
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
    <div ref={containerRef} className="absolute inset-y-0 right-0 w-1/2 md:w-3/5 overflow-hidden pointer-events-none opacity-90 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto block" />
    </div>
  );
}
