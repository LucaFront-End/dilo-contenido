import React from 'react';
import { ExternalLink, Grid, ShieldCheck, Phone, Check, Bell, Key, Zap, Camera, Compass } from 'lucide-react';
import { InstagramIcon } from '../Icons';

export default function VisualContentSlide({ clientTitle, instagram, clientData, onNavigateToSlide }) {
  // 9 visual items for the feed grid (from PDF page 2)
  const feedItems = [
    {
      id: 1,
      title: '¿Alarma o CÁMARAS PRIMERO?',
      targetSlide: 4,
      image: '/assets/posts/p04_img05.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 2,
      title: 'Logística y Unidades Cuauhtli',
      targetSlide: 19,
      image: '/assets/posts/p19_img05.jpeg',
      badge: 'POST'
    },
    {
      id: 3,
      title: 'Instalar una cámara no es lo MISMO',
      targetSlide: 14,
      image: '/assets/posts/p14_img06.jpeg',
      badge: 'POST'
    },
    {
      id: 4,
      title: 'Seguridad PERIMETRAL',
      targetSlide: 6,
      image: '/assets/posts/p06_img05.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 5,
      title: 'Mantenimiento e Infraestructura',
      targetSlide: 21,
      image: '/assets/posts/p21_img05.jpeg',
      badge: 'POST'
    },
    {
      id: 6,
      title: 'Control de Acceso Empresarial',
      targetSlide: 18,
      image: '/assets/posts/p18_img05.jpeg',
      badge: 'POST'
    },
    {
      id: 7,
      title: 'Cableado estructurado: La base invisible',
      targetSlide: 12,
      image: '/assets/posts/p12_img05.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 8,
      title: 'Procesos de Instalación en Sitio',
      targetSlide: 23,
      image: '/assets/posts/p23_img05.jpeg',
      badge: 'POST'
    },
    {
      id: 9,
      title: 'Tener el número de policía no es suficiente',
      targetSlide: 15,
      image: '/assets/posts/p15_img05.jpeg',
      badge: 'POST'
    }
  ];

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
    'wa.link/hpxqqv';

  return (
    <div className="slide-content visual-content-slide flex w-full h-full relative overflow-hidden bg-white">
      {/* Black Left Rounded Category Pill faithful to PDF */}
      <div className="pdf-side-pill shrink-0">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          CONTENIDO VISUAL
        </span>
      </div>

      {/* Authentic Dilo Graphics on Right (Desktop only) */}
      <img
        src="/assets/graphics/dilo-right-motif.png"
        alt=""
        className="absolute top-8 md:top-12 -right-2 md:right-4 h-[65%] sm:h-[72%] md:h-[78%] max-h-[560px] object-contain pointer-events-none select-none hidden lg:block z-0 opacity-80"
      />

      {/* Slide Inner Body */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-around gap-3 md:gap-6 p-2 sm:p-4 md:py-2.5 md:px-6 overflow-y-auto lg:overflow-hidden max-w-6xl mx-auto w-full scrollbar-none">
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
              9 Diseños · 4:5
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
                  {instagram?.postsCount || 336} posts · {instagram?.followersCount || 92} seguidores
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              Parrilla Activa
            </span>
          </div>

          {/* 3x3 Grid with 4:5 Instagram vertical format */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1 text-white">
                  <span className="text-[8px] uppercase font-bold text-orange-400">
                    Slide #{item.targetSlide}
                  </span>
                  <span className="text-[9px] font-semibold line-clamp-2 leading-tight">
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <span className="absolute top-1 right-1 px-1 py-0.2 bg-black/75 backdrop-blur-sm text-white text-[7px] font-bold rounded">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-orange-600/90 text-white text-[7px] font-bold rounded">
                  #{item.targetSlide}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Realistic Instagram Smartphone Mockup */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center shrink-0">
          <div className="smartphone-mockup shadow-xl scale-[0.96] xl:scale-100 origin-center">
            {/* Dynamic Island / Speaker */}
            <div className="mockup-island" />

            {/* Mockup Screen Content */}
            <div className="mockup-screen flex flex-col h-full bg-white text-zinc-900 select-none overflow-y-auto">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-zinc-700">
                <span>6:37</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Instagram App Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100">
                <span className="text-base font-bold tracking-tight">
                  {brandUsername}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold">•••</span>
                </div>
              </div>

              {/* Profile Header with dynamic logo */}
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
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

                <div className="flex-1 flex justify-around text-center">
                  <div>
                    <span className="block font-bold text-sm text-zinc-900">
                      {instagram?.postsCount || 336}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">publicaciones</span>
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-zinc-900">
                      {instagram?.followersCount || 92}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">seguidores</span>
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-zinc-900">
                      {instagram?.followingCount || 65}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">seguidos</span>
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="px-4 pb-3 text-left">
                <p className="font-bold text-xs text-zinc-900">
                  {brandDisplayName}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Ciencia, tecnología e ingeniería</p>
                <div className="text-[11px] text-zinc-700 leading-snug mt-1 whitespace-pre-line">
                  {brandBio}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                  <span>Cotiza Ahora 👇</span>
                  <a
                    href={brandLink.startsWith('http') ? brandLink : `https://${brandLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {brandLink.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 flex gap-1.5 pb-3">
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

              {/* Story Highlights */}
              <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto border-b border-zinc-100 no-scrollbar">
                {(instagram?.highlights || [
                  { title: 'ALARMAS', icon: 'bell' },
                  { title: 'ACCESOS', icon: 'key' },
                  { title: 'CERCA ELÉ...', icon: 'zap' },
                  { title: 'CCTV', icon: 'camera' }
                ]).map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-12 h-12 rounded-full border border-zinc-300 p-0.5 flex items-center justify-center bg-zinc-50">
                      <div className="w-full h-full rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {h.title.slice(0, 3)}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-medium truncate max-w-[50px]">
                      {h.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feed Grid Inside Phone (4:5 Format) */}
              <div className="grid grid-cols-3 gap-0.5 p-1 bg-zinc-100 flex-1">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigateToSlide && onNavigateToSlide(item.targetSlide)}
                    className="aspect-[4/5] bg-zinc-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = `/assets/slides/slide_${String(item.targetSlide).padStart(2, '0')}.png`;
                      }}
                    />
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
