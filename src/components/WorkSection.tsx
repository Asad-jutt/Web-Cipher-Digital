import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink, Cpu, Sparkles, Layers, Activity } from 'lucide-react';
import { PortfolioItem } from '../types';
import ShaderProjectCard from './ShaderProjectCard';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface WorkSectionProps {
  portfolioItems: PortfolioItem[];
  isSanityLoading: boolean;
  onSelectProject: (project: PortfolioItem) => void;
  onOpenWizard: () => void;
}

export default function WorkSection({
  portfolioItems,
  isSanityLoading,
  onSelectProject,
  onOpenWizard,
}: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // GSAP 3D Stack Deck Opening Scroll Animation for Cards
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const cardsEl = cardsContainerRef.current;
    if (!sectionEl || !cardsEl) return;

    const cards = Array.from(cardsEl.querySelectorAll<HTMLElement>('.gsap-work-card'));
    if (cards.length === 0) return;

    // Set 3D perspective container
    gsap.set(cardsEl, { perspective: 1400, transformStyle: 'preserve-3d' });

    const ctx = gsap.context(() => {
      // Set initial compact 3D stacked deck positions
      cards.forEach((card, i) => {
        gsap.set(card as HTMLElement, {
          y: i === 0 ? 0 : -i * 190,
          scale: 1 - i * 0.05,
          rotateX: -14 * i,
          rotateZ: (i % 2 === 0 ? 1 : -1) * (i * 2.5),
          z: -60 * i,
          transformOrigin: 'center top',
          opacity: i === 0 ? 1 : Math.max(0.15, 1 - i * 0.25),
          filter: i === 0 ? 'brightness(1)' : `brightness(${Math.max(0.3, 1 - i * 0.2)})`,
        });
      });

      // High-end ScrollTrigger animation opening the stack smoothly
      gsap.to(cards, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateZ: 0,
        z: 0,
        opacity: 1,
        filter: 'brightness(1)',
        duration: 1.3,
        stagger: {
          amount: 0.5,
          ease: 'power2.inOut',
        },
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, [portfolioItems, isSanityLoading]);

  // Determine shader theme based on project id/title
  const getThemeForProject = (project: PortfolioItem): 'cyan' | 'purple' | 'pink' | 'emerald' => {
    const lower = (project.id + ' ' + project.title).toLowerCase();
    if (lower.includes('aurora')) return 'cyan';
    if (lower.includes('neuro')) return 'purple';
    if (lower.includes('velocity')) return 'pink';
    return 'emerald';
  };

  return (
    <section
      id="section-portfolio"
      ref={sectionRef}
      className="relative w-full max-w-6xl mx-auto py-20 md:py-32 scroll-mt-24 font-sans select-none"
    >
      {/* Ambient Gradient Bridge merging Hero into Work Section */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[150%] max-w-5xl h-[280px] bg-gradient-to-b from-[#00f0ff]/15 via-[#7000FF]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] max-w-4xl h-[200px] bg-gradient-to-b from-[#f539b5]/8 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        
        {/* Left Column: Heading (02 / WORK / IMMERSIVE PROJECTS / DEPLOYED) */}
        <div className="md:col-span-5 space-y-4 md:sticky md:top-24 select-none pr-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#00f0ff] tracking-[0.25em] font-bold block">
              02 // ARCHITECTURE MATRIX
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00f0ff]/40 to-transparent" />
          </div>

          <div className="space-y-1">
            <h2 className="font-sans font-black text-3xl md:text-[38px] text-white tracking-[0.12em] uppercase leading-none">
              WORK:
            </h2>
            <h2 className="font-sans font-black text-3xl md:text-[38px] text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#f472b6] tracking-[0.12em] uppercase leading-none">
              IMMERSIVE PROJECTS
            </h2>
            <h2 className="font-sans font-black text-3xl md:text-[38px] text-white tracking-[0.12em] uppercase leading-none">
              DEPLOYED
            </h2>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed pt-2">
            Explore our high-fidelity digital builds featuring GLSL shader canvases, real-time telemetry, and Sanity CMS live query infrastructure.
          </p>

          <div className="pt-4">
            <MagneticButton strength={0.3} onClick={onOpenWizard}>
              <div className="px-6 py-3 rounded-xl bg-[#080d1e] border border-[#00f0ff]/40 hover:border-[#00f0ff] text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>INITIATE CUSTOM BUILD</span>
              </div>
            </MagneticButton>
          </div>
        </div>

        {/* Right Column: Stacked Interactive Work Cards */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Stack Deck Indicator Banner */}
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-900/80">
            <span className="flex items-center gap-2 text-[#00f0ff] font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
              <span>3D CARD STACK MATRIX (SCROLL TO OPEN)</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#080d1e] border border-slate-800 text-[#00f0ff]/80">
              {portfolioItems.length} DEPLOYED BUILDS
            </span>
          </div>

          <div ref={cardsContainerRef} className="flex flex-col gap-6 relative">
            {isSanityLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#050711]/60 border border-slate-900 rounded-2xl">
                <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-[0.2em] animate-pulse">
                  STREAMING SANITY CMS TELEMETRY...
                </span>
              </div>
            ) : (
              portfolioItems.map((project, index) => {
                const theme = getThemeForProject(project);

                return (
                  <div
                    id={`portfolio-item-${project.id}`}
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="gsap-work-card group relative bg-[#040409]/95 border border-slate-900 hover:border-[#00f0ff]/40 rounded-2xl p-6 md:p-8 min-h-[210px] cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.015] overflow-hidden flex flex-col justify-between"
                    style={{
                      boxShadow: theme === 'cyan'
                        ? '0 0 35px rgba(0, 242, 254, 0.05)'
                        : theme === 'purple'
                        ? '0 0 35px rgba(168, 85, 247, 0.05)'
                        : theme === 'pink'
                        ? '0 0 35px rgba(244, 114, 182, 0.05)'
                        : '0 0 35px rgba(16, 185, 129, 0.05)',
                    }}
                  >
                    {/* 1. Interactive Three.js Custom GLSL Fragment Shader Hover Canvas */}
                    <ShaderProjectCard
                      theme={theme}
                      title={project.title}
                      category={project.category}
                    />

                    {/* Top Glowing Laser Line on Hover */}
                    <div className={`absolute top-0 left-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full ${
                      theme === 'cyan' ? 'bg-gradient-to-r from-[#00f0ff] to-emerald-400' :
                      theme === 'purple' ? 'bg-gradient-to-r from-[#8a2be2] to-indigo-500' :
                      theme === 'pink' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
                      'bg-gradient-to-r from-emerald-400 to-cyan-400'
                    }`} />

                    {/* Card Header Content */}
                    <div className="relative z-10 w-full space-y-3">
                      <div className="flex items-center justify-between font-mono text-[9px] md:text-[10px] text-slate-400 tracking-[0.2em] uppercase">
                        <span className="flex items-center gap-1.5 text-[#00f0ff]">
                          <Activity className="w-3 h-3 text-[#00f0ff] animate-pulse" />
                          {project.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[8px] tracking-widest font-bold">
                            STACK 0{index + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {project.year || '2026'}
                          </span>
                        </div>
                      </div>

                    <h3 className="font-sans font-black text-2xl md:text-3xl text-white tracking-wider leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#00f0ff] transition-all">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans max-w-lg">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags and Action Footer */}
                  <div className="relative z-10 pt-4 flex items-center justify-between border-t border-slate-900/80">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#080d1e] border border-slate-800 font-mono text-[9px] text-slate-400 tracking-wider uppercase group-hover:border-[#00f0ff]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <MagneticButton strength={0.3}>
                      <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-[#00f0ff] flex items-center justify-center text-slate-400 group-hover:text-[#00f0ff] transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </MagneticButton>
                  </div>

                  {/* Corner Crosshair Accents */}
                  <span className="absolute top-2 left-2 font-mono text-[8px] text-slate-800 pointer-events-none">+</span>
                  <span className="absolute top-2 right-2 font-mono text-[8px] text-slate-800 pointer-events-none">+</span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  </section>
  );
}
