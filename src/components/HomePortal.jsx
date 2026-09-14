import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, ExternalLink, Search, Lock, ChevronLeft, X, Filter, Check, RefreshCw } from 'lucide-react';
import { getParrillasGenerales, resolveWixMediaUrl } from '../services/wixService';

export default function HomePortal({ onSelectSlug, defaultSlug, brandFilter, onClearBrandFilter }) {
  const [slugInput, setSlugInput] = useState('');
  const [liveGrids, setLiveGrids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState(brandFilter || 'all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fallbackGrids = [
    {
      title: 'Sistemas Cuauhtli',
      month: 'Septiembre 2026',
      slug: 'sistemas-cuauhtli-septiembre-2026',
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
            title: (it.title || 'Cliente').trim(),
            month: `${it.mes || '2026'}`.trim(),
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

  // Update selectedBrand when brandFilter prop changes
  useEffect(() => {
    if (brandFilter) {
      setSelectedBrand(brandFilter);
    }
  }, [brandFilter]);

  const allGrids = liveGrids.length > 0 ? liveGrids : fallbackGrids;

  // Extract unique brands with counts
  const brandStats = useMemo(() => {
    const stats = {};
    allGrids.forEach((g) => {
      const b = (g.title || 'Cliente').trim();
      stats[b] = (stats[b] || 0) + 1;
    });
    return stats;
  }, [allGrids]);

  const uniqueBrands = Object.keys(brandStats);

  // Extract unique months with counts
  const monthStats = useMemo(() => {
    const stats = {};
    allGrids.forEach((g) => {
      const m = (g.month || '').trim().toUpperCase();
      if (m && m !== '2026') {
        const cleanM = m.split(' ')[0];
        stats[cleanM] = (stats[cleanM] || 0) + 1;
      }
    });
    return stats;
  }, [allGrids]);

  const uniqueMonths = Object.keys(monthStats);

  // Filter grids dynamically
  const displayedGrids = useMemo(() => {
    return allGrids.filter((g) => {
      // 1. Filter by Brand
      if (selectedBrand !== 'all') {
        const gTitle = (g.title || '').toLowerCase();
        const sBrand = selectedBrand.toLowerCase();
        if (!gTitle.includes(sBrand) && !sBrand.includes(gTitle)) {
          return false;
        }
      }

      // 2. Filter by Month
      if (selectedMonth !== 'all') {
        const gMonth = (g.month || '').toLowerCase();
        const sMonth = selectedMonth.toLowerCase();
        if (!gMonth.includes(sMonth)) {
          return false;
        }
      }

      // 3. Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (g.title || '').toLowerCase().includes(q);
        const matchMonth = (g.month || '').toLowerCase().includes(q);
        const matchSlug = (g.slug || '').toLowerCase().includes(q);
        if (!matchTitle && !matchMonth && !matchSlug) {
          return false;
        }
      }

      return true;
    });
  }, [allGrids, selectedBrand, selectedMonth, searchQuery]);

  const handleClearFilters = () => {
    setSelectedBrand('all');
    setSelectedMonth('all');
    setSearchQuery('');
    if (onClearBrandFilter) {
      onClearBrandFilter();
    }
  };

  const handleSelectBrandChip = (brand) => {
    setSelectedBrand(brand);
    if (brand === 'all' && onClearBrandFilter) {
      onClearBrandFilter();
    }
  };

  const handleSearchSlugSubmit = (e) => {
    e.preventDefault();
    if (slugInput.trim()) {
      onSelectSlug(slugInput.trim(), true);
    }
  };

  const isFiltered = selectedBrand !== 'all' || selectedMonth !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-12 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between relative z-10 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
            <img
              src="/assets/logo/dilo-logo-orange.png"
              alt="Dilo Digital"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-zinc-400 block leading-none">
              Agencia
            </span>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white block leading-none mt-1">
              DILO <span className="text-orange-500">DIGITAL</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Ver todas las marcas y meses"
            >
              <X className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Ver Todos los Clientes</span>
              <span className="sm:hidden">Todos</span>
            </button>
          )}

          {defaultSlug && (
            <button
              onClick={() => onSelectSlug(defaultSlug, false)}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 cursor-pointer shrink-0"
              title="Regresar a la presentación de la parrilla"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volver a la Parrilla</span>
              <span className="sm:hidden">Volver</span>
            </button>
          )}

          <a
            href="https://www.dilodigitalmx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Web Oficial</span>
            <span className="sm:hidden">Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Center Content */}
      <main className="my-auto py-8 md:py-12 max-w-5xl mx-auto w-full relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {selectedBrand !== 'all' ? `Parrillas de ${selectedBrand}` : 'Portal de Presentación Dinámica'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight font-space text-white">
            {selectedBrand !== 'all' ? (
              <>
                Parrillas de <span className="text-orange-500">{selectedBrand}</span>
              </>
            ) : (
              <>
                Parrillas de <span className="text-orange-500">Contenido</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 mt-3 sm:mt-4 leading-relaxed px-2">
            {selectedBrand !== 'all'
              ? `Historial de calendarios y publicaciones mensuales de ${selectedBrand}. Selecciona una edición para visualizar copies, creatividades y métricas.`
              : 'Plataforma interactiva para clientes de Dilo Digital. Visualiza tu calendario mensual, copies estratégicos y creatividades en tiempo real.'}
          </p>
        </div>

        {/* Dynamic Filters Suite */}
        <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-3xl p-4 sm:p-6 mb-8 backdrop-blur-md shadow-2xl">
          {/* 1. Live Search Bar */}
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, mes o tema en tiempo real..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-orange-500 rounded-2xl pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                title="Borrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Brand Filter Chips */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2.5">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-orange-500" />
                <span>Filtrar por Cliente / Marca:</span>
              </span>
              {selectedBrand !== 'all' && (
                <button
                  onClick={() => handleSelectBrandChip('all')}
                  className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer lowercase"
                >
                  (mostrar todos)
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
              <button
                onClick={() => handleSelectBrandChip('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedBrand === 'all'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 border border-orange-500'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
                }`}
              >
                <span>Todos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedBrand === 'all' ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {allGrids.length}
                </span>
              </button>

              {uniqueBrands.map((brand) => {
                const count = brandStats[brand] || 0;
                const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                return (
                  <button
                    key={brand}
                    onClick={() => handleSelectBrandChip(brand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 border border-orange-500'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{brand}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Month Filter Chips (if multiple months exist) */}
          {uniqueMonths.length > 1 && (
            <div className="pt-3 border-t border-zinc-800/60">
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Mes de Publicación:</span>
                {selectedMonth !== 'all' && (
                  <button
                    onClick={() => setSelectedMonth('all')}
                    className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer lowercase"
                  >
                    (todos los meses)
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                <button
                  onClick={() => setSelectedMonth('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedMonth === 'all'
                      ? 'bg-zinc-200 text-zinc-950 font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Todos los meses
                </button>

                {uniqueMonths.map((m) => {
                  const isSelected = selectedMonth.toUpperCase() === m.toUpperCase();
                  const count = monthStats[m] || 0;
                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-zinc-200 text-zinc-950 font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      <span>{m}</span>
                      <span className="text-[10px] text-zinc-500">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Filter Counter & Quick Reset */}
          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Mostrando <strong className="text-white">{displayedGrids.length}</strong> de <strong className="text-white">{allGrids.length}</strong> parrillas
              {selectedBrand !== 'all' && <span className="text-orange-400 ml-1.5 font-semibold">· {selectedBrand}</span>}
              {selectedMonth !== 'all' && <span className="text-zinc-300 ml-1 font-semibold">({selectedMonth})</span>}
            </span>

            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Grids Cards */}
        {displayedGrids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            {displayedGrids.map((g) => (
              <div
                key={`${g.slug}-${g.month}`}
                onClick={() => onSelectSlug(g.slug, true /* force password check */)}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold">
                      {g.badge}
                    </span>
                    {g.hasPassword && (
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Protegido con Clave</span>
                      </span>
                    )}
                  </div>

                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-800 mb-4 border border-zinc-700/50 relative">
                    <img
                      src={g.image}
                      alt={g.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/assets/slides/slide_01.png';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 uppercase tracking-wide">
                      {g.month}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-space group-hover:text-orange-400 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Parrilla mensual · {g.month}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">{g.postsCount} publicaciones</span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Ingresar a Parrilla</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no grids match filter */
          <div className="text-center py-12 px-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl max-w-xl mx-auto mb-10">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No se encontraron parrillas</h3>
            <p className="text-sm text-zinc-400 mb-5">
              No hay publicaciones coincidentes con los filtros seleccionados
              {selectedBrand !== 'all' ? ` para ${selectedBrand}` : ''}.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-600/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer todos los filtros</span>
            </button>
          </div>
        )}

        {/* Custom Slug Search / Direct Access */}
        <div className="max-w-md mx-auto text-center pt-4">
          <p className="text-xs text-zinc-500 mb-2 font-medium">¿Tienes un código o enlace privado directo?</p>
          <form onSubmit={handleSearchSlugSubmit} className="relative">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 focus-within:border-orange-500 transition-colors">
              <Search className="w-4 h-4 text-zinc-500 ml-3 shrink-0" />
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="Ingresa código o slug (ej. buenatoma-mx)..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Acceder
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-6 mt-8">
        <span>Dilo Digital © 2026 · Agencia de Marketing Digital</span>
        <span>WhatsApp Soporte: +52 55 9244 1070</span>
      </footer>
    </div>
  );
}
