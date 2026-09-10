import React from 'react';
import { Phone, Globe, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon, DiloMegaphoneIcon } from '../Icons';

export default function ContactSlide() {
  const contacts = [
    {
      label: '55 9244 1070',
      href: 'https://wa.me/525592441070',
      icon: WhatsAppIcon,
      sub: 'WhatsApp Oficial'
    },
    {
      label: 'dilodigitalmx',
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
      sub: 'Sitio Web'
    }
  ];

  return (
    <div className="slide-content contact-slide flex flex-col justify-between w-full h-full relative overflow-hidden bg-white p-4 sm:p-8 md:p-14 select-none">
      {/* Decorative Vectors Faithful to PDF */}
      <div className="decor-curves absolute -top-10 -left-10 w-28 h-28 md:w-48 md:h-48 pointer-events-none opacity-30 md:opacity-90">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-zinc-900">
          <path d="M20 50 C40 10 90 20 70 80 C50 140 10 100 30 150 C50 200 120 180 140 140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="decor-pen-tool absolute top-12 right-16 pointer-events-none hidden lg:block">
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="4" fill="#FF5A00" />
          <path d="M20 70 C40 30 70 30 85 50" stroke="#111" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M60 25 L75 40 L50 65 L35 50 Z" fill="#fff" stroke="#111" strokeWidth="2.5" />
          <path d="M35 50 L30 68 L48 63 Z" fill="#111" />
          <rect x="80" y="20" width="10" height="10" fill="#FF5A00" />
        </svg>
      </div>

      <div className="decor-arch absolute top-32 right-8 pointer-events-none hidden lg:block">
        <svg width="120" height="220" viewBox="0 0 120 220" fill="none">
          <path d="M100 180 V80 C100 30 20 30 20 80 V180" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <rect x="40" y="90" width="25" height="25" stroke="#18181b" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="190" r="6" fill="#18181b" />
          <circle cx="70" cy="210" r="6" fill="#FF5A00" />
        </svg>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col justify-start md:justify-center relative z-10 max-w-4xl mx-auto w-full overflow-y-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/assets/logo/dilo-logo-orange.png"
                alt="Dilo Digital"
                className="w-20 h-20 object-contain drop-shadow-sm select-none"
              />
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 block">
                  Agencia de Crecimiento
                </span>
                <span className="text-3xl font-black text-zinc-950 tracking-tight block leading-none font-space mt-1">
                  DILO <span className="text-orange-500">DIGITAL</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm pt-2">
              Estrategia, diseño y resultados medibles para impulsar tu marca al siguiente nivel.
            </p>
          </div>

          {/* Contact Details faithful to PDF Page 30 */}
          <div className="space-y-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-50 hover:bg-orange-50 border border-zinc-200/80 hover:border-orange-300 transition-all group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 group-hover:bg-orange-500 text-white flex items-center justify-center transition-colors shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                      {c.sub}
                    </span>
                    <span className="text-base font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {c.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Big Bottom Typography: CONTACTO */}
        <div className="mt-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-zinc-950 uppercase tracking-tighter font-space leading-none">
            CONTACTO
          </h1>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <span>Dilo Digital © 2026 · Todos los derechos reservados</span>
        <span>Hecho con precisión para nuestros clientes</span>
      </div>
    </div>
  );
}
