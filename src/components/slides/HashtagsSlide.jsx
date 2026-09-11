import React, { useState } from 'react';
import { Settings, Hash, Sparkles } from 'lucide-react';

export default function HashtagsSlide({ hashtags }) {
  const [activeTab, setActiveTab] = useState('nicho');

  const categories = [
    {
      id: 'nicho',
      title: '# DE NICHO',
      tags: hashtags?.nicho || [
        '#HogarSeguroInteligente',
        '#SeguridadResidencialPremium',
        '#EmpresasSeguras',
        '#Proteccion24Horas',
        '#InstalacionesSeguras'
      ]
    },
    {
      id: 'marca',
      title: '# DE MARCA',
      tags: hashtags?.marca || [
        '#SeguridadElectrónica',
        '#CCTVProfesional',
        '#AlarmasInteligentes',
        '#VideoporterosParaNegocios',
        '#MonitoreoRemoto',
        '#ProtecciónEmpresarial'
      ]
    },
    {
      id: 'geo',
      title: '# GEOLOCALIZACIÓN',
      tags: hashtags?.geolocalizacion || [
        '#CDMX',
        '#CiudadDeMexico',
        '#SeguridadCDMX',
        '#NegociosCDMX',
        '#HogarSeguroCDMX',
        '#EmpresasCDMX'
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div
      className="slide-content hashtags-slide flex w-full h-full relative overflow-hidden bg-white select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      onCopy={(e) => { e.preventDefault(); return false; }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Black Left Rounded Category Pill with Gear Icon faithful to PDF */}
      <div className="pdf-side-pill shrink-0 flex flex-col items-center">
        <div className="p-1 sm:p-2 text-orange-500 mb-1 sm:mb-2">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
        </div>
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xs sm:text-sm md:text-2xl font-space">
          HASTAGS
        </span>
      </div>

      {/* Decorative Vectors on Right (Desktop only) */}
      <div className="decor-arch absolute top-20 right-8 pointer-events-none opacity-80 hidden lg:block">
        <svg width="120" height="220" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="6" fill="#18181b" />
          <circle cx="70" cy="210" r="5" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-start md:justify-center p-3 sm:p-6 md:p-14 max-w-6xl mx-auto w-full z-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-zinc-900 font-space tracking-tight">
              Estrategia de Etiquetas (Hashtags)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">
              Segmentación calculada para optimizar el alcance orgánico en Instagram.
            </p>
          </div>

          <span className="px-3.5 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-xl border border-zinc-200 shrink-0 self-start sm:self-auto">
            Estrategia de Nicho · Marca · Geolocalización
          </span>
        </div>

        {/* Mobile Tab Selector (<md) */}
        <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-zinc-100 rounded-xl mb-3 border border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {cat.title.replace('# ', '')}
            </button>
          ))}
        </div>

        {/* Mobile Active Tab Card (<md) (Protected from copy) */}
        <div className="block md:hidden bg-zinc-50/80 border border-zinc-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xs uppercase tracking-wider text-orange-600 font-space">
              {currentCategory.title}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Solo lectura</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategory.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 select-none shadow-2xs pointer-events-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                draggable={false}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Columns Organized with Orange Badges faithful to PDF (Desktop md:grid) (Protected from copy) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative select-none">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="flex flex-col relative">
              {/* Category Pill Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="hashtag-badge-pill">
                  <Hash className="w-4 h-4 text-white shrink-0" />
                  <span className="font-black tracking-wider uppercase font-space text-sm">
                    {cat.title}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">{cat.tags.length} tags</span>
              </div>

              {/* Tags List (Uncopyable) */}
              <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-5 flex-1 shadow-sm select-none">
                <ul className="space-y-3">
                  {cat.tags.map((tag, tIdx) => (
                    <li
                      key={tIdx}
                      className="text-sm font-semibold text-zinc-800 select-none transition-colors pointer-events-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      onCopy={(e) => e.preventDefault()}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Orange Vertical Line Divider between columns (except last) */}
              {idx < 2 && (
                <div className="hidden md:block absolute -right-4 top-10 bottom-6 w-[2px] bg-orange-500/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
