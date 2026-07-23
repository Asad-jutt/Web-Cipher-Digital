import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { fetchTestimonialsFromSanity, isSanityConfigured } from '../lib/sanity';

// Import avatars
import elenaAvatar from '../assets/images/elena_chen_avatar_1784348045157.jpg';
import arisAvatar from '../assets/images/dr_aris_vance_avatar_1784348059781.jpg';
import marcusAvatar from '../assets/images/marcus_lee_avatar_1784348078681.jpg';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 'aurora-feedback',
    type: 'CLIENT FEEDBACK: AURORA PLATFORM',
    quote: 'Web Cipher Digital delivered a revolutionary fintech interface. The “Aurora Platform” has completely transformed our user engagement. Precision and performance, unparalleled.',
    author: 'ELENA CHEN, CEO, QUANTUM FINTECH',
    avatar: elenaAvatar,
    colorClass: 'brand-cyan',
    accentColor: '#00F2FE',
    bgGlow: 'rgba(0, 242, 254, 0.03)',
    borderColor: 'rgba(0, 242, 254, 0.15)',
    hoverBorder: 'rgba(0, 242, 254, 0.4)'
  },
  {
    id: 'neuro-feedback',
    type: 'TESTIMONIAL: NEURO-CYPHER',
    quote: 'Neuro-Cypher has become an indispensable tool. WCD’s ability to visualize our complex datasets is masterful. Immersion and insight at a new scale.',
    author: 'DR. ARIS VANCE, LEAD RESEARCHER, MIT BIOLABS',
    avatar: arisAvatar,
    colorClass: 'brand-purple',
    accentColor: '#7000FF',
    bgGlow: 'rgba(112, 0, 255, 0.03)',
    borderColor: 'rgba(112, 0, 255, 0.15)',
    hoverBorder: 'rgba(112, 0, 255, 0.4)'
  },
  {
    id: 'velocity-feedback',
    type: 'CLIENT VOICE: VELOCITY LABS',
    quote: 'Velocity Labs is the benchmark for immersive AI UI. Their work has set a new standard for our research outputs. They don’t just build, they innovate.',
    author: 'MARCUS LEE, HEAD OF AI RESEARCH, NEXUS ROBOTICS',
    avatar: marcusAvatar,
    colorClass: 'brand-pink',
    accentColor: '#F539B5',
    bgGlow: 'rgba(245, 57, 181, 0.03)',
    borderColor: 'rgba(245, 57, 181, 0.15)',
    hoverBorder: 'rgba(245, 57, 181, 0.4)'
  }
];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [isSanityLoading, setIsSanityLoading] = useState(false);

  useEffect(() => {
    async function loadSanityTestimonials() {
      if (!isSanityConfigured) return;
      setIsSanityLoading(true);
      const data = await fetchTestimonialsFromSanity();
      if (data && data.length > 0) {
        const mapped = data.map((t, idx) => ({
          ...t,
          avatar: t.avatar || (idx % 3 === 0 ? elenaAvatar : idx % 3 === 1 ? arisAvatar : marcusAvatar),
        }));
        setTestimonials(mapped);
      }
      setIsSanityLoading(false);
    }
    loadSanityTestimonials();
  }, []);

  useEffect(() => {
    // Reset cards array to match current testimonials length
    cardRefs.current = cardRefs.current.slice(0, testimonials.length);
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length === 0) return;

    // GSAP ScrollTrigger to dim/shrink cards as they get stacked underneath the next card
    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Last card doesn't shrink because no card stacks over it

        gsap.to(card, {
          scrollTrigger: {
            trigger: cards[index + 1], // Triggered as the next card scrolls up
            start: 'top 85%', // starts shrinking as next card comes near
            end: 'top 150px', // fully shrunk when next card reaches its sticky position
            scrub: true,
            // markers: false, // Turn on for debugging if needed
          },
          scale: 0.94 - (cards.length - 1 - index) * 0.015,
          opacity: 0.35,
          y: -12 * (cards.length - 1 - index),
          transformOrigin: 'top center',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [testimonials]);

  return (
    <section
      id="section-testimonials"
      ref={containerRef}
      className="w-full max-w-5xl mx-auto py-20 md:py-32 border-t border-slate-900/40 scroll-mt-24 space-y-12"
    >
      {/* 03. VOICES OF CLIENTS Section Header */}
      <div className="space-y-2 select-none">
        <h2 
          id="testimonials-title"
          className="text-3xl md:text-4xl font-sans font-black tracking-[0.08em] text-white flex items-center gap-4"
        >
          <span className="font-mono text-brand-cyan text-2xl md:text-3xl">03.</span>
          <span className="uppercase text-gradient-cyan-purple">VOICES OF CLIENTS</span>
        </h2>
        <p className="text-slate-400 font-mono text-[10px] tracking-[0.2em] uppercase">
          TRUSTED BY LEADERS IN CREATIVE TECHNOLOGY AND QUANTITATIVE SYSTEMS
        </p>
      </div>

      {/* Stack of Testimonials Cards */}
      <div 
        id="testimonials-stack-container"
        className="flex flex-col gap-10 md:gap-14 relative pb-12"
      >
        {isSanityLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-slate-950/20 border border-slate-900/60 rounded-xl w-full">
            <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-[10px] text-brand-purple uppercase tracking-[0.2em] animate-pulse">STREAMING TESTIMONIALS...</span>
          </div>
        ) : (
          testimonials.map((t, idx) => (
            <div
              key={t.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            id={`testimonial-card-${t.id}`}
            className="testimonial-card sticky top-[130px] w-full min-h-[220px] md:h-[250px] bg-[#020205]/95 border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden transition-all duration-500 hover:scale-[1.015]"
            style={{
              borderColor: t.borderColor,
              boxShadow: `0 20px 40px rgba(0,0,0,0.8), inset 0 0 30px ${t.bgGlow}`,
              // Set the custom hover shadow dynamically
              ['--hover-border-color' as any]: t.hoverBorder,
              ['--accent-glow-color' as any]: t.accentColor,
            }}
          >
            {/* Top lighting highlight bar for the active card */}
            <div 
              className="absolute top-0 left-0 w-full h-[1px] opacity-40"
              style={{
                background: `linear-gradient(to right, transparent, ${t.accentColor}, transparent)`
              }}
            />

            {/* Left Column: Client Avatar Photo with Neon Halo */}
            <div className="flex-shrink-0 relative group">
              <div 
                className="absolute inset-0 rounded-full blur-[8px] opacity-60 group-hover:opacity-95 transition-opacity"
                style={{ backgroundColor: t.accentColor }}
              />
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[2px] bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden z-10">
                <img
                  src={t.avatar}
                  alt={t.author}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-102 hover:scale-108"
                />
              </div>
            </div>

            {/* Middle Column: Testimonial Quote & Metadata */}
            <div className="flex-1 space-y-4 text-center md:text-left z-10 select-text">
              {/* Card Badge Type */}
              <span 
                className="inline-block font-mono text-[10px] md:text-[11px] tracking-[0.25em] font-bold"
                style={{ color: t.accentColor }}
              >
                {t.type}
              </span>

              {/* Quote Block */}
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans font-medium tracking-wide max-w-xl italic">
                “{t.quote}”
              </p>

              {/* Author & Full Case Study CTA */}
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs md:text-sm text-white tracking-widest uppercase">
                  {t.author}
                </h4>
                
                {/* Full Case Study Action Link */}
                <button
                  id={`case-study-btn-${t.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[9px] md:text-[10px] text-slate-500 hover:text-white uppercase tracking-[0.2em] font-bold pt-1 transition-colors cursor-pointer group"
                >
                  <span>FULL CASE STUDY</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Custom SVG High-Tech Graphic Asset matching the card brand */}
            <div className="hidden lg:flex items-center justify-center w-52 h-44 relative opacity-85 hover:opacity-100 transition-opacity flex-shrink-0 z-10">
              {t.id === 'aurora-feedback' && (
                /* Card 1: Glowing Cyan World Map Grid */
                <svg viewBox="0 0 200 120" className="w-full h-full text-brand-cyan animate-pulse [animation-duration:6s]">
                  <defs>
                    <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Subtle map mesh grid layout */}
                  <g stroke="#00F2FE" strokeWidth="0.5" strokeOpacity="0.15" fill="none">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1="0" y1={15 * i} x2="200" y2={15 * i} />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={i} x1={18 * i} y1="0" x2={18 * i} y2="120" />
                    ))}
                  </g>
                  {/* Glowing schematic world land dots to emulate map */}
                  <g fill="#00F2FE" fillOpacity="0.45" className="animate-pulse">
                    {/* North America */}
                    <circle cx="30" cy="30" r="1.5" />
                    <circle cx="35" cy="25" r="2" />
                    <circle cx="45" cy="35" r="1.5" fillOpacity="0.8" />
                    <circle cx="50" cy="45" r="2.5" />
                    {/* South America */}
                    <circle cx="55" cy="70" r="2" />
                    <circle cx="62" cy="85" r="1.5" />
                    <circle cx="65" cy="95" r="2" />
                    {/* Europe & Africa */}
                    <circle cx="100" cy="35" r="1.5" />
                    <circle cx="105" cy="45" r="2" />
                    <circle cx="102" cy="65" r="2.5" />
                    <circle cx="108" cy="78" r="1.5" />
                    <circle cx="112" cy="90" r="2" />
                    {/* Asia & Australia */}
                    <circle cx="140" cy="35" r="1.8" />
                    <circle cx="150" cy="40" r="2.2" />
                    <circle cx="160" cy="45" r="2.5" />
                    <circle cx="148" cy="55" r="1.5" />
                    <circle cx="162" cy="62" r="1.2" />
                    <circle cx="170" cy="85" r="2.5" />
                    <circle cx="180" cy="92" r="1.5" />
                  </g>
                  {/* Data communication node paths */}
                  <path d="M 45 35 Q 80 15 105 45 T 160 45" stroke="#00F2FE" strokeWidth="1" strokeDasharray="4,4" fill="none" strokeOpacity="0.7" />
                  <path d="M 55 70 Q 80 80 102 65 T 170 85" stroke="#00F2FE" strokeWidth="0.8" strokeDasharray="3,3" fill="none" strokeOpacity="0.5" />
                  <circle cx="105" cy="45" r="4" fill="none" stroke="#00F2FE" strokeWidth="1.5" className="animate-ping" />
                </svg>
              )}

              {t.id === 'neuro-feedback' && (
                /* Card 2: Spinning 3D Latitude/Longitude Sphere Grid */
                <div className="w-40 h-40 flex items-center justify-center animate-spin [animation-duration:24s] relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-brand-purple">
                    <defs>
                      <radialGradient id="purple-sphere-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#7000FF" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#7000FF" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Inner glowing sphere base */}
                    <circle cx="50" cy="50" r="45" fill="url(#purple-sphere-glow)" />
                    
                    {/* Outer grid circles representing latitude & longitude */}
                    <circle cx="50" cy="50" r="45" stroke="#7000FF" strokeWidth="0.75" strokeOpacity="0.4" fill="none" />
                    <ellipse cx="50" cy="50" rx="45" ry="18" stroke="#7000FF" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    <ellipse cx="50" cy="50" rx="45" ry="32" stroke="#7000FF" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    <ellipse cx="50" cy="50" rx="18" ry="45" stroke="#7000FF" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    <ellipse cx="50" cy="50" rx="32" ry="45" stroke="#7000FF" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    
                    {/* Interactive glowing cybernetic biosignal nodes */}
                    <circle cx="50" cy="5" r="1.5" fill="#7000FF" />
                    <circle cx="50" cy="95" r="1.5" fill="#7000FF" />
                    <circle cx="5" cy="50" r="1.5" fill="#7000FF" />
                    <circle cx="95" cy="50" r="1.5" fill="#7000FF" />
                    <circle cx="50" cy="32" r="2.5" fill="#C084FC" className="animate-pulse" />
                    <circle cx="32" cy="50" r="2" fill="#C084FC" />
                    <circle cx="68" cy="50" r="2.5" fill="#C084FC" />
                    <circle cx="50" cy="68" r="2" fill="#C084FC" />
                  </svg>
                </div>
              )}

              {t.id === 'velocity-feedback' && (
                /* Card 3: Luminous Glowing Crystalline Shard Clusters */
                <svg viewBox="0 0 120 120" className="w-36 h-36 text-brand-pink hover:scale-105 transition-transform duration-500">
                  <defs>
                    <linearGradient id="pink-crystal-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F539B5" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#7000FF" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="pink-crystal-2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F539B5" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="glow-crystal" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Shard 1 (Left background) */}
                  <polygon points="30,85 15,60 35,40 50,75" fill="url(#pink-crystal-1)" stroke="#F539B5" strokeWidth="0.5" strokeOpacity="0.5" />
                  {/* Shard 2 (Right background) */}
                  <polygon points="90,85 105,55 80,45 70,75" fill="url(#pink-crystal-1)" stroke="#F539B5" strokeWidth="0.5" strokeOpacity="0.5" />
                  {/* Shard 3 (Center main tall crystal) */}
                  <polygon points="60,105 40,65 60,15 80,65" fill="url(#pink-crystal-2)" stroke="#F539B5" strokeWidth="1" strokeOpacity="0.9" />
                  {/* Outer glowing halo path */}
                  <path d="M 60 15 L 60 105" stroke="#FFFFFF" strokeWidth="0.75" strokeOpacity="0.4" />
                  <path d="M 40 65 L 80 65" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.2" />

                  {/* Pulsing focal nodes */}
                  <circle cx="60" cy="15" r="3" fill="#FFFFFF" filter="url(#glow-crystal)" className="animate-ping" />
                  <circle cx="60" cy="15" r="2" fill="#FFFFFF" />
                </svg>
              )}
            </div>
          </div>
        ))
      )}
      </div>
    </section>
  );
}
