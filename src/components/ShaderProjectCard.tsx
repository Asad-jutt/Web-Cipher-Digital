import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ShaderProjectCardProps {
  theme?: 'cyan' | 'purple' | 'pink' | 'emerald';
  title: string;
  category: string;
  className?: string;
}

export default function ShaderProjectCard({
  theme = 'cyan',
  title,
  category,
  className = '',
}: ShaderProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0 });
  const hoverRef = useRef({ value: 0, target: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color vector depending on theme
    let primaryColor = new THREE.Color('#00f0ff');
    let secondaryColor = new THREE.Color('#8a2be2');

    if (theme === 'purple') {
      primaryColor = new THREE.Color('#a855f7');
      secondaryColor = new THREE.Color('#6366f1');
    } else if (theme === 'pink') {
      primaryColor = new THREE.Color('#f472b6');
      secondaryColor = new THREE.Color('#9333ea');
    } else if (theme === 'emerald') {
      primaryColor = new THREE.Color('#10b981');
      secondaryColor = new THREE.Color('#06b6d4');
    }

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_hover: { value: 0 },
        u_color1: { value: primaryColor },
        u_color2: { value: secondaryColor },
        u_resolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_hover;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec2 u_resolution;

        varying vec2 vUv;

        // Simplex / Perlin noise helper
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = vUv;
          
          // Liquid Distortion Waves
          float distToMouse = length(st - u_mouse);
          float ripple = sin(distToMouse * 25.0 - u_time * 4.0) * exp(-distToMouse * 4.0) * u_hover;
          
          float n = snoise(st * 4.0 + vec2(u_time * 0.2, u_time * 0.3));
          vec2 distortedUv = st + vec2(
            sin(st.y * 10.0 + u_time * 2.0) * 0.02 * u_hover + n * 0.03 * u_hover,
            cos(st.x * 10.0 + u_time * 2.0) * 0.02 * u_hover + ripple * 0.05
          );

          // Chromatic Aberration offset based on hover & mouse displacement
          float caOffset = (0.005 + u_hover * 0.012) * (1.0 + ripple);
          
          // Channel pattern generation with offset UVs
          float rChan = snoise((distortedUv + vec2(caOffset, 0.0)) * 6.0 + u_time * 0.3);
          float gChan = snoise(distortedUv * 6.0 + u_time * 0.3);
          float bChan = snoise((distortedUv - vec2(caOffset, 0.0)) * 6.0 + u_time * 0.3);

          // Sci-Fi Tech Grid & Scanline Pattern
          vec2 gridUv = fract(distortedUv * 20.0);
          float grid = step(0.92, gridUv.x) + step(0.92, gridUv.y);
          
          float scanline = sin(st.y * 120.0 + u_time * 10.0) * 0.08;

          // Composition
          vec3 col = mix(u_color1, u_color2, st.x + st.y + n * 0.3);
          
          // Mix channels for chromatic distortion
          col.r += rChan * 0.2 * u_hover;
          col.b += bChan * 0.25 * u_hover;

          // Glowing pulse center around mouse
          float glow = exp(-distToMouse * 3.0) * 0.4 * u_hover;

          float alpha = (0.15 + grid * 0.2 + glow + scanline) * (0.6 + u_hover * 0.4);

          gl_FragColor = vec4(col * (0.8 + u_hover * 0.4), alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse listeners inside card
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      const deltaX = x - prevMouseX;
      const deltaY = y - prevMouseY;
      mouseRef.current.speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;

      prevMouseX = x;
      prevMouseY = y;
    };

    const handleMouseEnter = () => {
      hoverRef.current.target = 1.0;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      hoverRef.current.target = 0.0;
      setIsHovered(false);
    };

    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse coordinates and hover factor
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      hoverRef.current.value += (hoverRef.current.target - hoverRef.current.value) * 0.08;

      material.uniforms.u_time.value = elapsedTime;
      material.uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      material.uniforms.u_hover.value = hoverRef.current.value;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.u_resolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-90 transition-opacity duration-500 ${className}`}
    />
  );
}
