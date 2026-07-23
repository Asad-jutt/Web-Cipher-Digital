import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeWireframeGridProps {
  className?: string;
  intensity?: number;
}

export default function ThreeWireframeGrid({ className = '', intensity = 1.0 }: ThreeWireframeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 12, 28);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Grid Geometry: Low-poly plane
    const gridWidth = 100;
    const gridDepth = 100;
    const segmentsX = 50;
    const segmentsY = 50;

    const geometry = new THREE.PlaneGeometry(gridWidth, gridDepth, segmentsX, segmentsY);
    geometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const initialPositions = posAttr.array.slice() as Float32Array;

    // Create custom shader material for glowing wireframe with cyan to ultraviolet gradient
    const wireframeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uColorCyan: { value: new THREE.Color('#00f0ff') },
        uColorPurple: { value: new THREE.Color('#8a2be2') },
        uIntensity: { value: intensity },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          vPosition = position;
          vElevation = position.y;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorCyan;
        uniform vec3 uColorPurple;
        uniform float uTime;
        uniform float uIntensity;

        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          // Gradient based on Z depth and elevation
          float mixFactor = clamp((vPosition.z + 30.0) / 60.0, 0.0, 1.0);
          vec3 baseColor = mix(uColorPurple, uColorCyan, mixFactor);
          
          // Elevation glow boost
          float glow = clamp((vElevation + 2.0) / 4.0, 0.0, 1.0) * 0.5 + 0.5;
          float alpha = mix(0.15, 0.85, mixFactor) * uIntensity;

          gl_FragColor = vec4(baseColor * glow, alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(mesh);

    // Mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp for cursor
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update Mesh Vertices (Undulating wave logic + cursor distortion)
      const count = posAttr.count;
      for (let i = 0; i < count; i++) {
        const x = initialPositions[i * 3];
        const z = initialPositions[i * 3 + 2];

        // Multi-frequency sine waves
        const wave1 = Math.sin(x * 0.15 + elapsedTime * 1.2) * 1.2;
        const wave2 = Math.cos(z * 0.18 + elapsedTime * 0.9) * 1.0;
        const wave3 = Math.sin((x + z) * 0.08 + elapsedTime * 1.5) * 0.8;

        // Cursor distance distortion
        const distToCursor = Math.sqrt(Math.pow(x - mx * 25, 2) + Math.pow(z - my * 25, 2));
        const cursorImpact = Math.max(0, 1 - distToCursor / 20) * 3.5 * Math.sin(elapsedTime * 4);

        posAttr.setY(i, (wave1 + wave2 + wave3 + cursorImpact) * intensity);
      }

      posAttr.needsUpdate = true;
      wireframeMaterial.uniforms.uTime.value = elapsedTime;

      // Camera dynamic sway reacting to mouse
      camera.position.x = mx * 6;
      camera.position.y = 12 + my * 2;
      camera.lookAt(0, -2, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    />
  );
}
