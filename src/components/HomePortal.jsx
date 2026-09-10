import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, ExternalLink, Search, Lock, Layers, RefreshCw } from 'lucide-react';
import { getParrillasGenerales, resolveWixMediaUrl } from '../services/wixService';

export default function HomePortal({ onSelectSlug, defaultSlug }) {
  const [slugInput, setSlugInput] = useState('');
  const [liveGrids, setLiveGrids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackGrids = [
    {
      title: 'Sistemas Cuauhtli',
      month: 'Septiembre 2026',
      slug: 'sisitemas-cuauhtli-septiembre-2026',
      postsCount: 25,
      hasPassword: true,
      badge: 'Parrilla Activa',
      image: '/assets/posts/p04_img01.jpeg'
    },
    {
      title: 'Cliente Nuevo Dilo',
      month: 'Octubre 2026',
      slug: 'cliente-nuevo-dilo-2026',
      postsCount: 1,
      hasPassword: true,
      badge: 'Parrilla Activa',
      image: '/assets/slides/slide_01.png'
    },
    {
      title: 'Buenatoma.MX',
      month: 'Agosto 2026',
      slug: 'buenatoma-mx',
      postsCount: 18,
      hasPassword: false,
      badge: 'En preparación',
      image: '/assets/slides/slide_02.png'
    }
  ];

  useEffect(() => {
    getParrillasGenerales()
      .then((items) => {
        if (items && items.length > 0) {
          const mapped = items.map((it) => ({
            title: it.title || 'Cliente',
            month: `${it.mes || '2026'}`,
            slug: it.slug || it.title?.toLowerCase().replace(/\s+/g, '-'),
            postsCount: it.title?.includes('Cuauhtli') ? 25 : 1,
            hasPassword: !!it.contrasea,
            badge: 'Parrilla Activa',
            image: resolveWixMediaUrl(it.mockup) || '/assets/slides/slide_01.png'
          }));
          setLiveGrids(mapped);
        } else {
          setLiveGrids(fallbackGrids);
        }
      })
      .catch(() => setLiveGrids(fallbackGrids))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (slugInput.trim()) {
      onSelectSlug(slugInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
            <img
              src="/assets/logo/dilo-logo-orange.png"
              alt="Dilo Digital"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400 block leading-none">
              Agencia
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white block leading-none mt-1">
              DILO <span className="text-orange-500">DIGITAL</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {defaultSlug && (
            <button
              onClick={() => onSelectSlug(defaultSlug)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20"
            >
              <span>← Volver a la Parrilla</span>
            </button>
          )}
          <span className="text-xs text-zinc-400 hidden sm:inline">@dilodigitalmx</span>
          <a
            href="https://www.dilodigitalmx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Web Oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Center Content */}
      <main className="my-auto py-12 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal de Presentación Dinámica</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-space text-white">
            Parrillas de Contenido
          </h1>
          <p className="text-base text-zinc-400 mt-4 leading-relaxed">
            Plataforma interactiva para clientes de Dilo Digital. Visualiza tu calendario mensual, copies estratégicos y creatividades en tiempo real.
          </p>
        </div>

        {/* Featured Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {(liveGrids.length > 0 ? liveGrids : fallbackGrids).map((g) => (
            <div
              key={g.slug}
              onClick={() => onSelectSlug(g.slug)}
              className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold">
                    {g.badge}
                  </span>
                  {g.hasPassword && (
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Protegido</span>
                    </span>
                  )}
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-800 mb-4 border border-zinc-700/50">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/assets/slides/slide_01.png';
                    }}
                  />
                </div>

                <h3 className="text-2xl font-bold text-white font-space group-hover:text-orange-400 transition-colors">
                  {g.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Parrilla mensual · {g.month}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-500">{g.postsCount} publicaciones</span>
                <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Abrir Presentación</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Slug Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 focus-within:border-orange-500 transition-colors">
            <Search className="w-5 h-5 text-zinc-500 ml-3 shrink-0" />
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="Ingresa código o slug del cliente..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
            >
              Acceder
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-6">
        <span>Dilo Digital © 2026 · Agencia de Crecimiento Digital</span>
        <span>WhatsApp Soporte: +52 55 9244 1070</span>
      </footer>
    </div>
  );
}
