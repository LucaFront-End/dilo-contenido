import React from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Play,
  Layers,
  ArrowRight,
  Sparkles
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
  const allSlides = clientData?.slides || [];
  const contentPosts = allSlides.filter((s) => s.wixPostId);

  // Determinar mes y año
  const monthName = slide?.monthName || clientData?.mes || 'Septiembre';
  const year = slide?.year || clientData?.ano || 2026;

  // Calcular índice del mes (0-11)
  const mLower = monthName.toLowerCase();
  let monthIdx = 8; // Septiembre por defecto (0-indexed)
  MONTH_NAMES_ES.forEach((name, idx) => {
    if (mLower.includes(name.toLowerCase().slice(0, 3))) {
      monthIdx = idx;
    }
  });

  // Días en el mes
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  
  // Primer día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  // Adaptado a Lunes como 0, Domingo como 6
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

  // Total de celdas en la cuadrícula (semanas completas)
  const totalSlots = Math.ceil((firstDayMondayBased + daysInMonth) / 7) * 7;

  return (
    <div
      className="w-full max-w-[1500px] h-full min-h-[620px] max-h-[88vh] bg-white rounded-3xl border border-zinc-200/90 shadow-2xl relative overflow-hidden flex flex-col p-5 sm:p-7 md:p-8 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Motivo gráfico esquina superior izquierda */}
      <img
        src="/assets/graphics/left-swirl.png"
        alt=""
        className="absolute top-0 left-0 w-28 md:w-36 lg:w-44 opacity-10 pointer-events-none z-0 select-none"
      />

      {/* Header de la Lámina */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-orange-600" />
              Cronograma de Publicación
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {clientData?.title || 'Dilo Digital'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 font-space tracking-tight mt-1">
            {MONTH_NAMES_ES[monthIdx].toUpperCase()} {year}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Calendario de distribución estratégica de publicaciones programadas para el mes.
          </p>
        </div>

        {/* Resumen de aprobación y conteo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{totalPosts} Posts Programados</span>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
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

      {/* Grilla del Calendario */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Cabecera de días de la semana */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-1.5 text-center">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`py-1 text-[11px] font-black tracking-wider rounded-lg ${
                i >= 5 ? 'text-zinc-400 bg-zinc-50/60' : 'text-zinc-600 bg-zinc-100/80 font-mono'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Celdas de días del mes */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 min-h-0 overflow-y-auto pr-0.5">
          {Array.from({ length: totalSlots }).map((_, slotIdx) => {
            const dayNumber = slotIdx - firstDayMondayBased + 1;
            const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
            const isWeekend = slotIdx % 7 === 5 || slotIdx % 7 === 6;
            const dayPosts = isCurrentMonth ? postsByDay[dayNumber] || [] : [];
            const hasPosts = dayPosts.length > 0;

            if (!isCurrentMonth) {
              return (
                <div
                  key={`empty-${slotIdx}`}
                  className="bg-zinc-50/40 rounded-xl border border-dashed border-zinc-200/50 p-1 opacity-40 min-h-[60px]"
                />
              );
            }

            return (
              <div
                key={`day-${dayNumber}`}
                className={`rounded-xl border transition-all flex flex-col p-1.5 sm:p-2 min-h-[65px] sm:min-h-[75px] relative group ${
                  hasPosts
                    ? 'bg-orange-50/30 border-orange-300/80 hover:border-orange-500 hover:shadow-md shadow-2xs'
                    : isWeekend
                    ? 'bg-zinc-50/50 border-zinc-200/60'
                    : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                {/* Número del día */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-bold ${
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
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>

                {/* Posts en este día */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-none">
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
                          if (onSelectSlide) {
                            onSelectSlide(post.pageNumber - 1);
                          }
                        }}
                        className={`p-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                          isApproved
                            ? 'bg-white/90 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50'
                            : 'bg-white/90 border-orange-200 hover:border-orange-400 hover:bg-orange-50/60'
                        }`}
                        title={`Lámina #${post.pageNumber}: ${post.rawType || post.type}. Haz clic para saltar al post.`}
                      >
                        {/* Miniatura cuadrada */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden bg-zinc-900 shrink-0 relative">
                          <img
                            src={thumbImg}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {post.isVideo && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                          )}
                        </div>

                        {/* Datos del Post */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-black text-zinc-900 truncate">
                              #{post.pageNumber}
                            </span>
                            {isApproved ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1 py-0.1 rounded">
                                ✓
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold text-zinc-400">
                                Pend.
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-semibold text-orange-600 truncate uppercase">
                            {post.rawType || post.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie de Lámina */}
      <div className="relative z-10 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
          <span>
            Haz clic sobre cualquier publicación del calendario para saltar directamente a su lámina.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
          <span>
            Diapositiva #{slide?.pageNumber || 'Final'} · Dilo Digital
          </span>
        </div>
      </div>
    </div>
  );
}
