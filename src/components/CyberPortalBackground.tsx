import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CyberPortalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<SVGGElement>(null);
  const ring2Ref = useRef<SVGGElement>(null);
  const ring3Ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Slow, silky smooth rotation for the central cyber rings
    if (ring1Ref.current) {
      gsap.to(ring1Ref.current, {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    }

    if (ring2Ref.current) {
      gsap.to(ring2Ref.current, {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    }

    if (ring3Ref.current) {
      gsap.to(ring3Ref.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    }

    // 2. Pulse effect for the major portal nodes
    const pulses = containerRef.current.querySelectorAll('.portal-pulse-ring');
    gsap.fromTo(
      pulses,
      { scale: 0.8, opacity: 0.9 },
      {
        scale: 2.5,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: {
          each: 0.8,
          repeat: -1,
        },
        ease: 'sine.out',
      }
    );

    // 3. Cyber network node drift (subtle floating)
    const floatingNodes = containerRef.current.querySelectorAll('.cyber-float-node');
    floatingNodes.forEach((node, i) => {
      gsap.to(node, {
        x: `random(-15, 15)`,
        y: `random(-15, 15)`,
        duration: `random(6, 10)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // 4. Moving cyber grid scanlines
    const scanLines = containerRef.current.querySelectorAll('.scan-laser-line');
    gsap.fromTo(
      scanLines,
      { y: -100 },
      {
        y: 600,
        duration: 8,
        repeat: -1,
        stagger: 4,
        ease: 'power1.inOut',
      }
    );

    // 5. Flowing particle data packets on connections
    const dataPackets = containerRef.current.querySelectorAll('.cyber-data-packet');
    gsap.fromTo(
      dataPackets,
      { strokeDashoffset: 120 },
      {
        strokeDashoffset: 0,
        duration: 4,
        repeat: -1,
        ease: 'none',
        stagger: 0.5,
      }
    );

    // 6. Blinking telemetry data blocks
    const telemetryBlocks = containerRef.current.querySelectorAll('.telemetry-blink');
    gsap.fromTo(
      telemetryBlocks,
      { opacity: 0.2 },
      {
        opacity: 0.8,
        duration: 'random(0.5, 1.8)',
        repeat: -1,
        yoyo: true,
        ease: 'steps(3)',
        stagger: 0.3,
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      id="cyber-portal-background"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      {/* Immersive background radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(112,0,255,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,57,181,0.04)_0%,transparent_50%)]" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="portal-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="neon-glow-pink" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Moving scanlines / laser barriers */}
        <line
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
          className="scan-laser-line stroke-brand-cyan/20"
          strokeWidth="1.5"
          filter="url(#portal-glow)"
        />
        <line
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
          className="scan-laser-line stroke-brand-purple/15"
          strokeWidth="1.5"
          filter="url(#portal-glow)"
        />

        {/* Central Complex Cybernetic Console Rings / Target Reticle */}
        <g id="cyber-console" transform="translate(500, 250)" opacity="0.65">
          {/* External radar ticks */}
          <g ref={ring1Ref}>
            <circle r="180" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" strokeDasharray="4 24" fill="none" />
            <circle r="150" stroke="rgba(112, 0, 255, 0.15)" strokeWidth="1.5" strokeDasharray="30 40" fill="none" />
            <path d="M 0,-180 L 0,-190 M 0,180 L 0,190 M -180,0 L -190,0 M 180,0 L 190,0" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" />
          </g>

          {/* Opposite rotating telemetry rings */}
          <g ref={ring2Ref}>
            <circle r="110" stroke="rgba(245, 57, 181, 0.15)" strokeWidth="1" strokeDasharray="10 8" fill="none" />
            <circle r="90" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="2" strokeDasharray="80 120" fill="none" />
            <circle r="70" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" fill="none" />
          </g>

          {/* Deep inner rotating core */}
          <g ref={ring3Ref}>
            <circle r="50" stroke="rgba(112, 0, 255, 0.2)" strokeWidth="1" strokeDasharray="15 5" fill="none" />
            <polygon points="0,-15 13,7 -13,7" fill="none" stroke="#00F2FE" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Grid target crosshairs */}
          <line x1="-220" y1="0" x2="220" y2="0" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />
          <line x1="0" y1="-220" x2="0" y2="220" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />
        </g>

        {/* Ambient link lines connecting floating cyber nodes */}
        <g id="cyber-link-paths" opacity="0.45">
          {/* Node 1 to Node 2 */}
          <path d="M 150,120 Q 300,80 500,100" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
          <path d="M 150,120 Q 300,80 500,100" className="cyber-data-packet" fill="none" stroke="#00F2FE" strokeWidth="1.5" strokeDasharray="15, 105" filter="url(#portal-glow)" />

          {/* Node 2 to Node 3 */}
          <path d="M 500,100 Q 680,120 850,150" fill="none" stroke="rgba(112, 0, 255, 0.15)" strokeWidth="1" />
          <path d="M 500,100 Q 680,120 850,150" className="cyber-data-packet" fill="none" stroke="#7000FF" strokeWidth="1.5" strokeDasharray="12, 90" filter="url(#portal-glow)" />

          {/* Node 1 to Node 4 */}
          <path d="M 150,120 Q 180,260 220,380" fill="none" stroke="rgba(245, 57, 181, 0.12)" strokeWidth="1" />
          <path d="M 150,120 Q 180,260 220,380" className="cyber-data-packet" fill="none" stroke="#F539B5" strokeWidth="1.5" strokeDasharray="10, 110" filter="url(#neon-glow-pink)" />

          {/* Node 4 to Node 5 */}
          <path d="M 220,380 Q 500,420 780,380" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
          <path d="M 220,380 Q 500,420 780,380" className="cyber-data-packet" fill="none" stroke="#00F2FE" strokeWidth="1.5" strokeDasharray="20, 130" filter="url(#portal-glow)" />

          {/* Node 5 to Node 3 */}
          <path d="M 780,380 Q 820,260 850,150" fill="none" stroke="rgba(112, 0, 255, 0.12)" strokeWidth="1" />
          <path d="M 780,380 Q 820,260 850,150" className="cyber-data-packet" fill="none" stroke="#7000FF" strokeWidth="1.5" strokeDasharray="15, 105" filter="url(#portal-glow)" />
        </g>

        {/* Floating cyber link nodes with label text */}
        <g id="cyber-link-nodes">
          {/* Node 1: Top-Left */}
          <g className="cyber-float-node" transform="translate(150, 120)">
            <circle r="12" fill="none" stroke="#00F2FE" strokeWidth="1.5" className="portal-pulse-ring origin-center" />
            <circle r="4.5" fill="#00F2FE" filter="url(#portal-glow)" />
            <text x="14" y="4" fill="rgba(6, 182, 212, 0.8)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1" className="font-bold select-none">PORTAL-01</text>
            <text x="14" y="14" fill="rgba(148, 163, 184, 0.4)" fontSize="6" fontFamily="var(--font-mono)" className="select-none">LAT_37.77 N</text>
          </g>

          {/* Node 2: Top-Center */}
          <g className="cyber-float-node" transform="translate(500, 100)">
            <circle r="12" fill="none" stroke="#7000FF" strokeWidth="1.5" className="portal-pulse-ring origin-center" />
            <circle r="4.5" fill="#7000FF" filter="url(#portal-glow)" />
            <text x="0" y="-12" textAnchor="middle" fill="rgba(112, 0, 255, 0.8)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1" className="font-bold select-none">DATA-CORE</text>
          </g>

          {/* Node 3: Top-Right */}
          <g className="cyber-float-node" transform="translate(850, 150)">
            <circle r="12" fill="none" stroke="#F539B5" strokeWidth="1.5" className="portal-pulse-ring origin-center" />
            <circle r="4.5" fill="#F539B5" filter="url(#neon-glow-pink)" />
            <text x="-14" y="4" textAnchor="end" fill="rgba(245, 57, 181, 0.8)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1" className="font-bold select-none">GATEWAY-02</text>
            <text x="-14" y="14" textAnchor="end" fill="rgba(148, 163, 184, 0.4)" fontSize="6" fontFamily="var(--font-mono)" className="select-none">SECURE_LINK</text>
          </g>

          {/* Node 4: Bottom-Left */}
          <g className="cyber-float-node" transform="translate(220, 380)">
            <circle r="12" fill="none" stroke="#F539B5" strokeWidth="1.5" className="portal-pulse-ring origin-center" />
            <circle r="4.5" fill="#F539B5" filter="url(#neon-glow-pink)" />
            <text x="14" y="4" fill="rgba(245, 57, 181, 0.8)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1" className="font-bold select-none">CYPHER-NODE</text>
          </g>

          {/* Node 5: Bottom-Right */}
          <g className="cyber-float-node" transform="translate(780, 380)">
            <circle r="12" fill="none" stroke="#00F2FE" strokeWidth="1.5" className="portal-pulse-ring origin-center" />
            <circle r="4.5" fill="#00F2FE" filter="url(#portal-glow)" />
            <text x="-14" y="4" textAnchor="end" fill="rgba(6, 182, 212, 0.8)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1" className="font-bold select-none">LINK-GATEWAY</text>
            <text x="-14" y="14" textAnchor="end" fill="rgba(148, 163, 184, 0.4)" fontSize="6" fontFamily="var(--font-mono)" className="select-none">EST_CONNECTION</text>
          </g>
        </g>

        {/* Binary / Telemetry floating blocks */}
        <g id="telemetry-decorations" opacity="0.35">
          {/* Top Left */}
          <g transform="translate(40, 60)" className="telemetry-blink">
            <rect width="45" height="18" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.8" />
            <text x="4" y="12" fill="#00F2FE" fontSize="6.5" fontFamily="var(--font-mono)">SYS_OK: 99%</text>
          </g>

          {/* Bottom Left */}
          <g transform="translate(50, 430)" className="telemetry-blink">
            <text x="0" y="0" fill="rgba(148, 163, 184, 0.6)" fontSize="7" fontFamily="var(--font-mono)">[ENCRYPTED_PORT]</text>
            <text x="0" y="10" fill="rgba(148, 163, 184, 0.6)" fontSize="7" fontFamily="var(--font-mono)">PROTOCOL: AES_256</text>
          </g>

          {/* Top Right */}
          <g transform="translate(860, 50)" className="telemetry-blink">
            <text x="0" y="10" fill="#00F2FE" fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold">LINK ACTIVE</text>
            <circle cx="-10" cy="7" r="3.5" fill="#10B981" />
          </g>

          {/* Bottom Right */}
          <g transform="translate(840, 430)" className="telemetry-blink">
            <rect width="60" height="24" fill="none" stroke="rgba(112, 0, 255, 0.25)" strokeWidth="0.8" />
            <text x="5" y="10" fill="rgba(148, 163, 184, 0.6)" fontSize="6" fontFamily="var(--font-mono)">DATA SPEED</text>
            <text x="5" y="19" fill="#7000FF" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="bold">1.24 GB/S</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
