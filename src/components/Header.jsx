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
  onOpenPortal
}) {
  return (
    <header className="dilo-header">
      <div className="dilo-header-top">
        {/* Left handle: @dilodigitalmx and client info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
            title="Ir al Portal de Parrillas"
          >
            <div className="dilo-brand-logo flex items-center">
              <img
                src="/assets/logo/dilo-logo-orange.png"
                alt="Dilo Digital"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="dilo-handle font-bold text-sm text-zinc-800 tracking-wide group-hover:text-orange-600 transition-colors">
              @dilodigitalmx
            </span>
          </button>
          {clientTitle && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold tracking-wider uppercase">
              {clientTitle} · {clientMonth}
            </span>
          )}
          {onOpenPortal && (
            <button
              onClick={onOpenPortal}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-orange-50 text-zinc-700 hover:text-orange-600 border border-zinc-200 transition-colors hidden sm:flex items-center gap-1.5"
              title="Cambiar de parrilla o ver todos los clientes"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Clientes</span>
            </button>
          )}
        </div>

        {/* Center decorative line (faithful to PDF) */}
        <div className="dilo-header-line flex-1 mx-4" />

        {/* Right tools and 2026 label */}
        <div className="flex items-center gap-3">
          {/* Live sync status badge */}
          <div
            className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
              isWixLive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
            }`}
            onClick={onRefreshWix}
            title="Parrilla sincronizada en tiempo real. Clic para refrescar."
          >
            <span className={`w-2 h-2 rounded-full ${isWixLive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
            <span className="hidden sm:inline font-semibold">En Línea</span>
            <RefreshCw className="w-3 h-3 text-zinc-400 hover:text-zinc-600" />
          </div>

          {/* View mode toggle */}
          <div className="view-mode-toggle flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setViewMode('slides')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'slides'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Vista Diapositivas (Formato PDF)"
            >
              <Presentation className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline">Diapositivas</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
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
            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Copiar enlace de la parrilla"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Relock Button */}
          {onRelock && (
            <button
              onClick={onRelock}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Bloquear parrilla"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* 2026 Year Indicator */}
          <span className="dilo-year font-bold text-base text-zinc-900 tracking-tight ml-1">
            2026
          </span>
        </div>
      </div>
    </header>
  );
}
