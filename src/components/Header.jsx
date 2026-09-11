import React from 'react';
import { Maximize2, Minimize2, Share2, LayoutGrid, Presentation, Lock, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({
  clientTitle,
  clientMonth,
  viewMode,
  setViewMode,
  isFullscreen,
  toggleFullscreen,
  onRelock,
  onShare,
  isWixLive,
  onRefreshWix,
  onOpenPortal,
  onOpenBrandPortal
}) {
  return (
    <header className="dilo-header w-full px-3 py-2 md:px-6 md:py-3 sticky top-0 z-40 bg-white border-b border-zinc-200 overflow-x-hidden">
      <div className="dilo-header-top flex items-center justify-between max-w-[1500px] mx-auto w-full gap-2">
        {/* Left handle: @dilodigitalmx, full client title badge, and brand parrillas button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-nowrap">
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 sm:gap-2 group hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            title="Ir al Portal General de Parrillas"
          >
            <div className="dilo-brand-logo flex items-center">
              <img
                src="/assets/logo/dilo-logo-black.png"
                alt="Dilo Digital"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <span className="dilo-handle font-bold text-xs sm:text-sm text-zinc-800 tracking-wide group-hover:text-orange-600 transition-colors">
              @dilodigitalmx
            </span>
          </button>

          {/* Full client name badge without cut-off */}
          {clientTitle && (
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full bg-orange-100 text-orange-700 font-bold tracking-wide uppercase whitespace-nowrap hidden sm:inline-flex items-center shrink-0">
              {clientTitle} · {clientMonth}
            </span>
          )}

          {/* Button next to client name: Opens strictly the parrillas of this specific brand */}
          {(onOpenBrandPortal || onOpenPortal) && (
            <button
              onClick={onOpenBrandPortal || onOpenPortal}
              className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-orange-50 text-zinc-700 hover:text-orange-600 border border-zinc-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title={`Ver todas las parrillas de ${clientTitle || 'la marca'}`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
              <span className="hidden md:inline">Parrillas de {clientTitle ? clientTitle.split(' ')[0] : 'Marca'}</span>
              <span className="md:hidden">Parrillas</span>
            </button>
          )}
        </div>

        {/* Short decorative line so the client name has plenty of space to fit */}
        <div className="dilo-header-line w-6 lg:w-16 shrink-0 mx-2 lg:mx-3 hidden lg:block" />

        {/* Right tools and 2026 label */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live sync status badge */}
          <div
            className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
              isWixLive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
            }`}
            onClick={onRefreshWix}
            title="Parrilla sincronizada en tiempo real. Clic para refrescar."
          >
            <span className={`w-2 h-2 rounded-full ${isWixLive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
            <span className="hidden sm:inline font-semibold">En Línea</span>
            <RefreshCw className="w-3 h-3 text-zinc-400 hover:text-zinc-600 hidden sm:inline" />
          </div>

          {/* View mode toggle */}
          <div className="view-mode-toggle flex bg-zinc-100 p-0.5 sm:p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setViewMode('slides')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'slides'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Vista Diapositivas"
            >
              <Presentation className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline">Diapositivas</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Vista Mosaico Feed"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline">Feed Grid</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors hidden sm:block cursor-pointer"
            title="Copiar enlace de la parrilla"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors hidden sm:block cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Relock Button */}
          {onRelock && (
            <button
              onClick={onRelock}
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Bloquear parrilla"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* 2026 Year Indicator */}
          <span className="dilo-year font-bold text-sm sm:text-base text-zinc-900 tracking-tight ml-0.5 hidden sm:inline">
            2026
          </span>
        </div>
      </div>
    </header>
  );
}
