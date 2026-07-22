export function formatTime(seconds) {
  const abs = Math.max(0, Math.floor(seconds));
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
}

export function formatDateFull(isoString) {
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatVolume(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg.toFixed(0)}kg`;
}

export function formatDuration(minutes) {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/** Returns seconds if repsStr is a timed format like '60s', '45s', etc. Otherwise null. */
export function parseTimedReps(repsStr) {
  const m = String(repsStr ?? '').match(/^(\d+)s$/i);
  return m ? parseInt(m[1]) : null;
}

export function getRank(workoutCount) {
  if (workoutCount >= 100) return { label: 'JONIN',    color: 'text-red-400' };
  if (workoutCount >= 50)  return { label: 'CHUNIN',   color: 'text-orange-400' };
  if (workoutCount >= 10)  return { label: 'GENIN',    color: 'text-yellow-400' };
  return                          { label: 'ATLETA',   color: 'text-zinc-400' };
}
