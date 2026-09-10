import React, { useState } from 'react';
import { Settings, Copy, Check, Hash, Sparkles } from 'lucide-react';

export default function HashtagsSlide({ hashtags, onCopySuccess }) {
  const [copiedGroup, setCopiedGroup] = useState(null);

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

  const handleCopyTags = (groupTitle, tags) => {
    const text = tags.join(' ');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedGroup(groupTitle);
      if (onCopySuccess) onCopySuccess(`¡Hashtags de "${groupTitle}" copiados!`);
      setTimeout(() => setCopiedGroup(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const allTags = categories.flatMap(c => c.tags).join(' ');
    navigator.clipboard.writeText(allTags).then(() => {
      setCopiedGroup('ALL');
      if (onCopySuccess) onCopySuccess('¡Todos los hashtags copiados al portapapeles!');
      setTimeout(() => setCopiedGroup(null), 2000);
    });
  };

  return (
    <div className="slide-content hashtags-slide flex w-full h-full relative overflow-hidden bg-white select-text">
      {/* Black Left Rounded Category Pill with Gear Icon faithful to PDF */}
      <div className="pdf-side-pill shrink-0 flex flex-col items-center">
        <div className="p-2 text-orange-500 mb-2">
          <Settings className="w-6 h-6 animate-spin-slow" />
        </div>
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          HASTAGS
        </span>
      </div>

      {/* Decorative Vectors on Right */}
      <div className="decor-arch absolute top-20 right-8 pointer-events-none opacity-80">
        <svg width="120" height="220" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="6" fill="#18181b" />
          <circle cx="70" cy="210" r="6" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-14 max-w-6xl mx-auto w-full z-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 font-space tracking-tight">
              Estrategia de Etiquetas (Hashtags)
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Segmentación calculada para optimizar el alcance orgánico y la autoridad de marca en Instagram.
            </p>
          </div>

          <button
            onClick={handleCopyAll}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {copiedGroup === 'ALL' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Todos Copiados!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-orange-400" />
                <span>Copiar Todos</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Columns Organized with Orange Badges faithful to PDF */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
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

                <button
                  onClick={() => handleCopyTags(cat.title, cat.tags)}
                  className="p-1.5 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Copiar grupo"
                >
                  {copiedGroup === cat.title ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Tags List */}
              <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-5 flex-1 shadow-sm">
                <ul className="space-y-3">
                  {cat.tags.map((tag, tIdx) => (
                    <li
                      key={tIdx}
                      className="text-sm font-semibold text-zinc-800 hover:text-orange-600 transition-colors cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                        if (onCopySuccess) onCopySuccess(`"${tag}" copiado`);
                      }}
                      title="Clic para copiar este tag"
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
