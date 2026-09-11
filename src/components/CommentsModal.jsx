import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, Trash2, X, Tag, User, Sparkles, Share2 } from 'lucide-react';

export default function CommentsModal({
  isOpen,
  onClose,
  slideNumber,
  slideType,
  allComments = [],
  onAddComment,
  onDeleteComment,
  onNavigateToSlide,
  clientTitle = 'Cliente',
  isGlobalView = false,
  isSlideApproved = false
}) {
  const [author, setAuthor] = useState(clientTitle);
  const [category, setCategory] = useState('Cambio de Copy');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState(null);

  if (!isOpen) return null;

  // Filter comments for this slide if not in global view
  const slideComments = isGlobalView
    ? allComments
    : allComments.filter((c) => c.slideNumber === slideNumber);

  const categories = [
    { label: 'Cambio de Copy', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { label: 'Cambio de Imagen', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { label: 'Aprobado con nota', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { label: 'Duda / Consulta', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { label: 'General', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSlideApproved) return;

    setSubmitting(true);

    const newComment = {
      slideNumber: slideNumber || 1,
      slideType: slideType || 'POST',
      author: author.trim() || clientTitle,
      category,
      text: commentText.trim()
    };

    onAddComment(newComment);
    setCommentText('');
    setSubmitting(false);
    setLastSubmittedId(Date.now());
  };

  const formatTimestamp = (isoDate) => {
    if (!isoDate) return 'Reciente';
    const d = new Date(isoDate);
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-zinc-200 animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg font-space tracking-tight">
                {isGlobalView
                  ? `Comentarios de la Parrilla (${allComments.length})`
                  : `Comentarios para la Lámina #${slideNumber}`}
              </h3>
              <p className="text-xs text-zinc-400">
                {isGlobalView
                  ? 'Resumen de todas las solicitudes y feedback de la parrilla'
                  : `Tipo: ${slideType || 'POST'} · ${clientTitle}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* If post is approved, show notification banner and disable adding comments */}
          {isSlideApproved && !isGlobalView ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    Publicación Aprobada
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded-full">
                    Aprobado ✓
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Esta publicación ya cuenta con tu aprobación. Para mantener el flujo ordenado y evitar solicitudes contradictorias o duplicadas, no es necesario agregar nuevos comentarios. Si requieres reabrirla, desmarca el botón de aprobación en el post.
                </p>
              </div>
            </div>
          ) : !isGlobalView ? (
            /* New Comment Form */
            <form onSubmit={handleSubmit} className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Dejar comentario o solicitud de cambio</span>
                </span>
                <span className="text-[11px] text-zinc-400">Se registrará en tiempo real</span>
              </div>

              {/* Author & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                    Tu Nombre o Empresa
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ej. Cuauhtli Marketing"
                      className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                    Tipo de Solicitud
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-orange-500"
                    >
                      {categories.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Escribe aquí tu observación (ej: 'Cambiar el número de teléfono por el de guardia', 'Ajustar el copy de la línea 3', etc.)..."
                  className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-400">
                  Notifica directamente a tu Social Media Manager
                </span>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Comentario</span>
                </button>
              </div>
            </form>
          ) : null}

          {/* List of Comments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                {isGlobalView
                  ? `Comentarios Registrados (${slideComments.length})`
                  : `Historial de Comentarios en esta Lámina (${slideComments.length})`}
              </h4>
            </div>

            {slideComments.length === 0 ? (
              <div className="py-10 text-center bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6">
                <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-600">
                  Aún no hay comentarios en esta lámina
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Usa el formulario arriba para solicitar cambios o dejar tus observaciones.
                </p>
              </div>
            ) : (
              slideComments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">
                        {cmt.author || 'Cliente'}
                      </span>
                      {isGlobalView && (
                        <button
                          onClick={() => {
                            if (onNavigateToSlide) onNavigateToSlide(cmt.slideNumber - 1);
                            onClose();
                          }}
                          className="px-2 py-0.5 bg-zinc-100 hover:bg-orange-100 text-zinc-700 hover:text-orange-700 font-mono text-[10px] font-bold rounded cursor-pointer"
                        >
                          Lámina #{cmt.slideNumber} ↗
                        </button>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                        {cmt.category}
                      </span>
                    </div>

                    {/* Status Badge: Shows the client that it was successfully submitted! */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Subido a la parrilla</span>
                      </div>
                      {onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(cmt.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-opacity"
                          title="Eliminar comentario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-zinc-700 whitespace-pre-line leading-relaxed pl-1">
                    {cmt.text}
                  </p>

                  {/* Timestamp & Status info */}
                  <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(cmt.createdAt)}</span>
                    </span>
                    <span className="text-emerald-700 font-medium">
                      ✓ Notificado al equipo de Dilo Digital
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>Los comentarios quedan vinculados a esta parrilla mensual</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
