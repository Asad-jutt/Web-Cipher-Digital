import React, { useEffect, useRef, useState } from 'react';
import { WaveConfig } from '../types';

interface InteractiveCanvasProps {
  config: WaveConfig;
}

export default function InteractiveCanvas({ config }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, radius: 250, isHovered: false });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Handle high DPI displays
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic grid points
    // Let's create a 3D grid and rotate/project it.
    const cols = Math.floor(config.density * 0.4); 
    const rows = Math.floor(config.density * 0.4);
    
    // Setup floating ambient particles
    const particleCount = 60;
    const particles: {
      x: number;
      y: number;
      z: number;
      size: number;
      vx: number;
      vy: number;
      vz: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Capture Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Loop
    const draw = () => {
      if (width <= 0 || height <= 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Create motion trail blur by leaving background slightly translucent
      ctx.fillStyle = 'rgba(4, 4, 9, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      timeRef.current += config.speed * 0.02;
      const t = timeRef.current;

      // Draw subtle background glowing radial lights - safe radii parameters
      const radiusOuter = Math.max(100, Math.max(width, height) * 0.7);
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, radiusOuter
      );
      bgGrad.addColorStop(0, 'rgba(112, 0, 255, 0.08)');
      bgGrad.addColorStop(0.5, 'rgba(245, 57, 181, 0.02)');
      bgGrad.addColorStop(1, 'rgba(4, 4, 9, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Let's draw high-tech geometric overlays (faint ticks and tech indicators in background)
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
      ctx.lineWidth = 1;
      // Draw standard blueprint target marks
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal and vertical faints
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Math wave mesh computations and drawing
      const gridCols = cols;
      const gridRows = rows;
      
      const gridWidth = width * 1.1;
      const gridHeight = height * 1.1;
      
      const startX = -gridWidth / 2;
      const startY = -gridHeight / 2;
      const stepX = gridWidth / (gridCols - 1);
      const stepY = gridHeight / (gridRows - 1);

      // Create matrix to store computed projected 2D coordinates
      const coords: { x: number; y: number; z: number; glow: number }[][] = [];

      // 3D parameters
      const fov = 400; // Focal length
      const cameraYAngle = Math.PI / 12; // Rotate slightly about Y
      const cameraXAngle = Math.PI / 4.2; // Tilted downwards (X-axis) for nice isometric wireframe
      const cameraZOffset = 500; // Camera distance

      // 1. Calculate and Project All Points
      for (let c = 0; c < gridCols; c++) {
        coords[c] = [];
        for (let r = 0; r < gridRows; r++) {
          // Centered grid position
          const gx = startX + c * stepX;
          const gy = startY + r * stepY;

          // Compute complex wave heights
          const dFromCenter = Math.sqrt(gx * gx + gy * gy) / 400;
          
          // Primary Wave
          let gz = Math.sin(dFromCenter * config.frequency - t) * Math.cos(gx * 0.002 + t) * config.amplitude;
          // Secondary Harmonic Wave for digital high-fidelity complexity
          gz += Math.cos((gx - gy) * 0.003 + t * 1.5) * (config.amplitude * 0.4);
          // High-frequency noise wave
          gz += Math.sin(gy * 0.015 - t * 2.2) * (config.amplitude * 0.1) * config.noise;

          // Mouse Distortion (Magnetic Proximity Warping)
          const absScreenX = width / 2 + gx;
          const absScreenY = height / 2 + gy;
          const dx = mouse.x - absScreenX;
          const dy = mouse.y - absScreenY;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);

          let glowFactor = 0;
          if (distToMouse < mouse.radius) {
            const pull = (1 - distToMouse / mouse.radius) * config.distortion * 110;
            gz += pull * Math.sin(t * 3 - distToMouse * 0.03); // Ripple wave centered at mouse
            glowFactor = (1 - distToMouse / mouse.radius);
          }

          // Apply 3D Rotation Matrix around X & Y axes
          // Rotate around X (pitch)
          let rotatedY = gy * Math.cos(cameraXAngle) - gz * Math.sin(cameraXAngle);
          let rotatedZ = gy * Math.sin(cameraXAngle) + gz * Math.cos(cameraXAngle);

          // Rotate around Y (yaw)
          let rotatedX = gx * Math.cos(cameraYAngle) - rotatedZ * Math.sin(cameraYAngle);
          rotatedZ = gx * Math.sin(cameraYAngle) + rotatedZ * Math.cos(cameraYAngle);

          // Translate camera position
          const zFinal = rotatedZ + cameraZOffset;

          // Perspective Projection
          const scale = fov / Math.max(1, zFinal);
          const px = width / 2 + rotatedX * scale;
          const py = height / 2 + rotatedY * scale;

          coords[c][r] = { x: px, y: py, z: zFinal, glow: glowFactor };
        }
      }

      // Draw Grid Mesh Lines
      ctx.lineWidth = 1.2;

      // Select Mesh color gradient based on config.colorMode
      let grad = ctx.createLinearGradient(width * 0.2, height * 0.2, width * 0.8, height * 0.8);
      if (config.colorMode === 'cyan-purple') {
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.25)'); // Cyan
        grad.addColorStop(0.5, 'rgba(112, 0, 255, 0.45)'); // Purple
        grad.addColorStop(1, 'rgba(245, 57, 181, 0.15)'); // Pink
      } else if (config.colorMode === 'magenta-pink') {
        grad.addColorStop(0, 'rgba(245, 57, 181, 0.45)');
        grad.addColorStop(0.5, 'rgba(112, 0, 255, 0.2)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.45)');
      } else if (config.colorMode === 'matrix-green') {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.25)');
        grad.addColorStop(1, 'rgba(52, 211, 153, 0.1)');
      } else { // multi-glow
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
        grad.addColorStop(0.3, 'rgba(245, 57, 181, 0.35)');
        grad.addColorStop(0.6, 'rgba(251, 191, 36, 0.2)');
        grad.addColorStop(1, 'rgba(112, 0, 255, 0.35)');
      }

      // 2. Render Lines
      for (let c = 0; c < gridCols; c++) {
        for (let r = 0; r < gridRows; r++) {
          const pt = coords[c][r];

          // Skip if out of bounds to save render instructions
          if (pt.x < -100 || pt.x > width + 100 || pt.y < -100 || pt.y > height + 100) {
            continue;
          }

          // Draw line to Right Neighbor
          if (c < gridCols - 1) {
            const nextX = coords[c + 1][r];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextX.x, nextX.y);
            
            // Highlight proximity lines (reactive mouse glow)
            const localGlow = Math.max(pt.glow, nextX.glow);
            if (localGlow > 0.1) {
              ctx.strokeStyle = config.colorMode === 'cyan-purple' 
                ? `rgba(0, 242, 254, ${0.15 + localGlow * 0.7})`
                : `rgba(245, 57, 181, ${0.15 + localGlow * 0.7})`;
              ctx.lineWidth = 1.8;
            } else {
              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }

          // Draw line to Bottom Neighbor
          if (r < gridRows - 1) {
            const nextY = coords[c][r + 1];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextY.x, nextY.y);
            
            const localGlow = Math.max(pt.glow, nextY.glow);
            if (localGlow > 0.1) {
              ctx.strokeStyle = config.colorMode === 'cyan-purple' 
                ? `rgba(0, 242, 254, ${0.15 + localGlow * 0.7})`
                : `rgba(245, 57, 181, ${0.15 + localGlow * 0.7})`;
              ctx.lineWidth = 1.8;
            } else {
              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }

          // Optionally render little tech nodes (crosshair nodes) at junctions
          if (c % 4 === 0 && r % 4 === 0) {
            const nodeGlow = pt.glow;
            ctx.fillStyle = nodeGlow > 0.2
              ? (config.colorMode === 'cyan-purple' ? '#00F2FE' : '#F539B5')
              : 'rgba(112, 0, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, nodeGlow > 0.2 ? 3 : 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Mouse glowing halo
            if (nodeGlow > 0.4) {
              ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 8 * nodeGlow, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Render Floating Cosmic Particles with 3D Depth
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Drifting motion
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around boundary
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 1) p.z = 800;
        if (p.z > 800) p.z = 1;

        // Perspective projection for particles
        const scale = fov / p.z;
        const px = width / 2 + p.x * scale;
        const py = height / 2 + p.y * scale;

        // Clip out of screen
        if (px < 0 || px > width || py < 0 || py > height) continue;

        const size = p.size * scale * 0.8;
        const alpha = p.alpha * (1 - p.z / 800);

        // Particle Glow
        ctx.fillStyle = config.colorMode === 'cyan-purple'
          ? `rgba(0, 242, 254, ${alpha})`
          : `rgba(245, 57, 181, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fill();

        // Very high depth points draw glowing sparkles
        if (p.z < 150) {
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 10;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(px, py, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Draw subtle circular mouse halo cursor itself on the mesh
      if (mouse.isHovered) {
        ctx.strokeStyle = config.colorMode === 'cyan-purple' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(245, 57, 181, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = config.colorMode === 'cyan-purple' ? 'rgba(0, 242, 254, 0.3)' : 'rgba(245, 57, 181, 0.3)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = config.colorMode === 'cyan-purple' ? '#00F2FE' : '#F539B5';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config]);

  return (
    <canvas
      id="bg-interactive-canvas"
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
