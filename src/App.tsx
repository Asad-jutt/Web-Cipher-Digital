import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InteractiveCanvas from './components/InteractiveCanvas';
import SlowParticles from './components/SlowParticles';
import InteractiveControls from './components/InteractiveControls';
import ContentSections from './components/ContentSections';
import ProjectWizard from './components/ProjectWizard';
import { SectionId, WaveConfig } from './types';
import { Terminal, Cpu, Info } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // High-fidelity double wave default configurations
  const [waveConfig, setWaveConfig] = useState<WaveConfig>({
    amplitude: 110,
    frequency: 2.2,
    speed: 0.6,
    colorMode: 'cyan-purple',
    density: 120,
    distortion: 1.2,
    noise: 0.5,
  });

  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamically update activeSection in the header while scrolling
  useEffect(() => {
    const sections: SectionId[] = ['hero', 'portfolio', 'testimonials', 'labs', 'contact'];
    const observers = sections.map((id) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-30% 0px -45% 0px',
          threshold: 0.05,
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((item) => {
        if (item) {
          item.observer.unobserve(item.el);
        }
      });
    };
  }, []);

  return (
    <div
      id="main-app-viewport"
      className="relative min-h-screen bg-[#040409] text-[#f3f4f6] font-sans overflow-x-hidden selection:bg-brand-cyan/30 selection:text-white"
    >
      {/* 1. Immersive Interactive Background Wave Canvas */}
      <InteractiveCanvas config={waveConfig} />

      {/* Ambient slow moving background particles */}
      <SlowParticles />

      {/* 2. Ambient Visual Lighting Glows (to replicate exact screenshot colors) */}
      <div 
        id="ambient-glow-pink" 
        className="absolute top-1/4 left-1/3 w-[50vw] h-[50vh] bg-brand-pink/10 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen animate-pulse [animation-duration:10s]" 
      />
      <div 
        id="ambient-glow-cyan" 
        className="absolute bottom-1/4 right-1/4 w-[45vw] h-[45vh] bg-brand-cyan/10 rounded-full filter blur-[130px] pointer-events-none mix-blend-screen animate-pulse [animation-duration:14s]" 
      />
      <div 
        id="ambient-glow-purple" 
        className="absolute top-1/2 left-1/4 w-[35vw] h-[35vh] bg-brand-purple/10 rounded-full filter blur-[140px] pointer-events-none mix-blend-screen animate-pulse [animation-duration:8s]" 
      />

      {/* 3. Elite Main Header Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 4. Sidebar Interactive Matrix Configurator on Right */}
      <InteractiveControls 
        config={waveConfig} 
        onChange={setWaveConfig} 
        activeSection={activeSection}
      />

      {/* 5. Main Interactive Dynamic Sections Viewport */}
      <main className="relative z-10 w-full pt-24 pb-24">
        <ContentSections
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          waveConfig={waveConfig}
          setWaveConfig={setWaveConfig}
          onOpenWizard={() => setIsWizardOpen(true)}
        />
      </main>

      {/* 7. Bottom Horizontal Metadata Ribbon (Decorative detail footer) */}
      <footer
        id="agency-metadata-ribbon"
        className="fixed bottom-4 left-6 md:left-12 z-20 hidden sm:flex items-center gap-6 font-mono text-[9px] text-slate-500 tracking-wider pointer-events-none"
      >
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-brand-cyan" />
          <span>CYPHER ENGINE V4.8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-brand-pink" />
          <span>60 FPS INTERACTIVE LOCK</span>
        </div>
      </footer>

      {/* 8. Interactive Project Planner Form Wizard Overlay */}
      <ProjectWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
