import React from 'react';
import { Target, Compass, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

export default function StrategySlide({ estrategia }) {
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
      <div className="decor-arch absolute top-20 right-8 pointer-events-none opacity-80 hidden lg:block">
        <svg width="120" height="220" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="6" fill="#18181b" />
          <circle cx="70" cy="210" r="6" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-start md:justify-center p-3 sm:p-6 md:p-14 max-w-5xl mx-auto w-full z-10 overflow-y-auto">
        <div className="mb-3 sm:mb-6 md:mb-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Pilares de Comunicación
          </span>
          <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-zinc-900 font-space tracking-tight mt-1.5 sm:mt-2">
            Estrategia de Contenido
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mt-0.5 sm:mt-1">
            Diseñada meticulosamente por Dilo Digital para generar confianza y conversiones.
          </p>
        </div>

        {/* 4 Strategy Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-50/80 hover:bg-white border border-zinc-200/80 hover:border-orange-200 hover:shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-2.5 sm:mb-4">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-zinc-900 tracking-tight">
                    {p.title}
                  </h3>
                </div>

                <ul className="space-y-1.5 sm:space-y-2.5">
                  {p.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-zinc-700 text-xs sm:text-sm leading-snug sm:leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0 mt-0.5" />
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
