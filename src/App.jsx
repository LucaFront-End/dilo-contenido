import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SlideDeck from './components/SlideDeck';
import FeedGridView from './components/FeedGridView';
import PasswordGate from './components/PasswordGate';
import HomePortal from './components/HomePortal';
import Toast from './components/Toast';
import { getParrillaBySlug, getComments, saveComment, deleteComment } from './services/wixService';
import { fallbackCuauhtliData } from './data/cuauhtliFallbackData';
import './styles/presentation.css';

export default function App() {
  // Determine slug from URL or fallback
  const getInitialSlug = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    const querySlug = searchParams.get('slug');
    if (querySlug && querySlug !== 'portal') return querySlug;
    if (path && path !== '' && path !== 'portal') return path;
    // Default demo slug: Sistemas Cuauhtli
    return 'sisitemas-cuauhtli-septiembre-2026';
  };

  const [currentSlug, setCurrentSlug] = useState(getInitialSlug);
  const [clientData, setClientData] = useState(fallbackCuauhtliData);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWixLive, setIsWixLive] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [viewMode, setViewMode] = useState('slides'); // 'slides' | 'grid'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPortalHome, setShowPortalHome] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    return path === 'portal' || searchParams.get('portal') === 'true';
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load client data from Wix Headless or fallback
  const loadGridData = async (slugToLoad) => {
    setLoading(true);
    try {
      const data = await getParrillaBySlug(slugToLoad);
      setClientData(data);
      setIsWixLive(true);

      // Load comments for this specific client slug
      const loadedComments = getComments(data.slug || slugToLoad);
      setComments(loadedComments);

      // Check session storage for existing unlocked state
      const sessionKey = `dilo_unlocked_${data.slug || slugToLoad}`;
      const savedUnlocked = sessionStorage.getItem(sessionKey);

      if (!data.contrasea || savedUnlocked === 'true') {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch (err) {
      console.warn('Usando respaldo local para la parrilla:', err);
      setClientData(fallbackCuauhtliData);
      setComments(getComments(slugToLoad));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSlug) {
      loadGridData(currentSlug);
    }
  }, [currentSlug]);

  // Handle adding comment
  const handleAddComment = async (newComment) => {
    const updated = await saveComment(clientData.slug || currentSlug, newComment);
    setComments(updated);
    showToast(`✓ Comentario subido exitosamente a la lámina #${newComment.slideNumber}! El equipo de Dilo Digital lo ha recibido.`);
  };

  // Handle deleting comment
  const handleDeleteComment = (commentId) => {
    const updated = deleteComment(clientData.slug || currentSlug, commentId);
    setComments(updated);
    showToast('Comentario eliminado.', 'info');
  };

  // Handle password unlock
  const handleUnlock = () => {
    const sessionKey = `dilo_unlocked_${clientData.slug || currentSlug}`;
    sessionStorage.setItem(sessionKey, 'true');
    setIsUnlocked(true);
    showToast(`¡Bienvenido a la parrilla de ${clientData.title}! 🎉`);
  };

  // Handle relock
  const handleRelock = () => {
    const sessionKey = `dilo_unlocked_${clientData.slug || currentSlug}`;
    sessionStorage.removeItem(sessionKey);
    setIsUnlocked(false);
    showToast('Parrilla bloqueada con éxito.', 'info');
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Share link
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Enlace de la parrilla copiado al portapapeles.');
    });
  };

  // Refresh data
  const handleRefreshWix = () => {
    showToast('Sincronizando contenido en tiempo real...', 'info');
    loadGridData(currentSlug).then(() => {
      showToast('¡Parrilla sincronizada correctamente!');
    });
  };

  // Handle choosing a client slug
  const handleSelectSlug = (slug) => {
    window.history.pushState({}, '', `/${slug}`);
    setCurrentSlug(slug);
    setShowPortalHome(false);
  };

  if (showPortalHome) {
    return (
      <HomePortal
        onSelectSlug={handleSelectSlug}
        defaultSlug={currentSlug}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 relative flex items-center justify-center">
          <div className="w-full h-full rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <img
            src="/assets/logo/dilo-logo-orange.png"
            alt="Dilo Digital"
            className="w-7 h-7 object-contain absolute"
          />
        </div>
        <p className="mt-4 text-sm font-semibold tracking-wide text-zinc-400">
          Cargando parrilla de contenido...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 font-sans">
      {/* Top Header */}
      <Header
        clientTitle={clientData.title}
        clientMonth={clientData.mes}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRelock={clientData.contrasea ? handleRelock : null}
        onShare={handleShare}
        isWixLive={isWixLive}
        onRefreshWix={handleRefreshWix}
        onOpenPortal={() => setShowPortalHome(true)}
      />

      {/* Password Gate Overlay if locked */}
      {!isUnlocked && clientData.contrasea && (
        <PasswordGate
          clientTitle={clientData.title}
          clientMonth={`${clientData.mes} ${clientData.ano || 2026}`}
          correctPassword={clientData.contrasea}
          onUnlock={handleUnlock}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative">
        {viewMode === 'slides' ? (
          <SlideDeck
            clientData={clientData}
            onCopyToast={showToast}
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        ) : (
          <FeedGridView
            slides={clientData.slides}
            clientTitle={clientData.title}
            onCopyToast={showToast}
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onSelectSlide={(slideIdx) => {
              setViewMode('slides');
            }}
          />
        )}
      </main>

      {/* Floating Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
