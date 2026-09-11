import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function CalendarSlide({
  slide,
  clientData,
  approvedPosts = {},
  onSelectSlide
}) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const allSlides = clientData?.slides || [];
  const contentPosts = allSlides.filter((s) => s.wixPostId);

  // Determinar mes y año
  const monthName = slide?.monthName || clientData?.mes || 'Septiembre';
  const year = slide?.year || clientData?.ano || 2026;

  // Calcular índice del mes (0-11)
  const mLower = monthName.toLowerCase();
  let monthIdx = 8; // Septiembre por defecto
  MONTH_NAMES_ES.forEach((name, idx) => {
    if (mLower.includes(name.toLowerCase().slice(0, 3))) {
      monthIdx = idx;
    }
  });

  // Días en el mes
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  
  // Primer día de la semana (Lunes como 0, Domingo como 6)
  const firstDaySundayBased = new Date(year, monthIdx, 1).getDay();
  const firstDayMondayBased = firstDaySundayBased === 0 ? 6 : firstDaySundayBased - 1;

  // Mapear publicaciones por día del mes
  const postsByDay = {};
  contentPosts.forEach((post) => {
    let dayNumber = null;
    if (post.fechaPublicacion) {
      const parts = post.fechaPublicacion.split('-');
      if (parts.length === 3) {
        dayNumber = parseInt(parts[2], 10);
      }
    }
    if (dayNumber && dayNumber >= 1 && dayNumber <= daysInMonth) {
      if (!postsByDay[dayNumber]) {
        postsByDay[dayNumber] = [];
      }
      postsByDay[dayNumber].push(post);
    }
  });

  // Métricas de aprobación
  const totalPosts = contentPosts.length;
  const approvedCount = contentPosts.filter((p) => !!approvedPosts[p.pageNumber]).length;
  const approvalPercent = totalPosts > 0 ? Math.round((approvedCount / totalPosts) * 100) : 0;

  // Número exacto de semanas para el grid (5 o 6)
  const numRows = Math.ceil((firstDayMondayBased + daysInMonth) / 7);
  const totalSlots = numRows * 7;

  return (
    <div
      className="w-full max-w-[1500px] h-full bg-white rounded-3xl border border-zinc-200/90 shadow-2xl relative overflow-hidden flex flex-col p-4 sm:p-5 md:p-6 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Motivo gráfico esquina superior izquierda */}
      <img
        src="/assets/graphics/left-swirl.png"
        alt=""
        className="absolute top-0 left-0 w-24 md:w-32 lg:w-40 opacity-10 pointer-events-none z-0 select-none"
      />

      {/* Header Compacto de la Lámina */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2.5 border-b border-zinc-100 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-orange-600" />
              Cronograma de Publicación
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {clientData?.title || 'Dilo Digital'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 font-space tracking-tight mt-0.5">
            {MONTH_NAMES_ES[monthIdx].toUpperCase()} {year}
          </h2>
        </div>

        {/* Resumen de aprobación y conteo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{totalPosts} Posts Programados</span>
          </div>

          <div
            className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              approvalPercent === 100
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : approvalPercent > 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                approvalPercent === 100 ? 'text-white' : 'text-emerald-600'
              }`}
            />
            <span>
              {approvalPercent}% Aprobado ({approvedCount}/{totalPosts})
            </span>
          </div>
        </div>
      </div>

      {/* Grilla del Calendario (100% visible sin scroll vertical) */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-visible">
        {/* Cabecera de días de la semana */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1 text-center shrink-0">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`py-1 text-[10px] sm:text-[11px] font-black tracking-wider rounded-lg ${
                i >= 5 ? 'text-zinc-400 bg-zinc-50/60' : 'text-zinc-600 bg-zinc-100/80 font-mono'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Celdas de días del mes con altura proporcional exacta (sin scroll) */}
        <div
          className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 min-h-0"
          style={{ gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalSlots }).map((_, slotIdx) => {
            const dayNumber = slotIdx - firstDayMondayBased + 1;
            const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
            const isWeekend = slotIdx % 7 === 5 || slotIdx % 7 === 6;
            const dayPosts = isCurrentMonth ? postsByDay[dayNumber] || [] : [];
            const hasPosts = dayPosts.length > 0;
            const isHovered = hoveredDay === dayNumber;
            const rowIndex = Math.floor(slotIdx / 7);
            const isTopHalf = rowIndex <= 2;

            if (!isCurrentMonth) {
              return (
                <div
                  key={`empty-${slotIdx}`}
                  className="bg-zinc-50/40 rounded-xl border border-dashed border-zinc-200/50 opacity-40"
                />
              );
            }

            return (
              <div
                key={`day-${dayNumber}`}
                onMouseEnter={() => hasPosts && setHoveredDay(dayNumber)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`rounded-xl border transition-all flex flex-col p-1 sm:p-1.5 relative overflow-visible ${
                  hasPosts
                    ? 'bg-orange-50/35 border-orange-300/90 hover:border-orange-500 hover:shadow-md shadow-2xs'
                    : isWeekend
                    ? 'bg-zinc-50/50 border-zinc-200/60'
                    : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                {/* Número del día y badge */}
                <div className="flex items-center justify-between shrink-0 mb-0.5">
                  <span
                    className={`text-[11px] sm:text-xs font-mono font-bold leading-none ${
                      hasPosts
                        ? 'text-orange-600 font-black'
                        : isWeekend
                        ? 'text-zinc-400'
                        : 'text-zinc-700'
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {hasPosts && (
                    <span className="flex items-center gap-1">
                      {dayPosts.length > 1 && (
                        <span className="text-[9px] font-black px-1 py-0.2 rounded-full bg-orange-500 text-white leading-none">
                          {dayPosts.length}
                        </span>
                      )}
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    </span>
                  )}
                </div>

                {/* Contenido del Día (Sin scroll interno) */}
                <div className="flex-1 min-h-0 flex flex-col justify-center gap-1">
                  {dayPosts.length === 1 && (() => {
                    const post = dayPosts[0];
                    const isApproved = !!approvedPosts[post.pageNumber];
                    const thumbImg =
                      post.posterUrl ||
                      post.images?.[0] ||
                      post.postImages?.[0] ||
                      '/assets/logo/dilo-logo-black.png';

                    return (
                      <div
                        onClick={() => onSelectSlide && onSelectSlide(post.pageNumber - 1)}
                        className={`w-full h-full max-h-[46px] p-0.5 sm:p-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 overflow-hidden ${
                          isApproved
                            ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/60'
                            : 'bg-white border-orange-200 hover:border-orange-400 hover:bg-orange-50/70'
                        }`}
                        title={`Lámina #${post.pageNumber}: ${post.rawType || post.type}. Clic para ir al post.`}
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md overflow-hidden bg-zinc-900 shrink-0 relative">
                          <img src={thumbImg} alt="" className="w-full h-full object-cover" />
                          {post.isVideo && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-2 h-2 text-white fill-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-0.5 leading-none">
                            <span className="text-[10px] font-black text-zinc-900 truncate">
                              #{post.pageNumber}
                            </span>
                            {isApproved ? (
                              <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded">
                                ✓
                              </span>
                            ) : (
                              <span className="text-[8px] font-semibold text-zinc-400">
                                Pend.
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-semibold text-orange-600 truncate uppercase mt-0.5">
                            {post.rawType || post.type}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {dayPosts.length >= 2 && (
                    <div
                      onClick={() => onSelectSlide && onSelectSlide(dayPosts[0].pageNumber - 1)}
                      className="w-full h-full max-h-[46px] p-1 rounded-lg border border-orange-200 bg-white/95 hover:border-orange-400 hover:bg-orange-50/60 transition-all cursor-pointer flex items-center justify-between gap-1 overflow-hidden"
                      title={`${dayPosts.length} publicaciones programadas. Pasa el cursor para ver todas o haz clic para ir.`}
                    >
                      {/* Avatar Stack de miniaturas solapadas */}
                      <div className="flex items-center -space-x-2 shrink-0">
                        {dayPosts.slice(0, 3).map((p, pIdx) => {
                          const thumb =
                            p.posterUrl ||
                            p.images?.[0] ||
                            p.postImages?.[0] ||
                            '/assets/logo/dilo-logo-black.png';
                          return (
                            <div
                              key={p.id || pIdx}
                              className="w-6 h-6 rounded-md overflow-hidden bg-zinc-900 ring-2 ring-white relative shadow-xs"
                            >
                              <img src={thumb} alt="" className="w-full h-full object-cover" />
                              {p.isVideo && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-1.5 h-1.5 text-white fill-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col items-end leading-none">
                        <span className="text-[10px] font-black text-orange-600 truncate">
                          {dayPosts.length} posts
                        </span>
                        <span className="text-[8px] text-zinc-400 font-bold mt-0.5">
                          Ver todos ↗
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Popover flotante en HOVER para ver múltiples publicaciones sin scroll */}
                {hasPosts && isHovered && (
                  <div
                    onMouseEnter={() => setHoveredDay(dayNumber)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`absolute z-50 left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-300 p-2.5 flex flex-col gap-2 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150 ${
                      isTopHalf ? 'top-[calc(100%+4px)]' : 'bottom-[calc(100%+4px)]'
                    }`}
                  >
                    {/* Encabezado del Popover */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-xs font-black text-zinc-900 font-space">
                          {dayNumber} de {MONTH_NAMES_ES[monthIdx]}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700">
                        {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                      </span>
                    </div>

                    {/* Lista completa de publicaciones para ese día */}
                    <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-0.5 scrollbar-none">
                      {dayPosts.map((post) => {
                        const isApproved = !!approvedPosts[post.pageNumber];
                        const thumbImg =
                          post.posterUrl ||
                          post.images?.[0] ||
                          post.postImages?.[0] ||
                          '/assets/logo/dilo-logo-black.png';

                        return (
                          <div
                            key={post.id}
                            onClick={() => {
                              setHoveredDay(null);
                              if (onSelectSlide) {
                                onSelectSlide(post.pageNumber - 1);
                              }
                            }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] ${
                              isApproved
                                ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/80'
                                : 'bg-orange-50/40 border-orange-200 hover:border-orange-400 hover:bg-orange-50/80'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 shrink-0 relative shadow-sm">
                              <img src={thumbImg} alt="" className="w-full h-full object-cover" />
                              {post.isVideo && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white fill-white" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-black text-zinc-900 truncate">
                                  Lámina #{post.pageNumber}
                                </span>
                                {isApproved ? (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                    ✓ Aprobado
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded-full">
                                    Pendiente
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-semibold text-orange-600 truncate uppercase mt-0.5">
                                {post.rawType || post.type}
                              </span>
                              {post.copy && (
                                <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                                  {post.copy}
                                </p>
                              )}
                            </div>

                            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-center text-zinc-400 font-medium pt-0.5">
                      Haz clic en cualquier post para abrir su lámina
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie de Lámina Compacto */}
      <div className="relative z-10 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 shrink-0 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          <span>
            Pasa el cursor sobre los días para ver detalles completos o haz clic para saltar a la lámina.
          </span>
        </div>
        <div className="font-mono text-zinc-500">
          Diapositiva #{slide?.pageNumber || 'Final'} · Dilo Digital
        </div>
      </div>
    </div>
  );
}
