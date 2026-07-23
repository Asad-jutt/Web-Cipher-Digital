import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Check, Send, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface ProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  { id: 'astrosanity', label: 'Astro & Sanity CMS Architecture', desc: 'High-speed modern content-driven platforms with serverless edge rendering and structured headless CMS queries.' },
  { id: 'webgl', label: 'WebGL & Canvas Artistry', desc: 'Cutting-edge mathematical animation and immersive physics canvas meshes.' },
  { id: 'uiux', label: 'High-Fidelity Product UI/UX', desc: 'Premium responsive visual layouts, high-contrast typography, and intuitive flows.' },
  { id: 'fullstack', label: 'Full-Stack Creative Engineering', desc: 'Secure APIs, high-performance backends, and flawless cloud integrations.' },
];

const BUDGETS = [
  { id: 'starter', label: '$2,000 — $10,000', desc: 'Immersive landing, creative motion, single-view precision.' },
  { id: 'growth', label: '$10,000 — $25,000', desc: 'Full-stack platform, multi-interactive canvas, tailored visuals.' },
  { id: 'enterprise', label: '$25,000 — $50,000', desc: 'Next-gen ecosystem, spatial interactive graphics, bespoke luxury design.' },
];

export default function ProjectWizard({ isOpen, onClose }: ProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(['astrosanity']);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', company: '', brief: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // GSAP animations for mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsDone(false);
      setIsSubmitting(false);
      setSelectedServices(['astrosanity']);
      setSelectedBudget('');
      setForm({ name: '', email: '', company: '', brief: '' });

      document.body.style.overflow = 'hidden';
      
      // Backdrop animation
      gsap.to(containerRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power3.out'
      });

      // Panel sliding up & scaling
      gsap.fromTo(contentRef.current, 
        { y: 80, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power4.out' }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  // Handle transition between steps
  const nextStep = () => {
    gsap.fromTo(contentRef.current, 
      { x: 30, opacity: 0.8 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    gsap.fromTo(contentRef.current, 
      { x: -30, opacity: 0.8 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    setStep((prev) => prev - 1);
  };

  const handleServiceToggle = (id: string) => {
    setSelectedServices((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setIsSubmitting(true);
    
    // Simulate complex API processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      
      // Fun explosion effect or success animation
      gsap.fromTo('.success-icon', 
        { scale: 0, rotate: -45 },
        { scale: 1.2, rotate: 0, duration: 0.6, ease: 'back.out(2)' }
      );
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div
      id="project-wizard-backdrop"
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl opacity-0 pointer-events-none transition-all duration-300"
    >
      <div
        id="project-wizard-container"
        ref={contentRef}
        className="relative w-full max-w-2xl bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 md:p-8 border-glow-purple shadow-2xl overflow-hidden"
      >
        {/* Ambient Corner Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-cyan/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
            <h3 className="font-sans font-semibold tracking-wider text-sm text-slate-400 uppercase">
              Project Configurator
            </h3>
          </div>
          <button
            id="close-wizard-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-brand-cyan transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps Progress Bar */}
        {!isDone && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    s <= step ? 'bg-gradient-to-r from-brand-cyan to-brand-purple w-full' : 'bg-slate-800 w-full'
                  }`}
                />
                <span className={`text-[10px] font-mono ${s === step ? 'text-brand-cyan' : 'text-slate-600'}`}>
                  0{s}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Content Body */}
        {isDone ? (
          <div className="text-center py-8">
            <div className="success-icon inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/50 text-brand-cyan mb-6 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-white mb-2 tracking-tight">
              CYPHER SECURED
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
              Thank you, <span className="text-brand-cyan font-medium">{form.name}</span>. Our digital architects are decoding your project metrics. We will establish communication via <span className="text-brand-pink font-mono">{form.email}</span> within 12 standard solar hours.
            </p>
            <button
              id="success-close-btn"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-sans text-xs uppercase font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-cyan text-white tracking-widest transition-all cursor-pointer"
            >
              Exits Terminal
            </button>
          </div>
        ) : (
          <div>
            {/* STEP 1: Services Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-sans font-bold text-white tracking-tight">
                    Which digital domain shall we address?
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">Select all categories that align with your vision.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {SERVICES.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <button
                        id={`service-select-${s.id}`}
                        key={s.id}
                        onClick={() => handleServiceToggle(s.id)}
                        className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                          isSelected
                            ? 'bg-brand-purple/10 border-brand-purple border-glow-purple'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full">
                          <span className={`text-xs font-mono tracking-wider ${isSelected ? 'text-brand-cyan' : 'text-slate-500'}`}>
                            {isSelected ? 'DECODED' : 'STANDBY'}
                          </span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-brand-cyan border-brand-cyan text-slate-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-sans font-semibold text-sm text-white group-hover:text-brand-cyan transition-colors">
                            {s.label}
                          </h5>
                          <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                            {s.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    id="wizard-step1-next"
                    disabled={selectedServices.length === 0}
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-slate-950 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Select Investment <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Budget Allocation */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-sans font-bold text-white tracking-tight">
                    Establish your digital investment bracket
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">Helps customize the technical and creative scale of execution.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {BUDGETS.map((b) => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        id={`budget-select-${b.id}`}
                        key={b.id}
                        onClick={() => setSelectedBudget(b.id)}
                        className={`text-left w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group ${
                          isSelected
                            ? 'bg-brand-cyan/5 border-brand-cyan border-glow-cyan'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex-1">
                          <h5 className="font-sans font-bold text-sm text-white group-hover:text-brand-cyan transition-colors">
                            {b.label}
                          </h5>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                            {b.desc}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-brand-cyan bg-brand-cyan' : 'border-slate-700'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    id="wizard-step2-prev"
                    onClick={prevStep}
                    className="px-4 py-2.5 rounded-lg text-xs font-sans uppercase font-semibold text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="wizard-step2-next"
                    disabled={!selectedBudget}
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-slate-950 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Configure Identity <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Identity & Briefing */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h4 className="text-lg font-sans font-bold text-white tracking-tight">
                    Introduce your brand terminal
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">Let us know how to establish communication.</p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                        Your Name
                      </label>
                      <input
                        id="wizard-input-name"
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-cyan focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:ring-1 focus:ring-brand-cyan/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                        Contact Email
                      </label>
                      <input
                        id="wizard-input-email"
                        type="email"
                        required
                        placeholder="e.g. contact@domain.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-cyan focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:ring-1 focus:ring-brand-cyan/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      Brand / Company Name
                    </label>
                    <input
                      id="wizard-input-company"
                      type="text"
                      placeholder="e.g. Cypher Corp"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-cyan focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:ring-1 focus:ring-brand-cyan/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      Project Briefing
                    </label>
                    <textarea
                      id="wizard-input-brief"
                      rows={3}
                      placeholder="Briefly describe the digital complexity we are solving..."
                      value={form.brief}
                      onChange={(e) => setForm({ ...form, brief: e.target.value })}
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-cyan focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:ring-1 focus:ring-brand-cyan/20 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    id="wizard-step3-prev"
                    type="button"
                    disabled={isSubmitting}
                    onClick={prevStep}
                    className="px-4 py-2.5 rounded-lg text-xs font-sans uppercase font-semibold text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="wizard-step3-submit"
                    type="submit"
                    disabled={isSubmitting || !form.name || !form.email}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-slate-950 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        Decoding Data... <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        Transmit Intel <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
