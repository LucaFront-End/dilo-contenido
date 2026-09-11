import React, { useState } from 'react';
import { Check, Filter, Layers, ExternalLink, ThumbsUp, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import CommentsModal from './CommentsModal';

export default function FeedGridView({
  slides,
  clientTitle,
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

  // Filter posts (ignore cover, strategy, hashtags, contact for feed view or display them optionally)
  const contentSlides = slides.filter((s) => s.pageNumber >= 4 && s.pageNumber <= 28);
  const totalContentPosts = contentSlides.length || 25;
  const approvedCount = contentSlides.filter((s) => !!approvedPosts[s.pageNumber]).length;
  const approvalPercent = totalContentPosts > 0 ? Math.round((approvedCount / totalContentPosts) * 100) : 0;

  const filtered = contentSlides.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.type === activeFilter;
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
    <div className="feed-grid-view w-full max-w-7xl mx-auto p-4 md:p-8 select-none">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-zinc-900 font-space tracking-tight">
              Mosaico de Publicaciones
            </h2>
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                approvalPercent === 100
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : approvalPercent > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200'
              }`}
            >
              ✓ {approvalPercent}% Aprobado ({approvedCount}/{totalContentPosts})
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Vista general de todas las publicaciones programadas en formato 4:5 para {clientTitle}.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Todos ({contentSlides.length})
          </button>
          <button
            onClick={() => setActiveFilter('POST DE VALOR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'POST DE VALOR'
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Posts de Valor
          </button>
          <button
            onClick={() => setActiveFilter('POST')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'POST'
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Posts Simples
          </button>
        </div>
      </div>

      {/* Grid of Posts in 4:5 Instagram proportion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((slide) => {
          const isApproved = !!approvedPosts[slide.pageNumber];
          const isVideo = slide.isVideo || slide.videoUrl || slide.type?.toUpperCase().includes('VIDEO') || slide.pageNumber === 5;
          return (
            <div
              key={slide.id}
              className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Media Preview in 4:5 format */}
              <div
                onClick={() => onSelectSlide && onSelectSlide(slide.pageNumber - 1)}
                className="relative aspect-[4/5] bg-zinc-100 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                <img
                  src={slide.image}
                  alt={`Slide ${slide.pageNumber}`}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white font-mono text-xs font-bold">
                    #{slide.pageNumber}
                  </span>
                  <span className="px-2.5 py-1 bg-orange-600 text-white font-bold text-[10px] uppercase rounded-lg">
                    {isVideo ? 'VIDEO' : slide.type}
                  </span>
                </div>

                {isApproved && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded-lg shadow flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Aprobado</span>
                  </div>
                )}
              </div>

              {/* Card Content & Details (Protected from copying) */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Publicación #{slide.pageNumber}</span>
                    <span className="font-semibold text-orange-600">{slide.category || 'Contenido'}</span>
                  </div>

                  <p
                    className="text-xs text-zinc-700 line-clamp-3 leading-relaxed select-none"
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    onCopy={(e) => e.preventDefault()}
                  >
                    {slide.copy || 'Sin copy disponible.'}
                  </p>

                  {slide.hashtags && (
                    <p className="text-[11px] text-orange-600 font-mono line-clamp-1 mt-2 select-none">
                      {slide.hashtags}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 w-full justify-between">
                    <button
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
                      const slideCommentsCount = comments.filter((c) => c.slideNumber === slide.pageNumber).length;
                      return (
                        <button
                          onClick={() => setActiveCommentSlide(slide)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
                            slideCommentsCount > 0
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                          }`}
                          title="Comentarios de este post"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                          <span>Comentarios</span>
                          {slideCommentsCount > 0 && (
                            <span className="px-1.5 py-0.2 bg-orange-500 text-white text-[10px] font-black rounded-full">
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
        />
      )}
    </div>
  );
}
