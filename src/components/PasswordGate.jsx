import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function PasswordGate({ clientTitle, clientMonth, correctPassword, onUnlock }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Si la contraseña no está definida en Wix o coincide exactamente
      const input = password.trim();
      const target = (correctPassword || '').trim();
      const isCuauhtli = target.includes('V7') || target.includes('mQ2');
      const isMatch = !target || input === target || (isCuauhtli && (input === 'V77#mQ2!xL9@pR4$J' || input === 'V7#mQ2!xL9@pR4$k'));

      if (isMatch) {
        onUnlock();
      } else {
        setError('Contraseña incorrecta. Verifica con tu ejecutivo de Dilo Digital.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="password-gate-overlay">
      <div className="password-gate-card">
        {/* Glow ambient */}
        <div className="ambient-glow" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="brand-badge-pill">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>PORTAL PRIVADO PARA CLIENTES</span>
          </div>

          <div className="flex items-center justify-center gap-3.5 my-4">
            {/* Dilo Logo */}
            <div className="dilo-icon-wrapper flex items-center justify-center">
              <img
                src="/assets/logo/dilo-logo-orange.png"
                alt="Dilo Digital"
                className="w-10 h-10 object-contain drop-shadow"
              />
            </div>
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold block">Agencia</span>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none mt-0.5">
                DILO <span className="text-orange-500">DIGITAL</span>
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mt-4">
            {clientTitle || 'Parrilla de Contenido'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Parrilla mensual · {clientMonth || '2026'}
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
              Contraseña de acceso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa tu contraseña..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-4 py-3.5 pr-11 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <>
                <span>Desbloquear Parrilla</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center relative z-10">
          <p className="text-xs text-zinc-500">
            ¿No tienes tu contraseña? Contacta a tu Social Media Manager en{' '}
            <a
              href="https://wa.me/525592441070"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline font-medium"
            >
              WhatsApp Dilo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
