import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  ThumbsUp,
  MessageSquare,
  Play,
  X,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CommentsModal from './CommentsModal';
import { getOptimizedWixImage } from '../services/wixService';

function formatTypeLabel(raw, rawType) {
  if (rawType && rawType.trim()) return rawType.trim();
  if (!raw) return 'Post';
  const clean = raw.trim();
  return clean
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function FeedGridView({
  slides = [],
  clientTitle = '',
  onCopyToast,
  onSelectSlide,
  comments = [],
  onAddComment,
  onDeleteComment,
  approvedPosts = {},
  onToggleApprove
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCommentSlide, setActiveCommentSlide] = useState(null);
  const [cardCarouselIdx, setCardCarouselIdx] = useState({});
  const [expandedCopySlideId, setExpandedCopySlideId] = useState(null);
  const [playingPostId, setPlayingPostId] = useState(null);

  // Filter posts (all dynamic post slides from Wix CMS)
  const contentSlides = (slides || []).filter(
    (s) =>
      s &&
      (s.wixPostId ||
        (!['COVER', 'FEED', 'ESTRATEGIA', 'CALENDARIO', 'HASTAGS', 'HASHTAGS', 'CONTACT', 'CONTACTO'].includes(
          (s.type || '').toUpperCase()
        )))
  );
  const totalContentPosts = contentSlides.length;
  const approvedCount = contentSlides.filter((s) => !!approvedPosts[s.pageNumber]).length;
  const approvalPercent = totalContentPosts > 0 ? Math.round((approvedCount / totalContentPosts) * 100) : 0;

  // Dynamic categories/types directly from Wix CMS content slides
  const availableTypes = React.useMemo(() => {
    const counts = {};
    contentSlides.forEach((s) => {
      const displayLabel = (s.rawType || s.type || 'Post').trim();
      const normKey = displayLabel.toUpperCase();
      if (!counts[normKey]) {
        counts[normKey] = {
          key: normKey,
          label: displayLabel,
          count: 0
        };
      }
      counts[normKey].count += 1;
    });
    return Object.values(counts);
  }, [contentSlides]);

  const filtered = contentSlides.filter((s) => {
    if (activeFilter === 'ALL') return true;
    const itemLabel = (s.rawType || s.type || 'POST').trim().toUpperCase();
    return itemLabel === activeFilter.toUpperCase();
  });

  const handleToggle = (pageNumber) => {
    if (onToggleApprove) {
      onToggleApprove(pageNumber);
    }
    if (!approvedPosts[pageNumber]) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FF5A00', '#10B981']
      });
    }
  };

  return (
    <div
      className="feed-grid-view w-full max-w-7xl mx-auto p-4 md:p-8 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
    >
      {/* Top Filter Bar: Aprobado arriba, Todos y tipos de contenido abajo */}
      <div className="flex flex-col gap-3.5 mb-6 md:mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
        {/* Fila 1 (Arriba): Título + Progreso y Badge de Aprobado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-space tracking-tight">
              Mosaico de Publicaciones
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Vista general de todas las publicaciones programadas para {clientTitle}.
            </p>
          </div>

          {/* Porcentaje de Aprobación Arriba */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 hidden md:inline">
                Aprobación general:
              </span>
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border shadow-2xs transition-all ${
                  approvalPercent === 100
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                    : approvalPercent > 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}
                title="Porcentaje total de publicaciones aprobadas"
              >
                <Check className={`w-3.5 h-3.5 ${approvalPercent === 100 ? 'text-white' : 'text-emerald-600'}`} />
                <span>{approvalPercent}% Aprobado</span>
                <span className="text-[10px] opacity-80 font-bold">
                  ({approvedCount}/{totalContentPosts})
                </span>
              </div>
            </div>

            {/* Mini barra de progreso visual */}
            <div className="w-full sm:w-48 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/80">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${approvalPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fila 2 (Abajo): "Todos" y tipos de post dinámicos para que quepan holgadamente */}
        <div className="border-t border-zinc-100 pt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'ALL'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200/60'
            }`}
          >
            Todos ({contentSlides.length})
          </button>

          {availableTypes.map((cat) => {
            const isSelected = activeFilter.toUpperCase() === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-orange-600/70 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Posts in 4:5 Instagram proportion with Carousel */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center my-6 shadow-sm">
          <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">No se encontraron publicaciones</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            No hay publicaciones que coincidan con la categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Ver todas las publicaciones
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((slide, postIdx) => {
            const isApproved = !!approvedPosts[slide.pageNumber];
            const isVideo =
              slide.isVideo ||
              slide.videoUrl ||
              slide.type?.toUpperCase().includes('VIDEO') ||
              slide.pageNumber === 5;

            // Carousel post creatives vs single image
            const postImages =
              slide.postImages && slide.postImages.length > 0
                ? slide.postImages
                : slide.images && slide.images.length > 0
                ? slide.images
                : slide.image
                ? [slide.image]
                : ['/assets/logo/dilo-logo-black.png'];

            const isCarousel = postImages.length > 1;
            const currentImgIdx = cardCarouselIdx[slide.id] || 0;
            const currentImg = postImages[currentImgIdx] || postImages[0] || slide.image;
            const isCopyExpanded = expandedCopySlideId === slide.id;
            const isPlayingThisVideo = isVideo && playingPostId === (slide.id || `post-${postIdx}`);

            return (
              <div
                key={slide.id || `post-${postIdx}`}
                className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Card Media Preview in 4:5 format with Carousel Navigation or Inline Video */}
                <div
                  onClick={() => {
                    // For non-video slides, clicking the preview opens the slide deck
                    if (!isVideo && onSelectSlide) {
                      const targetIdx = (slides || []).findIndex(
                        (s) => s?.id === slide.id || s?.pageNumber === slide.pageNumber
                      );
                      onSelectSlide(targetIdx >= 0 ? targetIdx : (slide.pageNumber ? slide.pageNumber - 1 : postIdx));
                    }
                  }}
                  className={`relative aspect-[4/5] bg-zinc-950 overflow-hidden flex items-center justify-center select-none ${
                    !isVideo ? 'cursor-pointer' : ''
                  }`}
                >
                {isVideo ? (
                  isPlayingThisVideo ? (
                    <div
                      className="relative w-full h-full bg-black flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <video
                        key={slide.videoUrl || `vid-${slide.id}`}
                        src={slide.videoUrl || '/assets/video/sample_reel.mp4'}
                        poster={slide.posterUrl || currentImg}
                        controls
                        autoPlay
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain bg-black"
                        onEnded={() => setPlayingPostId(null)}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingPostId(null);
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs z-20 backdrop-blur-sm cursor-pointer shadow-md transition-colors"
                        title="Cerrar reproductor"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center bg-zinc-950 cursor-pointer group/vid"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingPostId(slide.id || `post-${postIdx}`);
                      }}
                      title="Reproducir video aquí en el mosaico"
                    >
                      <img
                        src={getOptimizedWixImage(slide.posterUrl || currentImg || '/assets/logo/dilo-logo-black.png', 600, 750, 80)}
                        alt={`Slide ${slide.pageNumber} video poster`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain bg-zinc-950 group-hover/vid:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 text-zinc-900 flex items-center justify-center shadow-xl group-hover/vid:scale-110 group-hover/vid:bg-orange-500 group-hover/vid:text-white transition-all duration-200">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold z-10 flex items-center gap-1 shadow-sm pointer-events-none">
                        <Play className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
                        <span>Ver video aquí</span>
                      </div>
                    </div>
                  )
                ) : (
                  <img
                    src={getOptimizedWixImage(currentImg, 600, 750, 80)}
                    alt={`Slide ${slide.pageNumber} imagen ${currentImgIdx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 pointer-events-none select-none"
                    draggable={false}
                  />
                )}

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white font-mono text-xs font-bold">
                    #{postIdx + 1}
                  </span>
                  <span className="px-2.5 py-1 bg-orange-600 text-white font-bold text-[10px] uppercase rounded-lg shadow-sm">
                    {slide.rawType || (isVideo ? 'VIDEO' : isCarousel ? 'CARRUSEL' : slide.type)}
                  </span>
                </div>

                {/* Top Right: Slide link for videos or Approved Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  {isApproved && (
                    <div className="px-2.5 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded-lg shadow flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Aprobado</span>
                    </div>
                  )}
                  {isVideo && onSelectSlide && !isPlayingThisVideo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetIdx = (slides || []).findIndex(
                          (s) => s?.id === slide.id || s?.pageNumber === slide.pageNumber
                        );
                        onSelectSlide(targetIdx >= 0 ? targetIdx : (slide.pageNumber ? slide.pageNumber - 1 : postIdx));
                      }}
                      className="px-2 py-1 bg-black/65 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-medium shadow-sm"
                      title="Abrir en diapositiva completa"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">Lámina</span>
                    </button>
                  )}
                </div>

                {/* Carousel Navigation Arrows & Indicators */}
                {isCarousel && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardCarouselIdx((prev) => {
                          const cur = prev[slide.id] || 0;
                          return {
                            ...prev,
                            [slide.id]: cur > 0 ? cur - 1 : postImages.length - 1
                          };
                        });
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md z-10 cursor-pointer"
                      title="Imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardCarouselIdx((prev) => {
                          const cur = prev[slide.id] || 0;
                          return {
                            ...prev,
                            [slide.id]: (cur + 1) % postImages.length
                          };
                        });
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md z-10 cursor-pointer"
                      title="Siguiente imagen"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Counter indicator */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-bold z-10 flex items-center gap-1 shadow-sm">
                      <Layers className="w-3 h-3 text-orange-400" />
                      <span>
                        {currentImgIdx + 1}/{postImages.length}
                      </span>
                    </div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1 z-10 pointer-events-none">
                      {postImages.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dotIdx === currentImgIdx
                              ? 'w-4 bg-orange-500 shadow-sm'
                              : 'w-1.5 bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Card Content & Expandable Copy Section (Strictly protected from copying) */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectSlide) {
                          const targetIdx = (slides || []).findIndex(
                            (s) => s?.id === slide.id || s?.pageNumber === slide.pageNumber
                          );
                          onSelectSlide(targetIdx >= 0 ? targetIdx : (slide.pageNumber ? slide.pageNumber - 1 : postIdx));
                        }
                      }}
                      className="hover:text-orange-600 transition-colors cursor-pointer font-medium text-left"
                      title="Ver lámina en diapositivas"
                    >
                      Publicación #{postIdx + 1} (Lámina {slide.pageNumber}) ↗
                    </button>
                    <span className="font-semibold text-orange-600">
                      {slide.rawType || slide.category || 'Contenido'}
                    </span>
                  </div>

                  {/* Copy Accordion */}
                  <div className="mt-1">
                    {isCopyExpanded ? (
                      <div className="space-y-3">
                        <div
                          className="text-xs text-zinc-700 leading-relaxed select-none max-h-72 overflow-y-auto pr-2 whitespace-pre-line bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/80"
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                          onCopy={(e) => e.preventDefault()}
                        >
                          {slide.copy || 'Sin copy disponible.'}
                        </div>

                        {slide.hashtags && (
                          <div
                            className="text-[11px] text-orange-600 font-mono leading-relaxed select-none bg-orange-50/60 p-2.5 rounded-xl border border-orange-200/70"
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                            onCopy={(e) => e.preventDefault()}
                          >
                            {slide.hashtags}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCopySlideId(null);
                          }}
                          className="text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 mt-1.5 cursor-pointer transition-colors"
                        >
                          <span>Ocultar copy</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p
                          className="text-xs text-zinc-600 line-clamp-2 leading-relaxed select-none"
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                          onCopy={(e) => e.preventDefault()}
                        >
                          {slide.copy || 'Sin copy disponible.'}
                        </p>

                        {slide.copy && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Setting the current slide ID automatically collapses any previously open copy!
                              setExpandedCopySlideId(slide.id);
                            }}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-2 cursor-pointer transition-colors"
                          >
                            <span>Ver copy completo</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Approve & Comments */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-2 w-full justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggle(slide.pageNumber)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Aprobado ✓' : 'Aprobar Post'}</span>
                    </button>

                    {/* Comments button on card */}
                    {(() => {
                      const slideCommentsCount = comments.filter(
                        (c) => c.slideNumber === slide.pageNumber
                      ).length;
                      return (
                        <button
                          type="button"
                          onClick={() => setActiveCommentSlide(slide)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : slideCommentsCount > 0
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                          }`}
                          title={isApproved ? 'Post aprobado - Comentarios cerrados' : 'Comentarios de este post'}
                        >
                          {isApproved ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                          )}
                          <span>{isApproved ? 'Aprobado' : 'Comentarios'}</span>
                          {slideCommentsCount > 0 && (
                            <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${isApproved ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'}`}>
                              {slideCommentsCount}
                            </span>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Slide Comments Modal */}
      {activeCommentSlide && (
        <CommentsModal
          isOpen={true}
          onClose={() => setActiveCommentSlide(null)}
          slideNumber={activeCommentSlide.pageNumber}
          slideType={activeCommentSlide.type}
          allComments={comments}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          clientTitle={clientTitle}
          isGlobalView={false}
          isSlideApproved={!!approvedPosts[activeCommentSlide.pageNumber]}
        />
      )}
    </div>
  );
}
