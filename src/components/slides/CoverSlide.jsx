import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CoverSlide({ clientTitle, clientMonth, clientYear, onStart }) {
  return (
    <div className="slide-content cover-slide-container relative w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-14 overflow-hidden select-none bg-white">
      {/* Decorative Vectors Faithful to PDF Page 1 */}

      {/* Top Left Squiggle */}
      <div className="decor-curves absolute -top-12 -left-12 w-28 h-28 md:w-44 md:h-44 pointer-events-none opacity-40 md:opacity-85">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-zinc-900">
          <path
            d="M20 50 C40 10 90 20 70 80 C50 140 10 100 30 150 C50 200 120 180 140 140"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Left Accent Shapes (Orange Square & Triangles) */}
      <div className="absolute top-10 left-32 hidden md:flex items-center gap-3 pointer-events-none">
        <div className="w-8 h-8 rounded-lg bg-orange-500 shadow-sm relative flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-white" />
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-zinc-900" />
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-orange-500" />
        </div>
      </div>

      {/* Right Side: Pen Tool (Desktop only to prevent mobile overlap) */}
      <div className="decor-pen-tool absolute top-10 right-14 pointer-events-none hidden lg:block">
        <svg width="75" height="75" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="4" fill="#FF5A00" />
          <path d="M20 70 C40 30 70 30 85 50" stroke="#18181b" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M60 25 L75 40 L50 65 L35 50 Z" fill="#fff" stroke="#18181b" strokeWidth="2.5" />
          <path d="M35 50 L30 68 L48 63 Z" fill="#18181b" />
          <rect x="80" y="20" width="10" height="10" fill="#FF5A00" />
        </svg>
      </div>

      {/* Right Side: Architectural Arch with Dots (Desktop only to prevent mobile overlap) */}
      <div className="decor-arch absolute top-28 right-8 pointer-events-none hidden lg:block">
        <svg width="120" height="230" viewBox="0 0 120 230" fill="none">
          <path d="M100 170 V80 C100 30 20 30 20 80 V170" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="42" y="90" width="22" height="22" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <path d="M100 160 C100 190 70 210 40 200" stroke="#18181b" strokeWidth="10" strokeLinecap="round" />
          {/* Vertical Dotted Column (2 black, 2 orange) */}
          <circle cx="85" cy="185" r="5.5" fill="#18181b" />
          <circle cx="85" cy="200" r="5.5" fill="#FF5A00" />
          <circle cx="85" cy="215" r="5.5" fill="#18181b" />
          <circle cx="85" cy="230" r="5.5" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Center Area */}
      <div className="relative z-10 my-auto max-w-4xl py-2 md:py-4">
        {/* Official Dilo Digital Logo */}
        <div className="flex items-center gap-3 md:gap-3.5 mb-4 md:mb-6">
          <img
            src="/assets/logo/dilo-logo-orange.png"
            alt="Dilo Digital"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-sm select-none"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400">
              Agencia de Crecimiento Digital
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 tracking-tight font-space leading-none mt-0.5">
              DILO <span className="text-orange-500">DIGITAL</span>
            </span>
          </div>
        </div>

        {/* Big Impact Titles faithful to PDF Page 1 */}
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-950 uppercase tracking-tight font-space leading-tight">
            PRESENTACIÓN DE
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-orange-500 uppercase tracking-tighter font-space leading-none">
            PARRILLA
          </h1>
        </div>

        {/* Dynamic Client Tagline & Month & CTA */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5">
          <div className="px-4 py-2.5 bg-zinc-950 text-white font-bold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base tracking-wide uppercase shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 border border-zinc-800">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="truncate">{clientTitle || 'Sistemas Cuauhtli'}</span>
          </div>

          <div className="px-4 py-2.5 bg-orange-100/90 text-orange-700 font-extrabold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base tracking-wider uppercase border border-orange-200 text-center">
            {clientMonth || 'Septiembre'} {clientYear || '2026'}
          </div>

          <button
            onClick={onStart}
            className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explorar Parrilla</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Clean Footer Bar with Non-overlapping Brand Mark */}
      <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-zinc-400 tracking-wider pt-4 border-t border-zinc-100 mt-4 md:mt-0">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-black text-lg leading-none select-none">+</span>
          <span className="uppercase text-zinc-500 font-bold text-[10px] sm:text-xs">Agencia de Crecimiento Digital</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px] font-medium">
          <span>Usa las flechas</span>
          <kbd className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] text-zinc-700 font-mono font-bold">←</kbd>
          <kbd className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] text-zinc-700 font-mono font-bold">→</kbd>
          <span>para navegar</span>
        </div>
      </div>
    </div>
  );
}
