import React from 'react';
import { Terminal, Cpu } from 'lucide-react';
import { SectionId } from '../types';

interface HeaderProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  onOpenWizard: () => void;
}

export default function Header({ activeSection, setActiveSection, onOpenWizard }: HeaderProps) {
  const menuItems: { id: SectionId; label: string }[] = [
    { id: 'hero', label: 'HERO' },
    { id: 'portfolio', label: 'WORK' },
    { id: 'testimonials', label: 'VOICES' },
    { id: 'labs', label: 'LABS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header
      id="main-app-header"
      className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-6 flex items-center justify-between backdrop-blur-md bg-black/10 border-b border-slate-900/40"
    >
      {/* Brand Logo Terminals */}
      <div
        id="logo-wrapper"
        onClick={() => setActiveSection('hero')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        {/* Futuristic Glowing Ring Cypher Icon */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-brand-cyan/40 animate-spin [animation-duration:8s] group-hover:border-brand-cyan transition-colors" />
          <div className="absolute inset-1 rounded-full border border-dashed border-brand-pink/40 animate-spin [animation-duration:12s] [animation-direction:reverse]" />
          <div className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-purple shadow-[0_0_10px_#00F2FE] group-hover:scale-110 transition-transform" />
          <Cpu className="w-4.5 h-4.5 text-white absolute" style={{ mixBlendMode: 'overlay' }} />
        </div>

        {/* Text Brand */}
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1">
            <span className="font-sans font-bold tracking-widest text-sm text-white group-hover:text-brand-cyan transition-colors">
              WEB CYPHER
            </span>
          </div>
          <span className="font-mono text-[9px] font-bold text-slate-500 tracking-[0.25em] group-hover:text-brand-pink transition-colors">
            DIGITAL
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav id="header-navbar" className="hidden md:flex items-center gap-8 lg:gap-12">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              id={`nav-link-${item.id}`}
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="relative text-[11px] font-mono tracking-[0.15em] font-medium transition-colors duration-300 py-1.5 focus:outline-none cursor-pointer group"
            >
              <span className={isActive ? 'text-brand-cyan font-bold' : 'text-slate-400 group-hover:text-white'}>
                {item.label}
              </span>
              
              {/* Bottom active line slider */}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-brand-cyan to-brand-purple transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Start Project CTA */}
      <button
        id="start-project-header-cta"
        onClick={onOpenWizard}
        className="relative px-5 py-2 md:py-2.5 rounded-lg overflow-hidden border border-brand-cyan/40 hover:border-brand-pink/80 bg-slate-950/45 text-white hover:text-brand-cyan font-mono text-[10px] uppercase tracking-widest font-semibold transition-all shadow-[0_0_15px_rgba(0,242,254,0.05)] hover:shadow-[0_0_20px_rgba(245,57,181,0.2)] focus:outline-none active:scale-95 cursor-pointer flex items-center gap-2 group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan/10 to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Terminal className="w-3.5 h-3.5 text-brand-cyan group-hover:text-brand-pink transition-colors animate-pulse" />
        <span>START PROJECT</span>
      </button>
    </header>
  );
}
