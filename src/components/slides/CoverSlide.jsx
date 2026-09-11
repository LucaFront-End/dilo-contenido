import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CoverSlide({ clientTitle, clientMonth, clientYear, onStart }) {
  return (
    <div className="slide-content cover-slide-container relative w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-14 overflow-hidden select-none bg-white">
      {/* Original Dilo Vector Graphics Faithful to PDF Page 1 */}

      {/* Left: Authentic Single Black Swirl / Rulo */}
      <img
        src="/assets/graphics/left-swirl.png"
        alt=""
        className="absolute -top-4 -left-2 md:top-0 md:left-0 w-24 sm:w-28 md:w-36 lg:w-44 object-contain pointer-events-none select-none z-0 opacity-80"
      />

      {/* Right Side: Authentic Pen Nib + Two Swirls (Punta de la pluma y los dos rulos) */}
      <img
        src="/assets/graphics/dilo-right-motif.png"
        alt=""
        className="absolute top-4 sm:top-8 md:top-10 -right-2 md:right-4 h-[60%] sm:h-[68%] md:h-[75%] max-h-[520px] object-contain pointer-events-none select-none hidden lg:block z-0 opacity-90"
      />

      {/* Main Center Area */}
      <div className="relative z-10 my-auto max-w-4xl py-2 md:py-4 w-full">
        {/* Official Dilo Digital Logo Lockup */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <img
            src="/assets/logo/dilo-logo-black.png"
            alt="Dilo Digital - Agencia de Marketing Digital"
            className="h-10 sm:h-12 md:h-16 w-auto object-contain select-none"
          />
        </div>

        {/* Big Impact Titles faithful to PDF Page 1 */}
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-zinc-950 uppercase tracking-tight font-space leading-tight">
            PRESENTACIÓN DE
          </h2>
          <h1 className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-black text-orange-500 uppercase tracking-tighter font-space leading-none">
            PARRILLA
          </h1>
        </div>

        {/* Dynamic Client Tagline & Month & CTA */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none px-3.5 py-2 sm:px-4 sm:py-2.5 bg-zinc-950 text-white font-bold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base tracking-wide uppercase shadow-md flex items-center justify-center gap-1.5 border border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">{clientTitle || 'Sistemas Cuauhtli'}</span>
            </div>

            <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-orange-100/90 text-orange-700 font-extrabold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base tracking-wider uppercase border border-orange-200 text-center shrink-0">
              {clientMonth || 'Septiembre'} {clientYear || '2026'}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explorar Parrilla</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Clean Footer Bar with Non-overlapping Brand Mark */}
      <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-zinc-400 tracking-wider pt-3 sm:pt-4 border-t border-zinc-100 mt-3 md:mt-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-orange-500 font-black text-base sm:text-lg leading-none select-none">+</span>
          <span className="uppercase text-zinc-500 font-bold text-[9px] sm:text-xs">Agencia de Marketing Digital</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] sm:text-[11px] font-medium">
          <span className="hidden sm:inline">Usa las flechas</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] text-zinc-700 font-mono font-bold">←</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] text-zinc-700 font-mono font-bold">→</kbd>
          <span className="hidden sm:inline">para navegar</span>
          <span className="sm:hidden text-orange-600 font-semibold">Desliza para explorar 👉</span>
        </div>
      </div>
    </div>
  );
}
