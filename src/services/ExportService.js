export class ExportService {
  exportJSON(state) {
    const payload = {
      exportedAt:      new Date().toISOString(),
      version:         '3.0',
      history:         state.history,
      prs:             state.prs,
      logs:            state.logs,
      bodyWeights:     state.bodyWeights,
      biometrics:      state.biometrics,
      bioHistory:      state.bioHistory,
      customWorkouts:  state.customWorkouts,
      workoutExercises:state.workoutExercises,
      workoutMeta:     state.workoutMeta,
      weekPlan:        state.weekPlan,
      cycleGoal:       state.cycleGoal,
      cycleDone:       state.cycleDone,
      cycleStart:      state.cycleStart,
      cycleOrder:      state.cycleOrder,
      completedCycles: state.completedCycles,
      cardioHistory:   state.cardioHistory,
      achievements:    state.achievements,
      circumHistory:   state.circumHistory,
      personalGoals:   state.personalGoals,
    };
    this.#download(
      JSON.stringify(payload, null, 2),
      `monstro_backup_${this.#datestamp()}.json`,
      'application/json',
    );
  }

  exportCSV(history) {
    const header = ['Data', 'Hora', 'Treino', 'Volume(kg)', 'Reps', 'Duração(min)', 'MVP', 'Notas'];
    const rows = history.map(h => [
      new Date(h.date).toLocaleDateString('pt-BR'),
      new Date(h.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      `"${h.title}"`,
      (h.vol ?? 0).toFixed(1),
      h.reps ?? 0,
      h.duration ?? '',
      `"${h.mvp?.name ?? ''}"`,
      `"${(h.notes ?? '').replace(/"/g, "'")}"`,
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    this.#download(
      '﻿' + csv,  // BOM para encoding correto no Excel
      `monstro_historico_${this.#datestamp()}.csv`,
      'text/csv;charset=utf-8',
    );
  }

  #datestamp() {
    return new Date().toISOString().slice(0, 10);
  }

  #download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
