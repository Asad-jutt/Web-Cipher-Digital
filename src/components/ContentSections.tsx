import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Shield, Globe, Cpu, Layers, ExternalLink, 
  Database, Flame, Zap, Waves, Activity, Terminal,
  Network, MessagesSquare, Linkedin, Twitter, Github, Send
} from 'lucide-react';
import { SectionId, WaveConfig, PortfolioItem } from '../types';
import { fetchProjectsFromSanity, isSanityConfigured } from '../lib/sanity';
import AuroraCanvas from './AuroraCanvas';
import NeuroCanvas from './NeuroCanvas';
import VelocityCanvas from './VelocityCanvas';
import TestimonialsSection from './TestimonialsSection';
import CyberPortalBackground from './CyberPortalBackground';
import WorkSection from './WorkSection';
import SciFiFooter from './SciFiFooter';

interface ContentSectionsProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  waveConfig: WaveConfig;
  setWaveConfig: (config: WaveConfig) => void;
  onOpenWizard: () => void;
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'neuro-link',
    title: 'Neuro Link',
    category: 'DATA VISUALIZATION / HEALTHCARE',
    description: 'An interactive medical-tech intelligence portal mapping complex neural pathways. Driven by Sanity CMS live-preview schemas and Astro\'s ultra-lean modern runtime architecture.',
    client: 'Vortex Labs',
    year: '2026',
    tags: ['Astro Hydration', 'Sanity Live Query', 'Organic Canvas', 'D3 Mapping'],
    mockStats: [
      { label: 'BIOSIGNAL SAMPLE RATE', value: '96 kHz' },
      { label: 'PATHWAY RESOLUTION', value: '18,400 Nodes' },
      { label: 'RENDER RATE', value: '60 FPS Locked' }
    ]
  },
  {
    id: 'velocity-dashboard',
    title: 'Velocity Dashboard',
    category: 'IMMERSIVE UI / AI RESEARCH',
    description: 'A cutting-edge research interface displaying dimensional AI tensor grids. Powered by Astro Server Islands and Sanity Schema DSLs with custom high-fidelity responsive 3D hulls.',
    client: 'Aether Corp',
    year: '2026',
    tags: ['Astro Server Islands', 'Sanity Schema DSL', '3D Projections', 'Dynamic Hulls'],
    mockStats: [
      { label: 'MODEL PARAMETERS', value: '70B Active' },
      { label: 'MESH COMPLEXITY', value: '4,200 Facets' },
      { label: 'LATENCY JITTER', value: '< 0.2ms' }
    ]
  },
  {
    id: 'aurora-engine',
    title: 'Aurora Engine',
    category: 'WEB EXPERIENCE / FINTECH',
    description: 'A high-performance trading dashboard rendering dynamic, multi-threaded market data streams. Powered by Astro SSG and structured Sanity content models with real-time risk assessment projections.',
    client: 'Quantum Finance',
    year: '2026',
    tags: ['Astro Framework', 'Sanity Headless CMS', 'WebGL Canvas', 'Sine Matrices'],
    mockStats: [
      { label: 'TRANSACTION LATENCY', value: '< 0.8ms' },
      { label: 'COMPUTE COMPLEXITY', value: 'O(N)' },
      { label: 'GLOW DENSITY', value: '98.7%' }
    ]
  }
];

const LABS_PRESETS = [
  {
    name: 'ASTRO LIGHTSPEED',
    desc: 'Blazing fast SSG compilation. High-velocity double-sine ripples with a glowing spectrum.',
    icon: Flame,
    color: 'text-brand-pink',
    config: {
      amplitude: 160,
      frequency: 2.8,
      speed: 1.1,
      colorMode: 'magenta-pink' as const,
      density: 110,
      distortion: 1.8,
      noise: 0.8
    }
  },
  {
    name: 'SANITY GRAPH CORE',
    desc: 'Faint, precise, low-frequency emerald tech mesh representing structured content queries.',
    icon: Activity,
    color: 'text-emerald-400',
    config: {
      amplitude: 60,
      frequency: 1.4,
      speed: 0.4,
      colorMode: 'matrix-green' as const,
      density: 150,
      distortion: 0.8,
      noise: 0.2
    }
  },
  {
    name: 'ASTRO SERVER ISLANDS',
    desc: 'Dynamic, isolated high-performance server islands on a deep space cosmic grid.',
    icon: Waves,
    color: 'text-brand-purple',
    config: {
      amplitude: 230,
      frequency: 1.8,
      speed: 0.8,
      colorMode: 'multi-glow' as const,
      density: 90,
      distortion: 2.0,
      noise: 0.6
    }
  },
  {
    name: 'SANITY LIVE SYNC',
    desc: 'High-frequency real-time update triggers feeding the interactive client layout.',
    icon: Zap,
    color: 'text-brand-cyan',
    config: {
      amplitude: 100,
      frequency: 3.5,
      speed: 1.8,
      colorMode: 'cyan-purple' as const,
      density: 130,
      distortion: 1.5,
      noise: 1.2
    }
  }
];

export default function ContentSections({ 
  activeSection, 
  setActiveSection, 
  waveConfig, 
  setWaveConfig,
  onOpenWizard
}: ContentSectionsProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_DATA);
  const [isSanityLoading, setIsSanityLoading] = useState(false);

  useEffect(() => {
    async function loadSanityProjects() {
      if (!isSanityConfigured) return;
      setIsSanityLoading(true);
      const data = await fetchProjectsFromSanity();
      if (data && data.length > 0) {
        setPortfolioItems(data);
      }
      setIsSanityLoading(false);
    }
    loadSanityProjects();
  }, []);

  const [copiedCoordinates, setCopiedCoordinates] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', projectType: '', message: '' });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const [tiltX, setTiltX] = useState(5);
  const [tiltY, setTiltY] = useState(-8);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Smooth range values (-12 to 12)
    const rY = (mouseX / width) * 24;
    const rX = -(mouseY / height) * 24;
    setTiltX(rX);
    setTiltY(rY);
  };

  const handleCardMouseLeave = () => {
    setTiltX(5);
    setTiltY(-8);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    setSubmitStatus('');
    
    setTimeout(() => {
      setIsSubmittingForm(false);
      setSubmitStatus('INTEL SECURELY TRANSMITTED. CYPHER ENGINE HAS QUEUED YOUR COMMUNICATOR ROUTE.');
      setContactForm({ name: '', email: '', projectType: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 1800);
  };

  const handlePresetApply = (presetName: string, config: WaveConfig) => {
    setWaveConfig(config);
    // Visual flash confirmation on page
    const notification = document.createElement('div');
    notification.className = "fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/50 text-brand-cyan text-xs font-mono tracking-widest rounded-lg shadow-lg z-50 pointer-events-none uppercase transition-all duration-300 transform scale-95 opacity-0";
    notification.innerText = `Matrix Preset Applied: ${presetName}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('scale-95', 'opacity-0');
      notification.classList.add('scale-100', 'opacity-100');
    }, 10);

    setTimeout(() => {
      notification.classList.add('scale-95', 'opacity-0');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  const copyCoordinatesToClipboard = () => {
    navigator.clipboard.writeText("LAT: 37.7749° N, LONG: 122.4194° W");
    setCopiedCoordinates(true);
    setTimeout(() => setCopiedCoordinates(false), 2000);
  };

  return (
    <div
      id="content-sections-wrapper"
      className="relative z-10 w-full px-6 md:px-24 lg:px-40 flex flex-col"
    >
      {/* 01 / HERO SECTION — full viewport height */}
      <section
        id="section-hero"
        className="max-w-4xl mx-auto text-center space-y-8 min-h-screen flex flex-col items-center justify-center scroll-mt-24 w-full"
      >
        {/* Tagline Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full select-none">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
          <span className="text-[9px] font-mono tracking-[0.25em] text-white">
            UTC SYNCHRONIZED — DECODING DIGITAL COMPLEXITY
          </span>
        </div>

        {/* Large display headline as seen in the screenshot */}
        <h1
          id="hero-main-title"
          className="text-4xl sm:text-6xl md:text-7.5xl font-sans font-bold tracking-tight text-white leading-none uppercase select-none relative"
        >
          DECODING DIGITAL <br />
          <span className="text-gradient hover:animate-glitch">COMPLEXITY</span>
        </h1>

        {/* Subheading text as seen in the screenshot */}
        <p
          id="hero-subtitle"
          className="text-sm sm:text-base text-slate-300 font-sans tracking-[0.15em] max-w-2xl mx-auto font-medium"
        >
          WE CREATE IMMERSIVE, HIGH-FIDELITY, ASTRO & SANITY CMS POWERED DIGITAL EXPERIENCES.
        </p>

        {/* Call to action Explore Our Work button */}
        <div className="pt-4">
          <button
            id="hero-explore-cta"
            onClick={() => setActiveSection('portfolio')}
            className="px-8 py-3.5 rounded-lg border border-brand-cyan/40 hover:border-brand-pink/80 bg-slate-950/40 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_0_20px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(245,57,181,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3.5 mx-auto group"
          >
            <span>EXPLORE OUR WORK [-&gt;]</span>
          </button>
        </div>
      </section>

      {/* 02 / PORTFOLIO WORK SECTION */}
      <WorkSection
        portfolioItems={portfolioItems}
        isSanityLoading={isSanityLoading}
        onSelectProject={setSelectedProject}
        onOpenWizard={onOpenWizard}
      />

      {/* Project Details Modal Slider Drawer Overlay */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-all duration-300">
            <div 
              onClick={() => setSelectedProject(null)} 
              className="absolute inset-0 cursor-pointer" 
            />
            <div
              id="portfolio-drawer-panel"
              className="relative w-full max-w-lg bg-slate-950 border-l border-slate-800/80 p-8 flex flex-col justify-between overflow-y-auto h-full border-glow-purple shadow-2xl"
            >
              <div className="space-y-6">
                {/* Close drawer button */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                    INTEL FILE // SECURED
                  </span>
                  <button
                    id="close-drawer-btn"
                    onClick={() => setSelectedProject(null)}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    Close [x]
                  </button>
                </div>

                {/* Banner Info */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <span className="text-[10px] font-mono text-brand-cyan tracking-widest uppercase">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-3xl font-sans font-bold text-white leading-none tracking-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Metadata matrix */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-900">
                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900">
                    <span className="block text-[9px] font-mono text-slate-600 uppercase">CLIENT PARTNER</span>
                    <span className="text-xs font-sans font-bold text-slate-200">{selectedProject.client}</span>
                  </div>
                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900">
                    <span className="block text-[9px] font-mono text-slate-600 uppercase">RELEASE DATE</span>
                    <span className="text-xs font-sans font-bold text-slate-200">{selectedProject.year}</span>
                  </div>
                </div>

                {/* Diagnostic stats graphs (Simulating metrics values) */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                    INTEGRATED TELEMETRY
                  </span>
                  <div className="space-y-2.5">
                    {selectedProject.mockStats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between text-xs font-mono p-2.5 rounded bg-slate-900/40 border border-slate-900">
                        <span className="text-slate-500">{stat.label}</span>
                        <span className="text-brand-cyan font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Foot Action CTA */}
              <div className="pt-8 border-t border-slate-900 flex items-center justify-between">
                <button
                  id="drawer-intel-cta"
                  onClick={onOpenWizard}
                  className="flex-1 py-3 text-center rounded-lg bg-gradient-to-r from-brand-cyan to-brand-purple text-slate-950 font-mono text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                >
                  DEPLOY SIMILAR ARCHITECTURE <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      {/* 03 / TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 04 / LABS SECTION */}
      <section
        id="section-labs"
        className="max-w-4xl mx-auto py-20 md:py-32 w-full space-y-10 border-t border-slate-900/40 scroll-mt-24"
      >
        <div className="space-y-2 text-center md:text-left">
          <span className="font-mono text-[10px] text-brand-pink tracking-[0.25em] uppercase">
            04 // DIGITAL EXPERIMENTS
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
            WAVE MATRICES PLAYGROUND
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
            Our background grid is completely math-driven in Canvas. Toggle any of these digital presets to inject a wave transformation directly into the render loop.
          </p>
        </div>

        {/* Preset Trigger Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LABS_PRESETS.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <button
                id={`preset-card-${preset.name.toLowerCase().replace(/ /g, '-')}`}
                key={preset.name}
                onClick={() => handlePresetApply(preset.name, preset.config)}
                className="text-left bg-slate-950/60 hover:bg-slate-900/40 border border-slate-900 hover:border-brand-cyan/40 p-5 rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.01] flex items-start gap-4 relative overflow-hidden"
              >
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${preset.color} group-hover:border-brand-cyan/30 transition-colors`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1 pr-4">
                  <h4 className="font-sans font-bold text-sm text-white group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
                    <span>{preset.name}</span>
                    <Terminal className="w-3 h-3 text-slate-600 group-hover:text-brand-pink transition-colors" />
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-normal line-clamp-2">
                    {preset.desc}
                  </p>
                </div>
                <div className="absolute bottom-2.5 right-4 font-mono text-[8px] text-slate-700 font-semibold tracking-wider uppercase">
                  Inject Matrix
                </div>
              </button>
            );
          })}
        </div>

        {/* Sandbox code block visual snippet */}
        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 font-mono text-[10px] text-slate-400 leading-normal border-glow-purple relative overflow-hidden">
          <div className="absolute top-2.5 right-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-[8px] text-slate-600">LIVE COMPILE</span>
          </div>
          <span className="block text-brand-cyan mb-1">// RENDER MATRIX UPDATE</span>
          <span className="text-slate-500">const</span> wave = (<span className="text-brand-pink">dx</span>, <span className="text-brand-pink">dy</span>) =&gt; &#123;<br />
          &nbsp;&nbsp;<span className="text-slate-500">const</span> d = Math.sqrt(dx * dx + dy * dy);<br />
          &nbsp;&nbsp;<span className="text-slate-500">return</span> Math.sin(d * <span className="text-brand-purple">{waveConfig.frequency}</span> - t) * Math.cos(dx * 0.002) * <span className="text-brand-pink">{waveConfig.amplitude}</span>;<br />
          &#125;;
        </div>
      </section>

      {/* 05 / CONTACT SECTION */}
      <section
        id="section-contact"
        className="relative max-w-5xl mx-auto py-20 md:py-32 w-full space-y-12 border-t border-slate-950/80 scroll-mt-24 overflow-hidden rounded-3xl px-4 md:px-8 select-none"
      >
        {/* Interactive Cyber Portal Background with GSAP animations */}
        <CyberPortalBackground />

        {/* Content layout relative for floating over the map */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          
          {/* Header & Subtitle matching the picture exactly */}
          <div className="space-y-2 select-none">
            <span className="font-mono text-xs font-bold text-slate-500 tracking-[0.25em] block uppercase mb-1">
              05:
            </span>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-white tracking-[0.05em] uppercase leading-tight">
              CONTACT -
            </h2>
            <h2 className="text-3xl md:text-[38px] font-sans font-black text-white tracking-[0.05em] uppercase leading-tight">
              ENGAGE & COLLABORATE
            </h2>
            
            <p className="text-slate-400 font-sans font-bold text-[11px] md:text-xs tracking-[0.12em] uppercase max-w-xl mx-auto pt-4 leading-relaxed">
              READY TO ADVANCE YOUR PROJECT?<br />
              LET'S TALK INNOVATION.
            </p>
          </div>

          {/* Three high-tech channel indicators with custom glowing SVGs matching the reference image */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl pt-2">
            <div className="flex flex-col items-center py-2 transition-all duration-300 group cursor-default">
              <div className="mb-3 transition-transform duration-500 group-hover:scale-110">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="filter drop-shadow-[0_0_8px_rgba(112,0,255,0.4)]">
                  {/* Neural Net connections */}
                  <line x1="10" y1="10" x2="30" y2="5" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="10" y1="10" x2="30" y2="15" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="10" y1="20" x2="30" y2="15" stroke="#F539B5" strokeWidth="1" opacity="0.5" />
                  <line x1="10" y1="20" x2="30" y2="25" stroke="#F539B5" strokeWidth="1" opacity="0.5" />
                  <line x1="10" y1="30" x2="30" y2="25" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="10" y1="30" x2="30" y2="35" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="5" x2="50" y2="10" stroke="#00F2FE" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="15" x2="50" y2="10" stroke="#00F2FE" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="15" x2="50" y2="20" stroke="#00F2FE" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="25" x2="50" y2="20" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="25" x2="50" y2="30" stroke="#7000FF" strokeWidth="1" opacity="0.5" />
                  <line x1="30" y1="35" x2="50" y2="30" stroke="#F539B5" strokeWidth="1" opacity="0.5" />
                  
                  {/* Nodes */}
                  <circle cx="10" cy="10" r="2.5" fill="#7000FF" />
                  <circle cx="10" cy="20" r="2.5" fill="#7000FF" />
                  <circle cx="10" cy="30" r="2.5" fill="#7000FF" />
                  <circle cx="30" cy="5" r="2.5" fill="#F539B5" />
                  <circle cx="30" cy="15" r="2.5" fill="#F539B5" />
                  <circle cx="30" cy="25" r="2.5" fill="#F539B5" />
                  <circle cx="30" cy="35" r="2.5" fill="#F539B5" />
                  <circle cx="50" cy="10" r="2.5" fill="#00F2FE" />
                  <circle cx="50" cy="20" r="2.5" fill="#00F2FE" />
                  <circle cx="50" cy="30" r="2.5" fill="#00F2FE" />
                </svg>
              </div>
              <span className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-widest">PROJECT INQUIRIES</span>
            </div>

            <div className="flex flex-col items-center py-2 transition-all duration-300 group cursor-default">
              <div className="mb-3 transition-transform duration-500 group-hover:scale-110">
                <svg width="50" height="40" viewBox="0 0 50 40" fill="none" className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  {/* Outer circle */}
                  <circle cx="25" cy="20" r="16" stroke="#00F2FE" strokeWidth="1" opacity="0.8" />
                  {/* Longitudes & Latitudes */}
                  <ellipse cx="25" cy="20" rx="16" ry="5" stroke="#00F2FE" strokeWidth="0.8" opacity="0.6" />
                  <ellipse cx="25" cy="20" rx="5" ry="16" stroke="#00F2FE" strokeWidth="0.8" opacity="0.6" />
                  <line x1="9" y1="20" x2="41" y2="20" stroke="#00F2FE" strokeWidth="0.8" opacity="0.5" />
                  <line x1="25" y1="4" x2="25" y2="36" stroke="#00F2FE" strokeWidth="0.8" opacity="0.5" />
                  <circle cx="25" cy="20" r="1.5" fill="#00F2FE" />
                </svg>
              </div>
              <span className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-widest">PARTNERSHIPS</span>
            </div>

            <div className="flex flex-col items-center py-2 transition-all duration-300 group cursor-default">
              <div className="mb-3 transition-transform duration-500 group-hover:scale-110">
                <svg width="50" height="40" viewBox="0 0 50 40" fill="none" className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  {/* Chat Bubbles */}
                  <rect x="4" y="4" width="28" height="20" rx="4" stroke="#00F2FE" strokeWidth="1.5" fill="rgba(8, 14, 28, 0.4)" />
                  <path d="M8,24 L8,29 L14,24" stroke="#00F2FE" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(8, 14, 28, 0.4)" />
                  <line x1="8" y1="10" x2="28" y2="10" stroke="#00F2FE" strokeWidth="1" opacity="0.8" />
                  <line x1="8" y1="14" x2="24" y2="14" stroke="#00F2FE" strokeWidth="1" opacity="0.8" />
                  <line x1="8" y1="18" x2="20" y2="18" stroke="#00F2FE" strokeWidth="1" opacity="0.8" />
                  <rect x="22" y="14" width="22" height="16" rx="3" stroke="#F539B5" strokeWidth="1.2" fill="rgba(8, 14, 28, 0.4)" />
                  <path d="M39,30 L39,34 L35,30" stroke="#F539B5" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(8, 14, 28, 0.4)" />
                  <line x1="26" y1="19" x2="40" y2="19" stroke="#F539B5" strokeWidth="0.8" opacity="0.8" />
                  <line x1="26" y1="22" x2="36" y2="22" stroke="#F539B5" strokeWidth="0.8" opacity="0.8" />
                </svg>
              </div>
              <span className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-widest">CONSULTATIONS</span>
            </div>
          </div>

          {/* 3D Immersive Tilting Card Container matching image exactly */}
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`,
              transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="w-full max-w-lg bg-slate-950/30 border border-slate-800/80 rounded-[20px] p-6 md:p-8 border-glow-cyan shadow-3xl backdrop-blur-md relative overflow-hidden text-left space-y-5"
          >
            {/* Subtle gloss ray underlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            <form onSubmit={handleContactSubmit} className="space-y-4 relative z-10">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-[#0a0f1d]/40 border border-cyan-500/25 focus:border-brand-cyan focus:outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all focus:ring-1 focus:ring-brand-cyan/20 font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-[#0a0f1d]/40 border border-purple-500/20 focus:border-brand-purple focus:outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all focus:ring-1 focus:ring-brand-purple/20 font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Project Type"
                  value={contactForm.projectType}
                  onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}
                  className="w-full bg-[#0a0f1d]/40 border border-violet-500/20 focus:border-brand-purple focus:outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all focus:ring-1 focus:ring-brand-purple/20 font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  required
                  placeholder="Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-[#0a0f1d]/40 border border-cyan-500/20 focus:border-brand-cyan focus:outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all focus:ring-1 focus:ring-brand-cyan/20 font-sans resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>

              {submitStatus ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-[10px] text-emerald-400 font-mono text-center">
                  {submitStatus}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full py-4 rounded-xl font-sans text-xs uppercase tracking-[0.18em] font-extrabold bg-[#00F2FE] hover:bg-[#00f2fe]/90 text-slate-950 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_0_25px_rgba(0,242,254,0.7)] hover:shadow-[0_0_35px_rgba(0,242,254,0.9)] border border-cyan-300 disabled:opacity-40 select-none"
              >
                {isSubmittingForm ? 'TRANSMITTING INTEL...' : 'SEND MESSAGE'}
                <Send className="w-3.5 h-3.5 ml-1" />
              </button>
            </form>
          </div>

          {/* Socials Link group matching picture */}
          <div className="flex items-center gap-6 pt-2 text-slate-500">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-brand-cyan transition-all hover:scale-110"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-brand-pink transition-all hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-brand-purple transition-all hover:scale-110"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

        </div>
      </section>

      {/* 06 / SCI-FI CYBERPUNK FOOTER */}
      <SciFiFooter setActiveSection={setActiveSection} />
    </div>
  );
}
