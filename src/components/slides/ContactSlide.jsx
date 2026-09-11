import React from 'react';
import { ArrowUpRight, Sparkles, Globe } from 'lucide-react';
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from '../Icons';

export default function ContactSlide() {
  const contacts = [
    {
      label: '55 9244 1070',
      href: 'https://wa.me/525592441070',
      icon: WhatsAppIcon,
      sub: 'WhatsApp Oficial'
    },
    {
      label: '@dilodigitalmx',
      href: 'https://instagram.com/dilodigitalmx',
      icon: InstagramIcon,
      sub: 'Instagram'
    },
    {
      label: 'dilodigitalmx',
      href: 'https://facebook.com/dilodigitalmx',
      icon: FacebookIcon,
      sub: 'Facebook'
    },
    {
      label: 'www.dilodigitalmx.com',
      href: 'https://www.dilodigitalmx.com',
      icon: Globe,
      sub: 'Sitio Web Oficial'
    }
  ];

  return (
    <div className="slide-content contact-slide relative w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-14 overflow-hidden select-none bg-white">
      {/* Original Dilo Vector Graphics Faithful to PDF Page 30 */}

      {/* Left: Authentic Single Black Swirl / Rulo */}
      <img
        src="/assets/graphics/left-swirl.png"
        alt=""
        className="absolute -top-4 -left-2 md:top-0 md:left-0 w-24 sm:w-28 md:w-36 lg:w-44 object-contain pointer-events-none select-none z-0 opacity-80"
      />

      {/* Right Side: Authentic Pen Nib + Two Swirls (Punta de la pluma y los dos rulos) */}
      <img
        src="/assets/graphics/dilo-right-motif.png"
        alt=""
        className="absolute top-4 sm:top-8 md:top-10 -right-2 md:right-4 h-[60%] sm:h-[68%] md:h-[75%] max-h-[520px] object-contain pointer-events-none select-none hidden lg:block z-0 opacity-90"
      />

      {/* Main Center Area: Left-Structured Layout matching Slide 1 */}
      <div className="relative z-10 my-auto w-full max-w-6xl mx-auto py-2 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Branding, Big Impact Typography & Value proposition (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Official Dilo Digital Logo Lockup */}
            <div className="mb-4 sm:mb-6">
              <img
                src="/assets/logo/dilo-logo-black.png"
                alt="Dilo Digital - Agencia de Marketing Digital"
                className="h-10 sm:h-12 md:h-16 w-auto object-contain select-none"
              />
            </div>

            {/* Big Impact Titles faithful to Cover Slide 1 */}
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-zinc-950 uppercase tracking-tight font-space leading-tight">
                CANALES DE
              </h2>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-orange-500 uppercase tracking-tighter font-space leading-none">
                CONTACTO
              </h1>
            </div>

            {/* Tagline & Value Proposition */}
            <p className="text-xs sm:text-sm md:text-base text-zinc-500 max-w-lg mt-3 sm:mt-5 leading-relaxed font-medium">
              Estrategia, diseño y resultados medibles para impulsar tu marca al siguiente nivel. Estamos listos para atender cualquier duda o comenzar tu siguiente parrilla.
            </p>

            {/* Trust badge */}
            <div className="mt-4 sm:mt-6 flex items-center gap-2">
              <div className="px-3.5 py-1.5 bg-zinc-100 text-zinc-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Atención directa y personalizada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern, Clean Contact Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3.5">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-zinc-50/80 hover:bg-orange-50/80 border border-zinc-200/80 hover:border-orange-300 transition-all group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 group-hover:bg-orange-500 text-white flex items-center justify-center transition-colors shadow shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-bold block truncate">
                      {c.sub}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-zinc-900 group-hover:text-orange-600 transition-colors block truncate font-space">
                      {c.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Footer Bar identical to Cover Slide 1 */}
      <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-zinc-400 tracking-wider pt-3 sm:pt-4 border-t border-zinc-100 mt-3 md:mt-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-orange-500 font-black text-base sm:text-lg leading-none select-none">+</span>
          <span className="uppercase text-zinc-500 font-bold text-[9px] sm:text-xs">
            Agencia de Marketing Digital
          </span>
        </div>
        <div className="text-zinc-400 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">
          Dilo Digital © 2026 · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}
