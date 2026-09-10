import React from 'react';
import { ExternalLink, Grid, ShieldCheck, Phone, Check, Bell, Key, Zap, Camera, Compass } from 'lucide-react';
import { InstagramIcon } from '../Icons';

export default function VisualContentSlide({ clientTitle, instagram, onNavigateToSlide }) {
  // 9 visual items for the feed grid (from PDF page 2)
  const feedItems = [
    {
      id: 1,
      title: '¿Alarma o CÁMARAS PRIMERO?',
      targetSlide: 4,
      image: '/assets/posts/p04_img01.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 2,
      title: 'Logística y Unidades Cuauhtli',
      targetSlide: 19,
      image: '/assets/posts/p19_img01.jpeg',
      badge: 'POST'
    },
    {
      id: 3,
      title: 'Instalar una cámara no es lo MISMO',
      targetSlide: 14,
      image: '/assets/posts/p14_img01.jpeg',
      badge: 'POST'
    },
    {
      id: 4,
      title: 'Seguridad PERIMETRAL',
      targetSlide: 6,
      image: '/assets/posts/p06_img01.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 5,
      title: 'Mantenimiento e Infraestructura',
      targetSlide: 21,
      image: '/assets/posts/p21_img01.jpeg',
      badge: 'POST'
    },
    {
      id: 6,
      title: 'Control de Acceso Empresarial',
      targetSlide: 18,
      image: '/assets/posts/p18_img01.jpeg',
      badge: 'POST'
    },
    {
      id: 7,
      title: 'Cableado estructurado: La base invisible',
      targetSlide: 12,
      image: '/assets/posts/p12_img01.jpeg',
      badge: 'CARRUSEL'
    },
    {
      id: 8,
      title: 'Procesos de Instalación en Sitio',
      targetSlide: 23,
      image: '/assets/posts/p23_img01.jpeg',
      badge: 'POST'
    },
    {
      id: 9,
      title: 'Tener el número de policía no es suficiente',
      targetSlide: 15,
      image: '/assets/posts/p15_img01.jpeg',
      badge: 'POST'
    }
  ];

  return (
    <div className="slide-content visual-content-slide flex w-full h-full relative overflow-hidden bg-white">
      {/* Black Left Rounded Category Pill faithful to PDF */}
      <div className="pdf-side-pill shrink-0">
        <span className="pdf-side-pill-text tracking-widest font-black uppercase text-xl md:text-2xl font-space">
          CONTENIDO VISUAL
        </span>
      </div>

      {/* Decorative Vectors on Right */}
      <div className="decor-arch absolute top-20 right-4 pointer-events-none opacity-80">
        <svg width="100" height="180" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="10" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="5" fill="#18181b" />
          <circle cx="70" cy="210" r="5" fill="#FF5A00" />
        </svg>
      </div>

      {/* Slide Inner Body */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Left Side: 3x3 High-Res Grid */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 font-space tracking-tight">
                Vista de Feed Instagram
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Parrilla mensual de publicaciones interconectadas. Haz clic en cualquiera para ver su detalle.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
              9 Diseños Clave
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3 bg-zinc-100 p-3 rounded-2xl border border-zinc-200 shadow-inner">
            {feedItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNavigateToSlide && onNavigateToSlide(item.targetSlide)}
                className="group relative aspect-square bg-zinc-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 border border-zinc-300/60"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to slide image if post image isn't loaded
                    e.target.src = `/assets/slides/slide_${String(item.targetSlide).padStart(2, '0')}.png`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                  <span className="text-[10px] uppercase font-bold text-orange-400">
                    Slide #{item.targetSlide}
                  </span>
                  <span className="text-xs font-semibold line-clamp-2 leading-tight">
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Realistic Instagram Smartphone Mockup faithful to PDF Page 2 */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="smartphone-mockup shadow-2xl">
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
                  {instagram?.username || 'sistemascuauhtli'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold">•••</span>
                </div>
              </div>

              {/* Profile Header */}
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center overflow-hidden">
                      <img
                        src="/assets/posts/p04_img01.jpeg"
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.src = '/favicon.svg';
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
                  {instagram?.displayName || 'Sistemas Cuauhtli | Instalación de CCTV Y ALARMAS'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Ciencia, tecnología e ingeniería</p>
                <p className="text-[11px] text-zinc-700 leading-snug mt-1">
                  Sistemas de seguridad para empresas: <span className="text-blue-600">#CCTV</span>, <span className="text-blue-600">#Alarmas</span>, <span className="text-blue-600">#ControldeAcceso</span> y <span className="text-blue-600">#Cercaselectricas</span>
                </p>
                <p className="text-[11px] text-zinc-700">Servicio en <span className="text-blue-600">#CDMX</span> y <span className="text-blue-600">#EDOMEX</span></p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                  <span>Cotiza Ahora 👇</span>
                  <a href="https://wa.link/hpxqqv" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    wa.link/hpxqqv
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

              {/* Feed Grid Inside Phone */}
              <div className="grid grid-cols-3 gap-0.5 p-1 bg-zinc-100 flex-1">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigateToSlide && onNavigateToSlide(item.targetSlide)}
                    className="aspect-square bg-zinc-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
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
