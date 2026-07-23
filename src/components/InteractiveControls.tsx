import React, { useState } from 'react';
import { Sliders, RefreshCw, EyeOff, Eye, Sparkles } from 'lucide-react';
import { WaveConfig } from '../types';

interface InteractiveControlsProps {
  config: WaveConfig;
  onChange: (newConfig: WaveConfig) => void;
  activeSection: string;
}

export default function InteractiveControls({ config, onChange, activeSection }: InteractiveControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateParam = (key: keyof WaveConfig, val: any) => {
    onChange({
      ...config,
      [key]: val,
    });
  };

  const resetToDefault = () => {
    onChange({
      amplitude: 110,
      frequency: 2.2,
      speed: 0.6,
      colorMode: 'cyan-purple',
      density: 120,
      distortion: 1.2,
      noise: 0.5,
    });
  };

  const isVisible = activeSection === 'hero';

  return (
    <div
      id="right-parameter-sidebar"
      className={`fixed right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
      }`}
    >
      {isOpen ? (
        <div className="w-64 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 border-glow-cyan shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle background circuit line */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-brand-cyan/10 rounded-full filter blur-xl pointer-events-none" />

          {/* Title Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-cyan animate-pulse" />
              <h4 className="font-mono text-[10px] font-bold text-white tracking-[0.2em] uppercase">
                Grid Matrix
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                id="reset-matrix-btn"
                title="Reset simulation"
                onClick={resetToDefault}
                className="p-1 rounded bg-slate-900/60 text-slate-500 hover:text-brand-cyan hover:bg-slate-900 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <button
                id="hide-matrix-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded bg-slate-900/60 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Configuration Parameters Controls */}
          <div className="space-y-4">
            {/* 1. Wave Amplitude */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>AMPLITUDE</span>
                <span className="text-brand-cyan">{config.amplitude}px</span>
              </div>
              <input
                id="matrix-slider-amplitude"
                type="range"
                min="20"
                max="250"
                step="5"
                value={config.amplitude}
                onChange={(e) => updateParam('amplitude', Number(e.target.value))}
                className="w-full accent-brand-cyan h-1 bg-slate-900 rounded-lg cursor-pointer transition-all"
              />
            </div>

            {/* 2. Wave Speed */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>SIM VELOCITY</span>
                <span className="text-brand-pink">{(config.speed * 100).toFixed(0)}MHz</span>
              </div>
              <input
                id="matrix-slider-speed"
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={config.speed}
                onChange={(e) => updateParam('speed', Number(e.target.value))}
                className="w-full accent-brand-pink h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3. Magnetic Warping */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>MOUSE PULL</span>
                <span className="text-brand-purple">x{config.distortion}</span>
              </div>
              <input
                id="matrix-slider-distortion"
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={config.distortion}
                onChange={(e) => updateParam('distortion', Number(e.target.value))}
                className="w-full accent-brand-purple h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Matrix Color Profiles */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Spectrum Profile
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['cyan-purple', 'magenta-pink', 'matrix-green', 'multi-glow'] as const).map((mode) => (
                  <button
                    id={`color-mode-btn-${mode}`}
                    key={mode}
                    onClick={() => updateParam('colorMode', mode)}
                    className={`text-[9px] font-mono py-1 px-1 rounded border text-center transition-all cursor-pointer ${
                      config.colorMode === mode
                        ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan font-bold shadow-[0_0_8px_rgba(0,242,254,0.15)]'
                        : 'bg-slate-900/45 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {mode === 'cyan-purple' && 'CYAN-CYPHER'}
                    {mode === 'magenta-pink' && 'NEON-AETHER'}
                    {mode === 'matrix-green' && 'GRID-NEXUS'}
                    {mode === 'multi-glow' && 'DEEP-COSMOS'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Resolution density of the mesh */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>GRID DENSITY</span>
                <span className="text-slate-500">
                  {config.density}pts
                </span>
              </div>
              <input
                id="matrix-slider-density"
                type="range"
                min="60"
                max="180"
                step="10"
                value={config.density}
                onChange={(e) => updateParam('density', Number(e.target.value))}
                className="w-full accent-slate-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-900 text-center flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-600">
            <Sparkles className="w-3 h-3 text-brand-pink" />
            <span>Interactive Hologram Sandbox</span>
          </div>
        </div>
      ) : (
        <button
          id="show-matrix-btn"
          onClick={() => setIsOpen(true)}
          className="p-3 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan border-glow-cyan shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer group"
        >
          <Sliders className="w-4.5 h-4.5 animate-pulse group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}
    </div>
  );
}
