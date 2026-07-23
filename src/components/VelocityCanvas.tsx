import React, { useEffect, useRef } from 'react';

// Structure of a 3D vertex
type Point3D = { x: number; y: number; z: number };
// Triangle face defined by 3 vertex indices and a base color shade
type Face = { indices: [number, number, number]; colorOffset: number };

interface Crystal {
  cx: number;
  cy: number;
  cz: number;
  size: number;
  vertices: Point3D[];
  faces: Face[];
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  baseColor: string; // e.g. 'purple', 'pink', 'lavender'
}

export default function VelocityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef({ active: false, speedMultiplier: 1.0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

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
    const w = rect?.width || 300;
    const h = rect?.height || 180;

    // Create 4 distinct crystal shards floating around
    const crystals: Crystal[] = [];
    const colors = ['purple', 'pink', 'violet'];

    // Local function to generate a diamond-like crystal shape
    const makeCrystalVertices = (): Point3D[] => [
      { x: 0, y: -1, z: 0 },    // Top vertex
      { x: 0.6, y: 0, z: 0.6 },  // Middle vertices
      { x: -0.6, y: 0, z: 0.6 },
      { x: -0.6, y: 0, z: -0.6 },
      { x: 0.6, y: 0, z: -0.6 },
      { x: 0, y: 1, z: 0 }     // Bottom vertex
    ];

    const crystalFaces: Face[] = [
      { indices: [0, 1, 2], colorOffset: 10 },
      { indices: [0, 2, 3], colorOffset: 25 },
      { indices: [0, 3, 4], colorOffset: 40 },
      { indices: [0, 4, 1], colorOffset: 55 },
      { indices: [5, 2, 1], colorOffset: 15 },
      { indices: [5, 3, 2], colorOffset: 30 },
      { indices: [5, 4, 3], colorOffset: 45 },
      { indices: [5, 1, 4], colorOffset: 60 }
    ];

    // Initialize crystals at various depths and offsets
    crystals.push({
      cx: w * 0.55,
      cy: h * 0.5,
      cz: 0,
      size: 42,
      vertices: makeCrystalVertices(),
      faces: crystalFaces,
      rotX: 0.5, rotY: 0.2, rotZ: 0.1,
      speedX: 0.008, speedY: 0.012, speedZ: 0.005,
      baseColor: 'purple'
    });

    crystals.push({
      cx: w * 0.22,
      cy: h * 0.35,
      cz: 40,
      size: 20,
      vertices: makeCrystalVertices(),
      faces: crystalFaces,
      rotX: 1.2, rotY: 0.8, rotZ: 0.4,
      speedX: -0.012, speedY: 0.018, speedZ: -0.008,
      baseColor: 'pink'
    });

    crystals.push({
      cx: w * 0.8,
      cy: h * 0.65,
      cz: -50,
      size: 26,
      vertices: makeCrystalVertices(),
      faces: crystalFaces,
      rotX: -0.4, rotY: 1.5, rotZ: 0.8,
      speedX: 0.015, speedY: -0.01, speedZ: 0.012,
      baseColor: 'violet'
    });

    crystals.push({
      cx: w * 0.4,
      cy: h * 0.75,
      cz: 20,
      size: 16,
      vertices: makeCrystalVertices(),
      faces: crystalFaces,
      rotX: 0.1, rotY: -0.5, rotZ: 1.1,
      speedX: 0.005, speedY: 0.022, speedZ: -0.015,
      baseColor: 'purple'
    });

    const handleMouseEnter = () => {
      hoverRef.current.active = true;
    };

    const handleMouseLeave = () => {
      hoverRef.current.active = false;
    };

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 3D rotation formulas around multiple axes
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos
      };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos + p.z * sin,
        y: p.y,
        z: -p.x * sin + p.z * cos
      };
    };

    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z
      };
    };

    // Draw Loop
    const draw = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 300;
      const height = rect?.height || 180;

      ctx.clearRect(0, 0, width, height);

      // Smoothly adjust rotation speed multiplier on hover
      if (hoverRef.current.active) {
        hoverRef.current.speedMultiplier = hoverRef.current.speedMultiplier * 0.9 + 2.8 * 0.1;
      } else {
        hoverRef.current.speedMultiplier = hoverRef.current.speedMultiplier * 0.9 + 1.0 * 0.1;
      }

      // Collect all polygon faces to draw with depth sorting (Painter's Algorithm)
      type RenderableFace = {
        avgZ: number;
        p0: { x: number; y: number };
        p1: { x: number; y: number };
        p2: { x: number; y: number };
        color: string;
        strokeColor: string;
      };

      const renderList: RenderableFace[] = [];

      crystals.forEach((crystal) => {
        // Dynamic floating offsets
        crystal.cx += Math.sin(Date.now() * 0.0008 + crystal.size) * 0.05;
        crystal.cy += Math.cos(Date.now() * 0.001 - crystal.size) * 0.05;

        // Apply rotation velocities
        crystal.rotX += crystal.speedX * hoverRef.current.speedMultiplier;
        crystal.rotY += crystal.speedY * hoverRef.current.speedMultiplier;
        crystal.rotZ += crystal.speedZ * hoverRef.current.speedMultiplier;

        // Rotate vertices
        const rotatedVerts = crystal.vertices.map((v) => {
          let rv = rotateX(v, crystal.rotX);
          rv = rotateY(rv, crystal.rotY);
          rv = rotateZ(rv, crystal.rotZ);
          return rv;
        });

        // Focal length and center coords
        const focalLength = 220;
        const centerX = crystal.cx;
        const centerY = crystal.cy;

        // Map faces to projected 2D coordinates and calculate depth
        crystal.faces.forEach((face) => {
          const v0 = rotatedVerts[face.indices[0]];
          const v1 = rotatedVerts[face.indices[1]];
          const v2 = rotatedVerts[face.indices[2]];

          // Calculate average depth of the face
          const avgZ = (v0.z + v1.z + v2.z) / 3 + crystal.cz;

          // Simple flat shading calculation based on face normal vector relative to screen
          // Normal of triangle in 3D: (v1 - v0) cross (v2 - v0)
          const ux = v1.x - v0.x;
          const uy = v1.y - v0.y;
          const uz = v1.z - v0.z;

          const vx = v2.x - v0.x;
          const vy = v2.y - v0.y;
          const vz = v2.z - v0.z;

          const nx = uy * vz - uz * vy;
          const ny = uz * vx - ux * vz;
          const nz = ux * vy - uy * vx;

          const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
          // Normalize normal
          const nnz = len > 0 ? nz / len : 0;

          // Light intensity from a light source in front of the camera (0 to 1)
          const lightFactor = Math.max(0, (nnz + 1) / 2);

          // Skip backfaces for speed and cleanliness
          if (nz < 0) return;

          // Projection calculation
          const scale0 = focalLength / (focalLength + v0.z * crystal.size + crystal.cz);
          const scale1 = focalLength / (focalLength + v1.z * crystal.size + crystal.cz);
          const scale2 = focalLength / (focalLength + v2.z * crystal.size + crystal.cz);

          const p0 = {
            x: centerX + v0.x * crystal.size * scale0,
            y: centerY + v0.y * crystal.size * scale0
          };
          const p1 = {
            x: centerX + v1.x * crystal.size * scale1,
            y: centerY + v1.y * crystal.size * scale1
          };
          const p2 = {
            x: centerX + v2.x * crystal.size * scale2,
            y: centerY + v2.y * crystal.size * scale2
          };

          // Define high-fidelity colors based on crystal palette
          let color = '';
          let strokeColor = '';
          
          if (crystal.baseColor === 'purple') {
            // Dark purple/indigo gradient shading
            const h = 265 + face.colorOffset * 0.1;
            const s = 65 + Math.floor(lightFactor * 25);
            const l = 25 + Math.floor(lightFactor * 35);
            color = `hsl(${h}, ${s}%, ${l}%)`;
            strokeColor = `rgba(168, 85, 247, 0.4)`;
          } else if (crystal.baseColor === 'pink') {
            // Bright magenta/pink shading
            const h = 320 + face.colorOffset * 0.1;
            const s = 70 + Math.floor(lightFactor * 25);
            const l = 30 + Math.floor(lightFactor * 35);
            color = `hsl(${h}, ${s}%, ${l}%)`;
            strokeColor = `rgba(244, 114, 182, 0.4)`;
          } else {
            // Blue-violet palette
            const h = 240 + face.colorOffset * 0.15;
            const s = 60 + Math.floor(lightFactor * 30);
            const l = 28 + Math.floor(lightFactor * 30);
            color = `hsl(${h}, ${s}%, ${l}%)`;
            strokeColor = `rgba(139, 92, 246, 0.45)`;
          }

          renderList.push({
            avgZ,
            p0,
            p1,
            p2,
            color,
            strokeColor
          });
        });
      });

      // Sort faces by depth (back to front)
      renderList.sort((a, b) => b.avgZ - a.avgZ);

      // Render sorted faces
      renderList.forEach((face) => {
        ctx.beginPath();
        ctx.moveTo(face.p0.x, face.p0.y);
        ctx.lineTo(face.p1.x, face.p1.y);
        ctx.lineTo(face.p2.x, face.p2.y);
        ctx.closePath();

        ctx.fillStyle = face.color;
        ctx.fill();

        ctx.strokeStyle = face.strokeColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // High contrast highlight on the front-most sharp edges
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-y-0 right-0 w-1/2 md:w-3/5 overflow-hidden pointer-events-none opacity-95 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto block" />
    </div>
  );
}
