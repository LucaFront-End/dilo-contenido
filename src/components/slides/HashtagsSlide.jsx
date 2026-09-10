import React, { useState } from 'react';
import { Settings, Copy, Check, Hash, Sparkles } from 'lucide-react';

export default function HashtagsSlide({ hashtags, onCopySuccess }) {
  const [copiedGroup, setCopiedGroup] = useState(null);
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

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <div className="slide-content hashtags-slide flex w-full h-full relative overflow-hidden bg-white select-text">
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
          <circle cx="70" cy="210" r="6" fill="#FF5A00" />
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

          <button
            onClick={handleCopyAll}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
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

        {/* Mobile Tab Selector (<md) */}
        <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-zinc-100 rounded-xl mb-3 border border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                activeTab === cat.id
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {cat.title.replace('# ', '')}
            </button>
          ))}
        </div>

        {/* Mobile Active Tab Card (<md) */}
        <div className="block md:hidden bg-zinc-50/80 border border-zinc-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xs uppercase tracking-wider text-orange-600 font-space">
              {currentCategory.title}
            </span>
            <button
              onClick={() => handleCopyTags(currentCategory.title, currentCategory.tags)}
              className="px-2.5 py-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-1 cursor-pointer border border-orange-200"
            >
              {copiedGroup === currentCategory.title ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGroup === currentCategory.title ? '¡Copiado!' : 'Copiar grupo'}</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategory.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  if (onCopySuccess) onCopySuccess(`"${tag}" copiado`);
                }}
                className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-300 rounded-xl text-xs font-semibold text-zinc-800 hover:text-orange-600 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Columns Organized with Orange Badges faithful to PDF (Desktop md:grid) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
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
