import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl bg-zinc-950/95 border border-white/10 text-white backdrop-blur-md animate-fade-in text-sm font-medium">
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      ) : toast.type === 'info' ? (
        <Info className="w-5 h-5 text-sky-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-zinc-400 hover:text-white transition-colors p-1"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}
