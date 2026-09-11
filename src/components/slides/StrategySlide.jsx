import React from 'react';
import { Target, Compass, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

export default function StrategySlide({ estrategia, clientTitle, clientLogo }) {
  const pillars = [
    {
      title: 'Enfoque',
      icon: Compass,
      color: 'orange',
      items: estrategia?.enfoque || [
        'Contenido como confianza y autoridad, no solo impacto.',
        'Decisiones basadas en credibilidad y tranquilidad.',
        'Mostrar cómo trabajamos, no solo qué vendemos.'
      ]
    },
    {
      title: 'Contenido',
      icon: Award,
      color: 'blue',
      items: estrategia?.contenido || [
        'Fotos reales del día a día.',
        'Reels de procesos: instalaciones, funcionamiento y casos reales.'
      ]
    },
    {
      title: 'Narrativa',
      icon: MessageSquare,
      color: 'emerald',
      items: estrategia?.narrativa || [
        'Cercana, sin alarmismo.',
        'Posicionamiento como aliado experto.'
      ]
    },
    {
      title: 'Objetivo',
      icon: Target,
      color: 'purple',
      items: estrategia?.objetivo || [
        'Confianza antes del contacto.',
        'Menos objeciones al cotizar.'
      ]
    }
  ];

  return (
    <div className="slide-content strategy-slide flex w-full h-full relative overflow-hidden bg-white">
      {/* Black Left Rounded Category Pill */}
      <div className="pdf-side-pill shrink-0">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          ESTRATEGIA
        </span>
      </div>

      {/* Decorative Vectors on Right (Desktop only) */}
      <div className="decor-arch absolute top-16 right-6 pointer-events-none opacity-80 hidden lg:block">
        <svg width="100" height="190" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="6" fill="#18181b" />
          <circle cx="70" cy="210" r="6" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Content Area - Fully contained with zero scrollbars on desktop */}
      <div className="flex-1 flex flex-col justify-start md:justify-center p-3 sm:p-5 md:py-4 md:px-8 max-w-4xl mx-auto w-full z-10 overflow-y-auto lg:overflow-hidden scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="mb-2 sm:mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
              Pilares de Comunicación
            </span>
            {clientTitle && (
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                {clientTitle}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-zinc-900 font-space tracking-tight mt-1">
            Estrategia de Contenido
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mt-0.5">
            Diseñada meticulosamente por Dilo Digital para generar confianza y conversiones.
          </p>
        </div>

        {/* 4 Strategy Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5 md:gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-50/80 hover:bg-white border border-zinc-200/80 hover:border-orange-200 hover:shadow-lg rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20 shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                    {p.title}
                  </h3>
                </div>

                <ul className="space-y-1 sm:space-y-1.5">
                  {p.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-1.5 text-zinc-700 text-[11px] sm:text-xs leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
