import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SlideDeck from './components/SlideDeck';
import FeedGridView from './components/FeedGridView';
import PasswordGate from './components/PasswordGate';
import HomePortal from './components/HomePortal';
import Toast from './components/Toast';
import { getParrillaBySlug, getComments, saveComment, deleteComment, getApprovals, saveApprovals } from './services/wixService';
import { fallbackCuauhtliData } from './data/cuauhtliFallbackData';
import './styles/presentation.css';

// Determine slug from URL or fallback
const extractSlugFromPath = () => {
  let path = window.location.pathname.replace(/^\/|\/$/g, '');
  
  // Handle /parrillas/:slug format
  if (path.startsWith('parrillas/')) {
    path = path.replace(/^parrillas\//, '');
  } else if (path === 'parrillas') {
    path = '';
  }

  const searchParams = new URLSearchParams(window.location.search);
  const querySlug = searchParams.get('slug');
  if (querySlug && querySlug !== 'portal') return querySlug;
  if (path && path !== '' && path !== 'portal') return path;
  
  // Default demo slug: Sistemas Cuauhtli
  return 'sisitemas-cuauhtli-septiembre-2026';
};

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(extractSlugFromPath);
  const [clientData, setClientData] = useState(fallbackCuauhtliData);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWixLive, setIsWixLive] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [viewMode, setViewMode] = useState('slides'); // 'slides' | 'grid'
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);
  const [brandFilter, setBrandFilter] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryBrand = searchParams.get('brand');
    if (queryBrand) return decodeURIComponent(queryBrand);
    return sessionStorage.getItem('dilo_active_brand') || null;
  });
  
  // Independent post approvals stored per client slug in localStorage
  const [approvedPosts, setApprovedPosts] = useState(() => {
    try {
      const slug = extractSlugFromPath();
      return getApprovals(slug);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (currentSlug) {
      setApprovedPosts(getApprovals(currentSlug));
    }
  }, [currentSlug]);

  const handleToggleApprove = async (slideNumber) => {
    const nextVal = !approvedPosts[slideNumber];
    const updated = { ...approvedPosts, [slideNumber]: nextVal };
    setApprovedPosts(updated);

    showToast(
      nextVal
        ? `Lámina #${slideNumber} aprobada por el cliente 🎉`
        : `Lámina #${slideNumber} marcada como pendiente`,
      'info'
    );

    // Guardar y sincronizar con Wix CMS
    await saveApprovals(clientData?.slug || currentSlug, updated, clientData?.title, clientData?.slides);
  };
  const [showPortalHome, setShowPortalHome] = useState(() => {
    let path = window.location.pathname.replace(/^\/|\/$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    return path === 'portal' || path === 'parrillas/portal' || searchParams.get('portal') === 'true';
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync browser URL bar to /parrillas/:slug when loading a grid
  const syncBrowserUrl = (slug) => {
    if (!slug) return;
    const targetPath = `/parrillas/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({}, '', targetPath);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      let path = window.location.pathname.replace(/^\/|\/$/g, '');
      const searchParams = new URLSearchParams(window.location.search);
      const queryBrand = searchParams.get('brand');
      if (queryBrand) {
        setBrandFilter(decodeURIComponent(queryBrand));
      }
      if (path === 'portal' || path === 'parrillas/portal') {
        setShowPortalHome(true);
      } else {
        if (path.startsWith('parrillas/')) {
          path = path.replace(/^parrillas\//, '');
        }
        if (path && path !== '') {
          setCurrentSlug(path);
          setShowPortalHome(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load client data from Wix Headless or fallback
  const loadGridData = async (slugToLoad) => {
    setLoading(true);
    try {
      const data = await getParrillaBySlug(slugToLoad);
      setClientData(data);
      if (data?.title) {
        sessionStorage.setItem('dilo_active_brand', data.title);
      }
      setIsWixLive(true);

      // Keep browser address bar clean at /parrillas/:slug
      if (!showPortalHome) {
        syncBrowserUrl(data.slug || slugToLoad);
      }

      // Load comments for this specific client slug (merging Wix CMS + local)
      const localComments = getComments(data.slug || slugToLoad);
      const wixComments = data.initialComments || [];
      const commentMap = new Map();
      wixComments.forEach(c => commentMap.set(c.id || `${c.slideNumber}_${c.text}`, c));
      localComments.forEach(c => commentMap.set(c.id || `${c.slideNumber}_${c.text}`, c));
      setComments(Array.from(commentMap.values()));

      // Load approvals for this specific client slug (merging Wix CMS + local)
      const localApprovals = getApprovals(data.slug || slugToLoad);
      const mergedApprovals = { ...(data.initialApprovals || {}), ...localApprovals };
      setApprovedPosts(mergedApprovals);

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
      if (!showPortalHome) {
        syncBrowserUrl(fallbackCuauhtliData.slug || slugToLoad);
      }
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
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? window.location.origin : 'https://www.dilodigitalmx.com.mx';
    const slug = clientData.slug || currentSlug;
    const canonicalUrl = `${baseUrl}/parrillas/${slug}`;
    navigator.clipboard.writeText(canonicalUrl).then(() => {
      showToast(`Enlace copiado: ${canonicalUrl}`);
    });
  };

  // Refresh data
  const handleRefreshWix = () => {
    showToast('Sincronizando contenido en tiempo real...', 'info');
    loadGridData(currentSlug).then(() => {
      showToast('¡Parrilla sincronizada correctamente!');
    });
  };

  // Handle choosing a client slug with optional password requirement
  const handleSelectSlug = (slug, requirePassword = false) => {
    let cleanSlug = slug;
    if (cleanSlug.includes('/parrillas/')) {
      cleanSlug = cleanSlug.split('/parrillas/')[1];
    }
    cleanSlug = cleanSlug.replace(/^\/|\/$/g, '');

    if (requirePassword) {
      sessionStorage.removeItem(`dilo_unlocked_${cleanSlug}`);
      setIsUnlocked(false);
    }

    window.history.pushState({}, '', `/parrillas/${cleanSlug}`);
    setCurrentSlug(cleanSlug);
    setShowPortalHome(false);
  };

  if (showPortalHome) {
    const activeBrand = brandFilter || clientData?.title || sessionStorage.getItem('dilo_active_brand') || 'Sistemas Cuauhtli';
    return (
      <HomePortal
        onSelectSlug={handleSelectSlug}
        defaultSlug={currentSlug}
        brandFilter={activeBrand}
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
        onOpenPortal={() => {
          const brand = clientData?.title || sessionStorage.getItem('dilo_active_brand') || null;
          setBrandFilter(brand);
          const targetUrl = brand ? `/parrillas/portal?brand=${encodeURIComponent(brand)}` : '/parrillas/portal';
          window.history.pushState({}, '', targetUrl);
          setShowPortalHome(true);
        }}
        onOpenBrandPortal={() => {
          const brand = clientData?.title || sessionStorage.getItem('dilo_active_brand') || null;
          setBrandFilter(brand);
          const targetUrl = brand ? `/parrillas/portal?brand=${encodeURIComponent(brand)}` : '/parrillas/portal';
          window.history.pushState({}, '', targetUrl);
          setShowPortalHome(true);
        }}
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
            approvedPosts={approvedPosts}
            onToggleApprove={handleToggleApprove}
            initialSlideIndex={activeSlideIndex}
          />
        ) : (
          <FeedGridView
            slides={clientData.slides}
            clientTitle={clientData.title}
            onCopyToast={showToast}
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            approvedPosts={approvedPosts}
            onToggleApprove={handleToggleApprove}
            onSelectSlide={(slideIdx) => {
              setActiveSlideIndex(slideIdx);
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
