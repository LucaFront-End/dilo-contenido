import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, ListFilter, Eye, MessageSquare, Check } from 'lucide-react';
import CoverSlide from './slides/CoverSlide';
import VisualContentSlide from './slides/VisualContentSlide';
import StrategySlide from './slides/StrategySlide';
import PostSlide from './slides/PostSlide';
import HashtagsSlide from './slides/HashtagsSlide';
import ContactSlide from './slides/ContactSlide';
import CommentsModal from './CommentsModal';

export default function SlideDeck({
  clientData,
  onCopyToast,
  comments = [],
  onAddComment,
  onDeleteComment,
  approvedPosts = {},
  onToggleApprove
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGlobalCommentsOpen, setIsGlobalCommentsOpen] = useState(false);
  const deckRef = useRef(null);

  const slides = clientData?.slides || [];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];

  // Calculate approval percentage across all content posts (slides 4 to 28)
  const contentSlides = slides.filter((s) => s.pageNumber >= 4 && s.pageNumber <= 28);
  const totalContentPosts = contentSlides.length || 25;
  const approvedCount = contentSlides.filter((s) => !!approvedPosts[s.pageNumber]).length;
  const approvalPercent = totalContentPosts > 0 ? Math.round((approvedCount / totalContentPosts) * 100) : 0;

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsGlobalCommentsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  // Render proper slide component
  const renderSlideContent = () => {
    if (!currentSlide) return null;

    const pageNum = currentSlide.pageNumber;

    if (pageNum === 1) {
      return (
        <CoverSlide
          clientTitle={clientData.title}
          clientMonth={clientData.mes}
          clientYear={clientData.ano}
          onStart={() => goToSlide(1)}
        />
      );
    }

    if (pageNum === 2) {
      return (
        <VisualContentSlide
          clientTitle={clientData.title}
          instagram={clientData.instagram}
          clientData={clientData}
          onNavigateToSlide={(slideNum) => goToSlide(slideNum - 1)}
        />
      );
    }

    if (pageNum === 3) {
      return <StrategySlide estrategia={clientData.estrategia} />;
    }

    if (pageNum === 29) {
      return <HashtagsSlide hashtags={clientData.hashtags} onCopySuccess={onCopyToast} />;
    }

    if (pageNum === 30) {
      return <ContactSlide />;
    }

    // Standard Post slides (4 through 28)
    return (
      <PostSlide
        slide={currentSlide}
        onCopySuccess={onCopyToast}
        comments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        clientTitle={clientData?.title}
        isApproved={!!approvedPosts[currentSlide.pageNumber]}
        onToggleApprove={onToggleApprove}
      />
    );
  };

  return (
    <div className="slide-deck-wrapper flex flex-col items-center justify-start md:justify-center relative w-full min-h-screen bg-zinc-100 p-2 sm:p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto md:overflow-hidden">
      {/* 16:9 Slide Presentation Frame on desktop, adaptive touch-friendly card on mobile */}
      <div
        ref={deckRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="slide-frame-container relative w-full max-w-[1500px] h-auto md:aspect-video md:max-h-[85vh] bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border border-zinc-200/80 transition-all flex flex-col"
      >
        {renderSlideContent()}

        {/* Floating Left / Right navigation overlay arrows on hover */}
        {currentSlideIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-xl border border-zinc-200/80 transition-all opacity-0 hover:opacity-100 z-30 cursor-pointer hidden md:flex items-center justify-center"
            title="Lámina anterior (←)"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-700" />
          </button>
        )}

        {currentSlideIndex < totalSlides - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-xl border border-zinc-200/80 transition-all opacity-0 hover:opacity-100 z-30 cursor-pointer hidden md:flex items-center justify-center"
            title="Siguiente lámina (→)"
          >
            <ChevronRight className="w-6 h-6 text-zinc-700" />
          </button>
        )}
      </div>

      {/* Bottom Control Bar with Floating Rounded Container */}
      <div className="deck-control-bar mt-3 md:mt-4 flex items-center justify-between gap-2 sm:gap-4 w-full max-w-[1500px] px-3 sm:px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-lg select-none">
        {/* Left: Prev / Next Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200/80 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:pointer-events-none text-white shadow-sm shadow-orange-600/25 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Slide indicator & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-zinc-800 tracking-wide font-space">
            Lámina {currentSlideIndex + 1} de {totalSlides}
          </span>
          <span className="hidden md:inline-block text-[11px] font-bold text-zinc-500 px-2 py-0.5 bg-zinc-100 rounded-md">
            {currentSlide?.type || 'POST'}
          </span>
        </div>

        {/* Right: Approval Percentage, Comments button & Drawer toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Approval Percentage Badge */}
          <div
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
              approvalPercent === 100
                ? 'bg-emerald-500 text-white border-emerald-600'
                : approvalPercent > 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200'
            }`}
            title={`Aprobadas: ${approvedCount} de ${totalContentPosts} publicaciones`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-extrabold">{approvalPercent}% Aprobado</span>
            <span className="text-[10px] opacity-75 hidden sm:inline font-bold">
              ({approvedCount}/{totalContentPosts})
            </span>
          </div>

          {/* Global comments button */}
          <button
            onClick={() => setIsGlobalCommentsOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs cursor-pointer"
            title="Ver todos los comentarios y solicitudes de la parrilla"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Comentarios</span>
            {comments.length > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-500 text-white text-[10px] font-black rounded-full">
                {comments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isDrawerOpen
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
            }`}
            title="Ver índice de diapositivas"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Índice</span>
          </button>
        </div>
      </div>

      {/* Progress Bar along the bottom */}
      <div className="w-full max-w-[1500px] h-1.5 bg-zinc-200 rounded-full mt-2.5 overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Thumbnails Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-6 max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-space">
                  Todas las Diapositivas ({totalSlides})
                </h3>
                <p className="text-xs text-zinc-400">
                  Haz clic en cualquier lámina para saltar directamente. Las láminas aprobadas muestran ✓ y con comentarios 💬.
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Grid of 30 thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2.5 overflow-y-auto p-1 max-h-[55vh]">
              {slides.map((s, idx) => {
                const slideCommentsCount = comments.filter((c) => c.slideNumber === s.pageNumber).length;
                const isPostApproved = !!approvedPosts[s.pageNumber];
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      goToSlide(idx);
                      setIsDrawerOpen(false);
                    }}
                    className={`group relative w-full aspect-[16/9] bg-zinc-800 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                      idx === currentSlideIndex
                        ? 'border-orange-500 scale-[1.02] shadow-lg shadow-orange-500/20'
                        : isPostApproved
                        ? 'border-emerald-500/80 opacity-90'
                        : 'border-zinc-700 hover:border-zinc-500 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover block"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white font-mono">
                      #{idx + 1}
                    </span>
                    <span className="absolute top-1 right-1 px-1 py-0.2 bg-orange-600 rounded text-[8px] font-bold text-white">
                      {s.type.slice(0, 4)}
                    </span>
                    {/* Badge if approved */}
                    {isPostApproved && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[9px] font-bold shadow">
                        ✓
                      </span>
                    )}
                    {/* Badge if slide has comments */}
                    {slideCommentsCount > 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-bold flex items-center gap-0.5 shadow-md">
                        💬 {slideCommentsCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global Comments Summary Modal */}
      <CommentsModal
        isOpen={isGlobalCommentsOpen}
        onClose={() => setIsGlobalCommentsOpen(false)}
        slideNumber={null}
        slideType="General"
        allComments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        clientTitle={clientData?.title}
        isGlobalView={true}
      />
    </div>
  );
}
