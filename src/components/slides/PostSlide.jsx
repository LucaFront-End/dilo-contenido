import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, MessageSquare, ZoomIn, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CommentsModal from '../CommentsModal';

export default function PostSlide({
  slide,
  onCopySuccess,
  comments = [],
  onAddComment,
  onDeleteComment,
  clientTitle
}) {
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Filter comments for this specific slide
  const slideComments = comments.filter((c) => c.slideNumber === slide.pageNumber);
  const commentsCount = slideComments.length;

  // If slide has multiple carousel images or single image
  const images = slide.images && slide.images.length > 0 ? slide.images : [slide.image];
  const isCarousel = images.length > 1;

  const handleCopy = () => {
    const fullText = `${slide.copy || ''}\n\n${slide.hashtags || ''}`.trim();
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      if (onCopySuccess) onCopySuccess('¡Copy copiado al portapapeles con éxito!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleApprove = () => {
    const newStatus = !approved;
    setApproved(newStatus);
    if (newStatus) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF5A00', '#111111', '#10B981']
      });
      if (onCopySuccess) onCopySuccess('¡Publicación aprobada por el cliente! 🎉');
    }
  };

  return (
    <div className="slide-content post-slide flex w-full h-full relative overflow-hidden bg-white select-text">
      {/* Black Left Rounded Category Pill */}
      <div className="pdf-side-pill shrink-0">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          {slide.type || 'POST'}
        </span>
      </div>

      {/* Decorative Vectors on Right */}
      <div className="decor-arch absolute top-20 right-4 pointer-events-none opacity-80 hidden xl:block">
        <svg width="100" height="180" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="10" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="5" fill="#18181b" />
          <circle cx="70" cy="210" r="5" fill="#FF5A00" />
        </svg>
      </div>

      {/* Slide Body: 2 Columns on desktop, clean vertical stack on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-start lg:justify-between gap-4 md:gap-6 p-3 sm:p-6 md:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        {/* Left Column: Media Presentation */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg aspect-square bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/80 shadow-md md:shadow-xl flex items-center justify-center group mx-auto">
            <img
              src={images[activeImageIdx]}
              alt={`Slide ${slide.pageNumber}`}
              className="w-full h-full object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Lightbox button overlay */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="Ampliar creatividad"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Carousel navigation buttons */}
            {isCarousel && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all"
                  title="Anterior lámina del carrusel"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all"
                  title="Siguiente lámina del carrusel"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badge Indicator */}
            {isCarousel && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  Lámina {activeImageIdx + 1} de {images.length}
                </span>
              </div>
            )}
          </div>

          {/* Carousel thumbnails strip */}
          {isCarousel && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIdx
                      ? 'border-orange-500 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Copy & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between max-w-xl mt-4 lg:mt-0">
          {/* Top Bar: Orange COPY Pill + Client Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            {/* Orange COPY Pill faithful to PDF */}
            <div className="copy-badge-pill">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              <span className="font-extrabold tracking-wider font-space text-lg">COPY</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Comment button with counter badge */}
              <button
                onClick={() => setIsCommentModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  commentsCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                }`}
                title="Comentarios y solicitudes de cambio"
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                <span>Comentarios</span>
                {commentsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-orange-500 text-white text-[10px] font-black rounded-full">
                    {commentsCount}
                  </span>
                )}
              </button>

              {/* Approval status button */}
              <button
                onClick={handleApprove}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  approved
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{approved ? 'Aprobado ✓' : 'Aprobar Post'}</span>
              </button>

              {/* Copy copy button */}
              <button
                onClick={handleCopy}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* If there are comments on this slide, show visible confirmation bar! */}
          {commentsCount > 0 && (
            <div
              onClick={() => setIsCommentModalOpen(true)}
              className="mb-3 px-3.5 py-2 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/90 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  {commentsCount === 1
                    ? '1 comentario / solicitud subido a esta lámina'
                    : `${commentsCount} comentarios / solicitudes subidos a esta lámina`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 hover:underline">
                Ver detalle ↗
              </span>
            </div>
          )}

          {/* Copy Text Body */}
          <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-5 text-sm text-zinc-800 leading-relaxed max-h-[380px] overflow-y-auto font-sans shadow-inner space-y-3">
            {slide.copy ? (
              slide.copy.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-zinc-400 italic">Sin texto de copy disponible para este slide.</p>
            )}

            {/* Hashtags Section */}
            {slide.hashtags && (
              <div className="pt-3 border-t border-zinc-200/80 text-xs text-orange-600 font-medium">
                <p className="leading-relaxed font-mono">{slide.hashtags}</p>
              </div>
            )}
          </div>

          {/* Quick Details / Feedback hint */}
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
            <span>Diapositiva #{slide.pageNumber} · Dilo Digital</span>
            <span className="text-zinc-500">¿Requieres cambios en este post? Avísanos</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={images[activeImageIdx]}
              alt="Creatividad completa"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold transition-colors"
            >
              Cerrar visualizador (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Comments Drawer / Modal */}
      <CommentsModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        slideNumber={slide.pageNumber}
        slideType={slide.type}
        allComments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        clientTitle={clientTitle}
        isGlobalView={false}
      />
    </div>
  );
}
