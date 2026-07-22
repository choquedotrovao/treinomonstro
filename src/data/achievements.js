export const ACHIEVEMENTS = [
  // ── Sessões de musculação ─────────────────────────────────────────
  { id: 'session_1',   name: 'Primeira Missão',  desc: '1º treino completo',        icon: 'zap',          color: 'text-theme-primary' },
  { id: 'session_10',  name: 'Veterano',          desc: '10 treinos completos',      icon: 'trophy',       color: 'text-yellow-400'   },
  { id: 'session_25',  name: 'Guerreiro',         desc: '25 treinos completos',      icon: 'flame',        color: 'text-orange-400'   },
  { id: 'session_50',  name: 'Elite',             desc: '50 treinos completos',      icon: 'flame',        color: 'text-red-400'      },
  { id: 'session_100', name: 'Lendário',          desc: '100 treinos completos',     icon: 'trophy',       color: 'text-amber-300'    },
  { id: 'session_200', name: 'Imortal',           desc: '200 treinos completos',     icon: 'trophy',       color: 'text-purple-400'   },

  // ── Volume total (musculação) ─────────────────────────────────────
  { id: 'vol_1t',    name: '1 Tonelada',          desc: '1.000kg movidos no total',  icon: 'dumbbell',     color: 'text-zinc-300'     },
  { id: 'vol_10t',   name: '10 Toneladas',         desc: '10.000kg movidos',          icon: 'dumbbell',     color: 'text-blue-400'     },
  { id: 'vol_100t',  name: '100 Toneladas',        desc: '100.000kg movidos',         icon: 'dumbbell',     color: 'text-theme-primary'},
  { id: 'vol_500t',  name: '500 Toneladas',        desc: '500.000kg movidos',         icon: 'dumbbell',     color: 'text-purple-400'   },

  // ── PR ───────────────────────────────────────────────────────────
  { id: 'first_pr',   name: 'Novo Recorde',       desc: 'Primeiro PR registrado',    icon: 'trending-up',  color: 'text-green-400'    },

  // ── Streak (dias consecutivos) ────────────────────────────────────
  { id: 'streak_7',   name: 'Sete Dias',          desc: '7 dias consecutivos',       icon: 'flame',        color: 'text-orange-400'   },
  { id: 'streak_30',  name: 'Mês de Fogo',        desc: '30 dias consecutivos',      icon: 'flame',        color: 'text-red-500'      },
  { id: 'streak_100', name: 'Cem Dias',           desc: '100 dias consecutivos',     icon: 'zap',          color: 'text-yellow-300'   },

  // ── Ciclo completo ────────────────────────────────────────────────
  { id: 'cycle_1',      name: 'Ciclo Forjado',      desc: 'Primeiro ciclo completo',               icon: 'repeat',         color: 'text-theme-primary'},
  { id: 'cycle_5',      name: 'Máquina do Ciclo',   desc: '5 ciclos completos',                    icon: 'repeat',         color: 'text-amber-400'    },
  { id: 'week_perfect', name: 'Semana Perfeita',    desc: `Bateu a meta do ciclo em uma semana`,   icon: 'calendar-check', color: 'text-emerald-400'  },

  // ── Cardio — sessões ─────────────────────────────────────────────
  { id: 'cardio_first',  name: 'Primeira Corrida', desc: '1ª sessão de cardio',      icon: 'wind',         color: 'text-cyan-400'     },
  { id: 'cardio_5',      name: 'Corredor Casual',  desc: '5 sessões de cardio',       icon: 'wind',         color: 'text-cyan-400'     },
  { id: 'cardio_10',     name: 'Corredor',         desc: '10 sessões de cardio',      icon: 'wind',         color: 'text-cyan-300'     },
  { id: 'cardio_25',     name: 'Maratonista',      desc: '25 sessões de cardio',      icon: 'wind',         color: 'text-blue-300'     },
  { id: 'cardio_50',     name: 'Ultra Runner',     desc: '50 sessões de cardio',      icon: 'wind',         color: 'text-theme-primary'},

  // ── Cardio — distância ───────────────────────────────────────────
  { id: 'cardio_10km',   name: '10km Acumulados',  desc: '10km totais de cardio',    icon: 'crosshair',    color: 'text-emerald-400'  },
  { id: 'cardio_50km',   name: '50km Acumulados',  desc: '50km totais de cardio',    icon: 'crosshair',    color: 'text-emerald-400'  },
  { id: 'cardio_100km',  name: '100km Totais',     desc: '100km acumulados',          icon: 'crosshair',    color: 'text-green-400'    },
  { id: 'cardio_250km',  name: '250km Totais',     desc: '250km acumulados',          icon: 'crosshair',    color: 'text-amber-400'    },

  // ── Cardio — performance ─────────────────────────────────────────
  { id: 'cardio_vo2_first',   name: 'VO₂ Guerreiro',  desc: '1ª sessão VO₂Max 4×4',  icon: 'zap',     color: 'text-red-400'      },
  { id: 'cardio_pace_sub5',   name: 'Sub-5',          desc: 'Ritmo abaixo de 5min/km',icon: 'timer',   color: 'text-yellow-400'   },
  { id: 'cardio_pace_sub4_5', name: 'Sub-4:30',       desc: 'Ritmo abaixo de 4:30/km',icon: 'timer',   color: 'text-amber-300'    },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

/* ─── Helpers internos ──────────────────────────────────────────────── */

function localDateKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeDayStreak(history, cardioHistory = [], cardioCountsStreak = false) {
  const wDates = history.map(h => localDateKey(h.date));
  const cDates = cardioCountsStreak ? cardioHistory.map(c => localDateKey(c.date)) : [];
  const dates = new Set([...wDates, ...cDates]);
  if (!dates.size) return 0;
  const today = new Date();
  const startOffset = dates.has(localDateKey(today)) ? 0 : 1;
  let streak = 0;
  for (let i = startOffset; i < 400; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dates.has(localDateKey(d))) streak++;
    else break;
  }
  return streak;
}

/* ─── Verifica conquistas após treino de musculação ─────────────────── */

/** Verifica conquistas de sessão e volume. */
export function checkWorkoutAchievements(newHistory, earned = []) {
  const newlyEarned = [];
  const count = newHistory.length;

  for (const n of [1, 10, 25, 50, 100, 200]) {
    const id = `session_${n}`;
    if (count === n && !earned.includes(id)) newlyEarned.push(id);
  }

  const totalVol = newHistory.reduce((a, h) => a + (h.vol ?? 0), 0);
  const prevVol  = newHistory.slice(1).reduce((a, h) => a + (h.vol ?? 0), 0);
  for (const [threshold, id] of [
    [500_000, 'vol_500t'],
    [100_000, 'vol_100t'],
    [10_000,  'vol_10t'],
    [1_000,   'vol_1t'],
  ]) {
    if (prevVol < threshold && totalVol >= threshold && !earned.includes(id)) {
      newlyEarned.push(id);
    }
  }

  return newlyEarned;
}

/** Verifica conquistas de streak (dias consecutivos). */
export function checkStreakAchievements(history, cardioHistory = [], cardioCountsStreak = false, earned = []) {
  const streak = computeDayStreak(history, cardioHistory, cardioCountsStreak);
  const newlyEarned = [];
  for (const [threshold, id] of [[100, 'streak_100'], [30, 'streak_30'], [7, 'streak_7']]) {
    if (streak >= threshold && !earned.includes(id)) newlyEarned.push(id);
  }
  return newlyEarned;
}

/** Verifica conquista de semana perfeita (cycleGoal treinos em uma semana seg-dom). */
export function checkWeekPerfectAchievement(history, cycleGoal = 6, earned = []) {
  if (earned.includes('week_perfect')) return [];
  const weekMap = {};
  for (const h of history) {
    const d = new Date(h.date);
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    mon.setHours(0, 0, 0, 0);
    const key = mon.toISOString().slice(0, 10);
    weekMap[key] = (weekMap[key] ?? 0) + 1;
  }
  return Object.values(weekMap).some(n => n >= cycleGoal) ? ['week_perfect'] : [];
}

/** Verifica conquista de ciclo completo. */
export function checkCycleAchievements(cycleDone = [], cycleGoal = 6, completedCycles = 0, earned = []) {
  const newlyEarned = [];
  if (cycleDone.length >= cycleGoal) {
    if (!earned.includes('cycle_1')) newlyEarned.push('cycle_1');
    if (completedCycles >= 5 && !earned.includes('cycle_5')) newlyEarned.push('cycle_5');
  }
  return newlyEarned;
}
