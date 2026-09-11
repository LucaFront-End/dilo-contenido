import React, { useMemo } from 'react';
import { ExternalLink, Grid, ShieldCheck, Phone, Check, Bell, Key, Zap, Camera, Compass } from 'lucide-react';
import { InstagramIcon } from '../Icons';

export default function VisualContentSlide({ clientTitle, instagram, clientData, onNavigateToSlide }) {
  // Extract real content post slides dynamically from Wix CMS in exact order
  const contentSlides = useMemo(() => {
    const slides = (clientData?.slides || []).filter(
      (s) =>
        s.wixPostId ||
        (!['COVER', 'FEED', 'ESTRATEGIA', 'CALENDARIO', 'HASTAGS', 'HASHTAGS', 'CONTACT', 'CONTACTO'].includes(
          (s.type || '').toUpperCase()
        ) && s.pageNumber >= 4)
    );

    // Sort strictly by Wix orden if present, then slide pageNumber
    return [...slides].sort((a, b) => {
      const ordA = a.orden != null && a.orden !== '' && !isNaN(Number(a.orden)) ? Number(a.orden) : null;
      const ordB = b.orden != null && b.orden !== '' && !isNaN(Number(b.orden)) ? Number(b.orden) : null;
      if (ordA !== null && ordB !== null) return ordA - ordB;
      if (ordA !== null) return -1;
      if (ordB !== null) return 1;
      return (a.pageNumber || 0) - (b.pageNumber || 0);
    });
  }, [clientData?.slides]);

  // Take up to 9 dynamic items for the feed grid in strict numerical order
  const feedItems = useMemo(() => {
    return contentSlides.slice(0, 9).map((post, idx) => {
      const img =
        post.posterUrl ||
        post.images?.[0] ||
        post.postImages?.[0] ||
        '/assets/logo/dilo-logo-black.png';
      const badge =
        post.rawType ||
        (post.isVideo ? 'VIDEO' : (post.images?.length > 1 ? 'CARRUSEL' : 'POST'));
      const cleanTitle = (post.title || `Publicación #${idx + 1}`).trim();
      return {
        id: post.id || `feed-item-${idx}`,
        targetSlide: post.pageNumber || idx + 4,
        title: cleanTitle,
        image: img,
        badge: badge.toUpperCase(),
        isVideo: post.isVideo
      };
    });
  }, [contentSlides]);

  // Dynamic avatar / logo from Wix CMS with clean fallback
  const brandAvatarUrl =
    instagram?.logo ||
    instagram?.avatar ||
    clientData?.logo ||
    '/assets/logo/cuauhtli-logo.png';

  const brandUsername =
    instagram?.username ||
    clientData?.instagramUser ||
    clientData?.usuarioInstagram ||
    'sistemascuauhtli';

  const brandDisplayName =
    instagram?.displayName ||
    clientData?.tituloTelefono ||
    clientData?.title ||
    'Sistemas Cuauhtli | Instalación de CCTV Y ALARMAS';

  const brandBio =
    instagram?.bio ||
    clientData?.bioTelefono ||
    'Ciencia, tecnología e ingeniería\nSistemas de seguridad para empresas: #CCTV, #Alarmas, #ControldeAcceso y #Cercaselectricas\nServicio en #CDMX y #EDOMEX';

  const brandLink =
    instagram?.link ||
    clientData?.enlaceTelefono ||
    'www.cuauhtli.mx';

  return (
    <div className="slide-content visual-content-slide flex w-full h-full relative overflow-hidden bg-white">
      {/* Black Left Rounded Category Pill faithful to PDF */}
      <div className="pdf-side-pill shrink-0">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          CONTENIDO VISUAL
        </span>
      </div>

      {/* Subtle Dilo graphic watermark behind right frame */}
      <img
        src="/assets/graphics/dilo-right-motif.png"
        alt=""
        className="absolute top-6 md:top-10 -right-20 md:-right-12 h-[75%] max-h-[540px] object-contain pointer-events-none select-none hidden lg:block z-0 opacity-15"
      />

      {/* Slide Inner Body */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-around gap-3 md:gap-6 p-2 sm:p-4 md:py-2.5 md:px-6 overflow-y-auto lg:overflow-hidden max-w-6xl mx-auto w-full scrollbar-none relative z-10">
        {/* Left Side: 3x3 High-Res Grid in 4:5 Instagram proportion (Centered & uncropped) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-[360px] sm:max-w-[400px] lg:max-w-[390px] xl:max-w-[420px]">
          <div className="mb-2 sm:mb-2.5 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-zinc-900 font-space tracking-tight">
                Vista de Feed Instagram
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-medium">
                Parrilla mensual de publicaciones interconectadas en formato 4:5.
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full shrink-0">
              {feedItems.length} Diseños · 4:5
            </span>
          </div>

          {/* Instagram mini-profile banner for mobile */}
          <div className="flex lg:hidden items-center justify-between p-2.5 mb-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[1.5px] shrink-0">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden">
                  <img
                    src={brandAvatarUrl}
                    alt={brandDisplayName}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.target.src = '/assets/logo/cuauhtli-logo.png';
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="font-bold text-zinc-900 block leading-tight">
                  @{brandUsername}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {contentSlides.length || instagram?.postsCount || 17} posts · {instagram?.followersCount || '1.250'} seguidores
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              Parrilla Activa
            </span>
          </div>

          {/* 3x3 Grid with 4:5 Instagram vertical format (100% Dynamic from Wix CMS) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-zinc-100 p-1.5 sm:p-2.5 rounded-2xl border border-zinc-200 shadow-inner">
            {feedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToSlide && onNavigateToSlide(item.targetSlide)}
                className="group relative aspect-[4/5] bg-zinc-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 border border-zinc-300/60 flex items-center justify-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `/assets/slides/slide_${String(item.targetSlide).padStart(2, '0')}.png`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5 text-white">
                  <span className="text-[8px] uppercase font-bold text-orange-400">
                    Slide #{item.targetSlide}
                  </span>
                  <span className="text-[9px] font-semibold line-clamp-2 leading-tight">
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-white text-[7.5px] font-bold rounded shadow-xs">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-orange-600/90 text-white text-[7.5px] font-bold rounded shadow-xs">
                  #{item.targetSlide}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Realistic Instagram Smartphone Mockup */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center shrink-0 relative z-10">
          <div className="smartphone-mockup shadow-2xl scale-[0.96] xl:scale-100 origin-center">
            {/* Dynamic Island / Speaker */}
            <div className="mockup-island" />

            {/* Mockup Screen Content (Zero scroll, completely framed) */}
            <div className="mockup-screen flex flex-col h-full bg-white text-zinc-900 select-none overflow-hidden">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-zinc-700 shrink-0">
                <span>6:37</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Instagram App Top Bar */}
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-100 shrink-0">
                <span className="text-sm font-bold tracking-tight">
                  {brandUsername}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold text-xs">•••</span>
                </div>
              </div>

              {/* Profile Header with dynamic logo & cleanly separated stats */}
              <div className="px-4 py-2 flex items-center justify-between gap-3 shrink-0">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0 shadow-sm">
                    <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center overflow-hidden">
                      <img
                        src={brandAvatarUrl}
                        alt={brandDisplayName}
                        className="w-full h-full object-contain rounded-full p-0.5"
                        onError={(e) => {
                          e.target.src = '/assets/logo/cuauhtli-logo.png';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-1 text-center min-w-0">
                  <div className="flex flex-col items-center justify-center min-w-0">
                    <span className="block font-black text-xs sm:text-sm text-zinc-900 leading-none">
                      {contentSlides.length || instagram?.postsCount || 17}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium leading-none mt-1 whitespace-nowrap">
                      posts
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0">
                    <span className="block font-black text-xs sm:text-sm text-zinc-900 leading-none">
                      {instagram?.followersCount || '1.250'}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium leading-none mt-1 whitespace-nowrap">
                      seguidores
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0">
                    <span className="block font-black text-xs sm:text-sm text-zinc-900 leading-none">
                      {instagram?.followingCount || 340}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium leading-none mt-1 whitespace-nowrap">
                      seguidos
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="px-4 pb-2 text-left shrink-0">
                <p className="font-bold text-xs text-zinc-900 leading-tight">
                  {brandDisplayName}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Ciencia, tecnología e ingeniería</p>
                <div className="text-[10.5px] text-zinc-700 leading-snug mt-1 whitespace-pre-line line-clamp-3">
                  {brandBio}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px] text-blue-600 font-medium">
                  <span>Cotiza Ahora 👇</span>
                  <a
                    href={brandLink.startsWith('http') ? brandLink : `https://${brandLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline truncate"
                  >
                    {brandLink.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 flex gap-1.5 pb-2 shrink-0">
                <button className="flex-1 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-sm">
                  Seguir
                </button>
                <button className="flex-1 py-1.5 bg-zinc-100 text-zinc-900 font-semibold text-xs rounded-lg border border-zinc-200">
                  Mensaje
                </button>
                <button className="flex-1 py-1.5 bg-zinc-100 text-zinc-900 font-semibold text-xs rounded-lg border border-zinc-200">
                  Contacto
                </button>
              </div>

              {/* Feed Grid Inside Phone (6 posts = 2 rows of 3, Zero scroll) */}
              <div className="grid grid-cols-3 gap-0.5 p-1 bg-zinc-100 overflow-hidden shrink-0 mt-0.5">
                {feedItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigateToSlide && onNavigateToSlide(item.targetSlide)}
                    className="aspect-square bg-zinc-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center relative group"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = `/assets/slides/slide_${String(item.targetSlide).padStart(2, '0')}.png`;
                      }}
                    />
                    {item.isVideo && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[7px] font-bold rounded">
                        ▶
                      </span>
                    )}
                    {item.badge === 'CARRUSEL' && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[7px] font-bold rounded">
                        ❐
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
