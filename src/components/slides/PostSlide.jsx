import React, { useState } from 'react';
import { Check, ThumbsUp, MessageSquare, ZoomIn, ChevronLeft, ChevronRight, Layers, Sparkles, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import CommentsModal from '../CommentsModal';

export default function PostSlide({
  slide,
  onCopySuccess,
  comments = [],
  onAddComment,
  onDeleteComment,
  clientTitle,
  isApproved = false,
  onToggleApprove
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Filter comments for this specific slide
  const slideComments = comments.filter((c) => c.slideNumber === slide.pageNumber);
  const commentsCount = slideComments.length;

  // View mode: 'creative' (sharp social post) vs 'pdf' (full slide canvas)
  const [viewMode, setViewMode] = useState('creative');

  // Multi-image post creatives vs PDF slide
  const postImages = slide.postImages && slide.postImages.length > 0
    ? slide.postImages
    : (slide.images && slide.images.length > 0 ? slide.images : [slide.image]);

  const images = viewMode === 'creative' ? postImages : [slide.image];
  const isCarousel = images.length > 1;

  // Video post check
  const isVideo =
    slide.isVideo ||
    !!slide.videoUrl ||
    slide.type?.toUpperCase().includes('VIDEO') ||
    slide.type?.toUpperCase().includes('REEL') ||
    slide.pageNumber === 5; // Demonstration video post

  const videoUrl = slide.videoUrl || '/assets/video/sample_reel.mp4';

  const handleApprove = () => {
    if (onToggleApprove) {
      onToggleApprove(slide.pageNumber);
    }
    if (!isApproved) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF5A00', '#111111', '#10B981']
      });
    }
  };

  return (
    <div className="slide-content post-slide flex w-full h-full relative overflow-hidden bg-white select-none">
      {/* Black Left Rounded Category Pill */}
      <div className="pdf-side-pill shrink-0 flex items-center justify-between md:justify-center">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xs sm:text-sm md:text-2xl font-space">
          {isVideo ? 'VIDEO / REEL' : (slide.type || 'POST')}
        </span>
        {/* Mobile View Toggle: Post Creative vs Full PDF Slide */}
        <div className="flex md:hidden items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700 text-[10px] font-bold">
          <button
            onClick={() => { setViewMode('creative'); setActiveImageIdx(0); }}
            className={`px-2 py-0.5 rounded transition-all ${
              viewMode === 'creative'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Post
          </button>
          <button
            onClick={() => { setViewMode('pdf'); setActiveImageIdx(0); }}
            className={`px-2 py-0.5 rounded transition-all ${
              viewMode === 'pdf'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Lámina
          </button>
        </div>
      </div>

      {/* Authentic Dilo Graphics on Right (Desktop only) */}
      <img
        src="/assets/graphics/dilo-right-motif.png"
        alt=""
        className="absolute top-8 md:top-12 -right-2 md:right-4 h-[65%] sm:h-[72%] md:h-[78%] max-h-[560px] object-contain pointer-events-none select-none hidden xl:block z-0 opacity-70"
      />

      {/* Slide Body: 2 Columns on desktop, clean vertical stack on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-start lg:justify-between gap-3 sm:gap-6 p-2.5 sm:p-4 md:py-3 md:px-6 lg:py-4 lg:px-8 overflow-y-auto lg:overflow-hidden scrollbar-none [&::-webkit-scrollbar]:hidden max-w-7xl mx-auto w-full z-10">
        {/* Left Column: Media Presentation in 4:5 with arrows OUTSIDE the image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full">
            {/* Carousel navigation arrow: Left (Outside the image) */}
            {isCarousel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="p-2 sm:p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                title="Lámina anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Clean 4:5 Media Frame (Seamless, unboxed) */}
            <div className="relative w-full max-w-[320px] sm:max-w-[370px] md:max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center group bg-transparent">
              {isVideo ? (
                <div className="w-full h-full bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center relative">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    loop
                    className="w-full h-full object-cover rounded-2xl"
                    poster={images[0]}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg pointer-events-none flex items-center gap-1">
                    <Play className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>Video / Reel</span>
                  </span>
                </div>
              ) : (
                <img
                  src={images[activeImageIdx]}
                  alt={`Slide ${slide.pageNumber}`}
                  className="w-full h-full object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
                  onClick={() => setIsLightboxOpen(true)}
                />
              )}

              {/* Lightbox zoom button overlay (images only) */}
              {!isVideo && (
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-2.5 right-2.5 p-1.5 sm:p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Ampliar creatividad"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Carousel Slide Counter Badge */}
              {isCarousel && !isVideo && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/75 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 pointer-events-none">
                  <Layers className="w-3 h-3 text-orange-400" />
                  <span>
                    Lámina {activeImageIdx + 1} de {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Carousel navigation arrow: Right (Outside the image) */}
            {isCarousel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="p-2 sm:p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                title="Siguiente lámina"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Carousel thumbnails strip (Gallery underneath) */}
          {isCarousel && !isVideo && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    idx === activeImageIdx
                      ? 'border-orange-500 scale-105 shadow-md shadow-orange-500/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Action Bar directly under the post on Mobile (<lg) */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs sm:max-w-md mt-3 lg:hidden">
            <button
              onClick={handleApprove}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isApproved
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-zinc-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{isApproved ? 'Aprobado ✓' : 'Aprobar Post'}</span>
            </button>

            <button
              onClick={() => setIsCommentModalOpen(true)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : commentsCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
              }`}
            >
              {isApproved ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <MessageSquare className="w-4 h-4 text-orange-600" />
              )}
              <span>{isApproved ? 'Aprobado (Cerrado)' : 'Comentarios'}</span>
              {commentsCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${isApproved ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'}`}>
                  {commentsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Copy & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between max-w-xl mt-2 sm:mt-3 lg:mt-0">
          {/* Top Bar: Orange COPY Pill + Client Actions (Desktop only) */}
          <div className="hidden lg:flex items-center justify-between gap-2 mb-2">
            {/* Orange COPY Pill faithful to PDF */}
            <div className="copy-badge-pill">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              <span className="font-extrabold tracking-wider font-space text-base sm:text-lg">COPY</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Comment button with counter badge */}
              <button
                onClick={() => setIsCommentModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isApproved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : commentsCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                }`}
                title={isApproved ? 'Post aprobado - Comentarios cerrados' : 'Comentarios y solicitudes de cambio'}
              >
                {isApproved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                )}
                <span>{isApproved ? 'Aprobado' : 'Comentarios'}</span>
                {commentsCount > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${isApproved ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'}`}>
                    {commentsCount}
                  </span>
                )}
              </button>

              {/* Independent Approval status button */}
              <button
                onClick={handleApprove}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isApproved
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{isApproved ? 'Aprobado ✓' : 'Aprobar Post'}</span>
              </button>
            </div>
          </div>

          {/* If there are comments on this slide, show visible confirmation bar */}
          {commentsCount > 0 && (
            <div
              onClick={() => setIsCommentModalOpen(true)}
              className="mb-2 px-3 py-1.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/90 transition-colors"
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

          {/* Copy Text Body (PROTECTED FROM COPYING, NO NATIVE SCROLLBAR) */}
          <div
            className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-zinc-800 leading-relaxed max-h-[350px] sm:max-h-[390px] lg:max-h-[430px] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] font-sans shadow-inner space-y-1.5 sm:space-y-2 select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
            onCopy={(e) => { e.preventDefault(); return false; }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              <span>Copy de la Publicación</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-normal">Solo lectura</span>
            </div>
            {slide.copy ? (
              slide.copy.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line select-none" onCopy={(e) => e.preventDefault()}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-zinc-400 italic">Sin texto de copy disponible para este slide.</p>
            )}

            {/* Hashtags Section */}
            {slide.hashtags && (
              <div className="pt-2.5 border-t border-zinc-200/80 text-[11px] sm:text-xs text-orange-600 font-medium select-none" onCopy={(e) => e.preventDefault()}>
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
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
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
        isSlideApproved={isApproved}
        wixPostId={slide.wixPostId || slide.id}
      />
    </div>
  );
}
