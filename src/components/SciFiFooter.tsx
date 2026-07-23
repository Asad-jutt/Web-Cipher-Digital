import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUp, Terminal, Cpu, ShieldAlert, Radio, Globe, 
  Send, Sparkles, Wifi, ShieldCheck, Activity, Layers
} from 'lucide-react';
import ThreeWireframeGrid from './ThreeWireframeGrid';
import MagneticButton from './MagneticButton';
import { SectionId } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface SciFiFooterProps {
  setActiveSection?: (id: SectionId) => void;
}

export default function SciFiFooter({ setActiveSection }: SciFiFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [utcTime, setUtcTime] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ping, setPing] = useState(16);

  // Live UTC Clock with millisecond precision
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds}.${ms} UTC`);
    };

    const interval = setInterval(updateClock, 30);
    return () => clearInterval(interval);
  }, []);

  // Simulate subtle ping fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(14 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const footerEl = footerRef.current;
    const contentEl = contentRef.current;
    if (!footerEl || !contentEl) return;

    const columns = contentEl.querySelectorAll('.gsap-footer-col');

    gsap.fromTo(
      columns,
      {
        y: 80,
        opacity: 0,
        scale: 0.96,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActiveSection) {
      setActiveSection('hero');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubmitted(false);
    }, 4000);
  };

  const navigateTo = (sectionId: SectionId) => {
    if (setActiveSection) {
      setActiveSection(sectionId);
    }
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#030305] text-[#f3f4f6] pt-24 pb-16 px-4 md:px-12 border-t border-slate-900 overflow-hidden font-sans select-none"
    >
      {/* 1. Persistent Low-Poly Wireframe Grid Floor (Three.js WebGL) */}
      <ThreeWireframeGrid className="opacity-70 h-[450px] bottom-0 top-auto" intensity={1.2} />

      {/* Top Ambient Glow Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent shadow-[0_0_20px_#00f0ff]" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        
        {/* 2. System Diagnostics Readout Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#060812]/80 border border-slate-900/90 backdrop-blur-md font-mono text-[10px] md:text-xs">
          <div className="flex items-center gap-2.5 text-slate-400">
            <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <div>
              <span className="block text-[8px] text-slate-600 uppercase tracking-widest">LIVE TIME INDEX</span>
              <span className="text-[#00f0ff] font-bold">{utcTime || '14:52:00.00 UTC'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-[8px] text-slate-600 uppercase tracking-widest">NETWORK LATENCY</span>
              <span className="text-emerald-400 font-bold">{ping} ms // 60 FPS LOCK</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#8a2be2]" />
            <div>
              <span className="block text-[8px] text-slate-600 uppercase tracking-widest">SYSTEM VERSION</span>
              <span className="text-[#8a2be2] font-bold">CYPHER-OS v4.9.0</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400">
            <Activity className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[8px] text-slate-600 uppercase tracking-widest">CORE STATUS</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE // NODE 01
              </span>
            </div>
          </div>
        </div>

        {/* 3. Main Footer Grid Layout (Staggered Entrance) */}
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Column 1: Brand & Sci-Fi Mission Statement */}
          <div className="gsap-footer-col md:col-span-4 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00f0ff] rounded-xs rotate-45 shadow-[0_0_10px_#00f0ff]" />
                <span className="font-mono text-xs text-[#00f0ff] tracking-[0.25em] uppercase font-bold">
                  WEB CIPHER DIGITAL
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-wider text-white uppercase font-sans leading-tight">
                BUILDING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#f472b6]">HYPER-DIGITAL</span> FUTURE
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              We design cutting-edge, high-performance web applications powered by Three.js WebGL graphics, GSAP micro-interactions, and Sanity CMS live query infrastructure.
            </p>

            <div className="pt-2 flex items-center gap-3 font-mono text-[10px] text-slate-500">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                AES-256 ENCRYPTED
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-purple-400">
                GLOBAL EDGE
              </span>
            </div>
          </div>

          {/* Column 2: Architecture Navigation */}
          <div className="gsap-footer-col md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-900 pb-2 flex items-center justify-between">
              <span>SYSTEM MATRIX</span>
              <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {[
                { id: 'hero' as SectionId, label: '[01] HERO CORE' },
                { id: 'portfolio' as SectionId, label: '[02] WORK PORTFOLIO' },
                { id: 'testimonials' as SectionId, label: '[03] CLIENT INTEL' },
                { id: 'labs' as SectionId, label: '[04] WAVE LABS' },
                { id: 'contact' as SectionId, label: '[05] CONTACT PROTOCOL' },
              ].map((item) => (
                <li key={item.id}>
                  <MagneticButton
                    strength={0.25}
                    onClick={() => navigateTo(item.id)}
                    className="text-slate-400 hover:text-[#00f0ff] transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="text-[10px] text-slate-600 group-hover:text-[#00f0ff] transition-colors">&gt;</span>
                    <span className="tracking-wider">{item.label}</span>
                  </MagneticButton>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tech Capabilities */}
          <div className="gsap-footer-col md:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-900 pb-2 flex items-center justify-between">
              <span>CAPABILITIES</span>
              <Layers className="w-3.5 h-3.5 text-[#8a2be2]" />
            </h4>
            <ul className="space-y-2 font-mono text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#00f0ff]" />
                Three.js Shaders
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#8a2be2]" />
                GSAP ScrollTrigger
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-pink-500" />
                GLSL Chromatic FX
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Sanity CMS Live
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Astro Islands
              </li>
            </ul>
          </div>

          {/* Column 4: Cyber Transmission (Newsletter) */}
          <div className="gsap-footer-col md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-900 pb-2 flex items-center justify-between">
              <span>FREQUENCY TRANSMISSION</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Subscribe to receive classified architectural breakdowns & WebGL updates.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="enter_cyber_address@domain.io"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#080c1a]/90 border border-slate-800 focus:border-[#00f0ff] focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 font-mono transition-all focus:ring-1 focus:ring-[#00f0ff]/30 shadow-inner"
                />
              </div>

              {isSubmitted ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] text-center animate-pulse">
                  ✓ FREQUENCY CONNECTED // SIGNAL CONFIRMED
                </div>
              ) : (
                <MagneticButton strength={0.2} className="w-full">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#f472b6] text-slate-950 font-mono text-xs uppercase font-extrabold tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
                  >
                    <span>CONNECT FREQUENCY</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </MagneticButton>
              )}
            </form>
          </div>

        </div>

        {/* 4. Giant Cyber Back To Top Control Button */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
            <span className="text-[#00f0ff] font-bold">&copy; 2026</span>
            <span>WEB CIPHER DIGITAL. ALL RIGHTS RESERVED.</span>
          </div>

          <MagneticButton strength={0.4} onClick={scrollToTop}>
            <div className="group relative px-6 py-3.5 rounded-xl bg-[#080d1e] border border-[#00f0ff]/40 hover:border-[#00f0ff] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(0,242,254,0.15)] hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] transition-all cursor-pointer overflow-hidden">
              <span className="relative z-10 text-[#00f0ff]">BACK TO TOP</span>
              <div className="relative z-10 p-1.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] group-hover:-translate-y-1 transition-transform">
                <ArrowUp className="w-4 h-4" />
              </div>
              
              {/* Corner crosshair accents */}
              <span className="absolute top-1 left-1 text-[8px] text-[#00f0ff]/40 font-mono">+</span>
              <span className="absolute top-1 right-1 text-[8px] text-[#00f0ff]/40 font-mono">+</span>
              <span className="absolute bottom-1 left-1 text-[8px] text-[#00f0ff]/40 font-mono">+</span>
              <span className="absolute bottom-1 right-1 text-[8px] text-[#00f0ff]/40 font-mono">+</span>
            </div>
          </MagneticButton>
        </div>

      </div>
    </footer>
  );
}
