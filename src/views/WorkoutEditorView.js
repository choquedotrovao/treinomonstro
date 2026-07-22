import { delegate, createRipple } from '../utils/dom.js';
import { getExerciseMedia } from '../data/exerciseMedia.js';

/* ─── Helpers internos ─────────────────────────────────────────────── */

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderExerciseRow(ex, idx, total) {
  return `
    <div class="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/50 px-3 py-2.5 rounded-xl animate-zoom-in"
         data-ex-row="${idx}" data-ex-json="${esc(JSON.stringify(ex))}">
      <i data-lucide="grip-vertical" class="w-4 h-4 text-zinc-700 shrink-0"></i>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-bold text-white truncate">${esc(ex.name)}</div>
        <div class="text-[10px] text-zinc-500 font-mono">
          ${ex.sets} série${ex.sets !== 1 ? 's' : ''}${ex.reps ? ` · ${ex.reps} reps` : ''}${ex.rest ? ` · ${ex.rest}s` : ''}
        </div>
      </div>
      <div class="flex items-center gap-0.5 shrink-0">
        <button data-action="open-exercise-demo" data-ex-name="${esc(ex.name)}"
                title="${getExerciseMedia(ex.name) ? 'Ver demonstração' : 'Sem demonstração'}"
                class="w-8 h-8 rounded flex items-center justify-center transition-all active:scale-90
                       ${getExerciseMedia(ex.name)
                         ? 'text-theme-primary/70 hover:text-theme-primary hover:bg-theme-dim'
                         : 'text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800'}">
          <i data-lucide="${getExerciseMedia(ex.name) ? 'play' : 'video-off'}" class="w-3.5 h-3.5"></i>
        </button>
        <button data-action="edit-ex" data-idx="${idx}"
                title="Editar exercício"
                class="w-8 h-8 rounded flex items-center justify-center text-zinc-600
                       hover:text-theme-primary hover:bg-theme-dim transition-all active:scale-90 mr-0.5">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
        </button>
        <button data-action="reorder-ex" data-idx="${idx}" data-dir="-1"
                title="Mover para cima"
                ${idx === 0 ? 'disabled' : ''}
                class="w-8 h-8 rounded flex items-center justify-center text-zinc-600
                       hover:text-zinc-400 hover:bg-zinc-800 transition-all active:scale-90
                       disabled:opacity-30 disabled:pointer-events-none">
          <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
        </button>
        <button data-action="reorder-ex" data-idx="${idx}" data-dir="1"
                title="Mover para baixo"
                ${idx === total - 1 ? 'disabled' : ''}
                class="w-8 h-8 rounded flex items-center justify-center text-zinc-600
                       hover:text-zinc-400 hover:bg-zinc-800 transition-all active:scale-90
                       disabled:opacity-30 disabled:pointer-events-none">
          <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
        </button>
        <button data-action="remove-ex" data-idx="${idx}"
                title="Remover exercício"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600
                       hover:text-red-400 hover:bg-red-900/20 transition-all active:scale-90 ml-1">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `;
}

function renderExerciseEditForm(ex, idx) {
  return `
    <div class="space-y-2.5 p-1" data-edit-form="${idx}">
      <div>
        <label class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Nome do exercício</label>
        <input type="text" data-field="name" value="${esc(ex.name)}"
               class="input-ninja w-full py-2.5 rounded-lg text-sm font-bold" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9px] text-zinc-500 uppercase font-bold tracking-wider shrink-0 w-10">Séries</span>
        <div class="flex gap-1 flex-1">
          ${[1,2,3,4,5,6].map(n => `
            <button type="button" data-edit-sets="${n}"
                    class="edit-sets-picker flex-1 h-7 rounded-lg text-xs font-black border transition-all active:scale-90
                           ${n === (ex.sets || 3) ? 'bg-theme-primary/20 border-theme-accent text-theme-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}">
              ${n}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Reps alvo</label>
          <input type="number" data-field="reps" value="${esc(ex.reps ?? '')}" placeholder="ex: 12"
                 min="1" max="100"
                 class="input-ninja w-full py-2 rounded-lg text-xs font-bold text-center" />
        </div>
        <div>
          <label class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Descanso (s)</label>
          <input type="number" data-field="rest" value="${esc(ex.rest ?? '')}" placeholder="ex: 60"
                 min="0" max="600"
                 class="input-ninja w-full py-2 rounded-lg text-xs font-bold text-center" />
        </div>
      </div>
      <div>
        <label class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Nota</label>
        <input type="text" data-field="note" value="${esc(ex.note ?? '')}" placeholder="observação opcional"
               class="input-ninja w-full py-2 rounded-lg text-xs" />
      </div>
      <div class="flex gap-2 pt-1">
        <button type="button" data-action="cancel-edit-ex"
                class="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400
                       text-xs font-black uppercase tracking-wider active:scale-95 transition-all
                       hover:text-zinc-200">
          Cancelar
        </button>
        <button type="button" data-action="save-edit-ex" data-idx="${idx}"
                class="flex-1 py-2 rounded-xl bg-theme-primary/20 border border-theme-accent text-theme-primary
                       text-xs font-black uppercase tracking-wider active:scale-95 transition-all
                       hover:bg-theme-primary/30">
          Salvar
        </button>
      </div>
    </div>
  `;
}

/* ─── Export: lista de exercícios (re-render parcial) ──────────────── */

export function renderExercisesListHTML(exercises = []) {
  if (!exercises.length) {
    return `
      <div class="text-center py-5 text-[10px] text-zinc-700 font-mono border border-dashed border-zinc-800 rounded-xl">
        Nenhum exercício adicionado
      </div>`;
  }
  return `<div class="space-y-2">${exercises.map((ex, i) => renderExerciseRow(ex, i, exercises.length)).join('')}</div>`;
}

/* ─── Export: render principal ─────────────────────────────────────── */

export function renderWorkoutEditor(editorWorkout, exerciseNames = []) {
  const w   = editorWorkout ?? {};
  const exs = w.exercises ?? [];

  return `
    <div class="stagger-enter space-y-4 pb-8">

      <!-- Informações básicas -->
      <div class="glass-card p-4 rounded-2xl border border-zinc-800/60 space-y-3">
        <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i> Informações
        </p>
        <div>
          <label class="text-[9px] text-zinc-600 font-bold uppercase tracking-wider block mb-1">Nome do Treino *</label>
          <input type="text" id="editor-title" placeholder="ex: Peito e Tríceps"
                 value="${esc(w.title ?? '')}"
                 class="input-ninja w-full py-3 rounded-lg text-sm font-bold" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-zinc-600 font-bold uppercase tracking-wider block mb-1">Tag</label>
            <input type="text" id="editor-label" placeholder="ex: PUSH A"
                   value="${esc(w.label ?? '')}"
                   maxlength="10"
                   class="input-ninja w-full py-2.5 rounded-lg text-xs font-black uppercase" />
          </div>
          <div>
            <label class="text-[9px] text-zinc-600 font-bold uppercase tracking-wider block mb-1">Subtítulo</label>
            <input type="text" id="editor-subtitle" placeholder="ex: Força + Volume"
                   value="${esc(w.subtitle ?? '')}"
                   class="input-ninja w-full py-2.5 rounded-lg text-xs font-bold" />
          </div>
        </div>
      </div>

      <!-- Exercícios -->
      <div class="glass-card p-4 rounded-2xl border border-zinc-800/60">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <i data-lucide="list" class="w-3.5 h-3.5"></i>
            Exercícios
            <span id="editor-ex-count"
                  class="text-theme-primary bg-theme-dim border border-theme-dim px-1.5 py-0.5 rounded text-[9px]">
              ${exs.length}
            </span>
          </p>
        </div>

        <!-- Lista (atualizada via patchEditorExercises) -->
        <div id="editor-exercises-section" class="mb-3">
          ${renderExercisesListHTML(exs)}
        </div>

        <!-- Formulário de adição -->
        <div class="pt-3 border-t border-zinc-800/60 space-y-2.5">
          <div class="relative">
            <input type="text" id="new-ex-name" placeholder="Nome do exercício"
                   autocomplete="off"
                   class="input-ninja w-full py-3 rounded-lg text-sm font-bold" />
            <div id="ex-search-results"
                 class="hidden absolute z-20 left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-2xl no-scrollbar">
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[9px] text-zinc-500 uppercase font-bold tracking-wider shrink-0 w-10">Séries</span>
            <div class="flex gap-1.5 flex-1">
              ${[1,2,3,4,5,6].map(n => `
                <button data-sets="${n}"
                        class="sets-picker flex-1 h-8 rounded-lg text-xs font-black border transition-all active:scale-90
                               ${n === 3 ? 'bg-theme-primary/20 border-theme-accent text-theme-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}">
                  ${n}
                </button>
              `).join('')}
            </div>
          </div>
          <button data-action="add-ex"
                  class="ripple-target w-full py-2.5 rounded-xl bg-zinc-800 border border-zinc-700
                         text-zinc-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all
                         hover:bg-theme-dim hover:border-theme-accent hover:text-theme-primary">
            <i data-lucide="plus" class="w-3.5 h-3.5 inline-block -mt-0.5"></i> Adicionar Exercício
          </button>
        </div>
      </div>

      <!-- Info built-in / Excluir custom -->
      ${w.id && !w.isCustom ? `
        <div class="flex items-start gap-2 bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-3 py-2.5">
          <i data-lucide="info" class="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5"></i>
          <p class="text-[9px] text-zinc-500 font-mono leading-relaxed">
            Treino padrão — alterações são salvas como personalização local.
            O original pode ser restaurado apagando o treino das configurações de dados.
          </p>
        </div>
      ` : ''}
      ${w.id && w.isCustom ? `
        <button data-action="delete-custom-workout"
                class="ripple-target btn-akatsuki w-full active:scale-95 border-red-900/40 text-red-500/70 hover:bg-red-900/20">
          <i data-lucide="trash-2" class="w-4 h-4"></i> Excluir Treino
        </button>
      ` : ''}

    </div>
  `;
}

/* ─── Export: montagem de eventos ──────────────────────────────────── */

export function mountWorkoutEditor(container, handler, exerciseNames = []) {
  let selectedSets = 3;

  // Busca incremental na biblioteca de exercícios
  const nameInput     = container.querySelector('#new-ex-name');
  const searchResults = container.querySelector('#ex-search-results');
  if (nameInput && searchResults && exerciseNames.length) {
    nameInput.addEventListener('input', () => {
      const q = nameInput.value.trim().toLowerCase();
      if (!q) { searchResults.innerHTML = ''; searchResults.classList.add('hidden'); return; }
      const matches = exerciseNames.filter(n => n.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) { searchResults.innerHTML = ''; searchResults.classList.add('hidden'); return; }
      searchResults.innerHTML = matches.map(n =>
        `<button type="button" data-ex-pick="${esc(n)}"
                 class="w-full text-left px-3 py-2.5 text-sm font-bold text-white
                        hover:bg-zinc-800 border-b border-zinc-800/50 last:border-none
                        transition-colors active:bg-zinc-700">${esc(n)}</button>`
      ).join('');
      searchResults.classList.remove('hidden');
    });
    delegate(container, '[data-ex-pick]', 'click', (e, el) => {
      nameInput.value = el.dataset.exPick;
      searchResults.innerHTML = '';
      searchResults.classList.add('hidden');
      nameInput.focus();
    });
    nameInput.addEventListener('blur', () =>
      setTimeout(() => { searchResults.innerHTML = ''; searchResults.classList.add('hidden'); }, 200)
    );
  }

  // Sets picker para novo exercício
  delegate(container, '.sets-picker', 'click', (e, el) => {
    selectedSets = parseInt(el.dataset.sets);
    container.querySelectorAll('.sets-picker').forEach(b => {
      const on = parseInt(b.dataset.sets) === selectedSets;
      b.className = `sets-picker flex-1 h-8 rounded-lg text-xs font-black border transition-all active:scale-90 ${
        on ? 'bg-theme-primary/20 border-theme-accent text-theme-primary'
           : 'bg-zinc-800 border-zinc-700 text-zinc-400'
      }`;
    });
  });

  // Sets picker dentro do formulário de edição inline
  delegate(container, '[data-edit-sets]', 'click', (e, el) => {
    const form = el.closest('[data-edit-form]');
    if (!form) return;
    form.querySelectorAll('[data-edit-sets]').forEach(b => {
      const on = b === el;
      b.className = `edit-sets-picker flex-1 h-7 rounded-lg text-xs font-black border transition-all active:scale-90 ${
        on ? 'bg-theme-primary/20 border-theme-accent text-theme-primary'
           : 'bg-zinc-800 border-zinc-700 text-zinc-400'
      }`;
    });
  });

  delegate(container, '[data-action="add-ex"]', 'click', (e, el) => {
    createRipple(e, el);
    const input = container.querySelector('#new-ex-name');
    const name  = input?.value?.trim();
    if (!name) {
      input?.focus();
      input?.classList.add('ring-1', 'ring-red-500/70');
      setTimeout(() => input?.classList.remove('ring-1', 'ring-red-500/70'), 1200);
      return;
    }
    handler('add-ex', { name, sets: selectedSets });
    if (input) input.value = '';
    input?.focus();
  });

  // Demo de exercício
  delegate(container, '[data-action="open-exercise-demo"]', 'click', (e, el) => {
    e.stopPropagation();
    handler('open-exercise-demo', { exName: el.dataset.exName });
  });

  // Abrir formulário de edição inline
  delegate(container, '[data-action="edit-ex"]', 'click', (e, el) => {
    const idx = parseInt(el.dataset.idx);
    const row = container.querySelector(`[data-ex-row="${idx}"]`);
    if (!row) return;
    try {
      const ex = JSON.parse(row.dataset.exJson);
      row.innerHTML = renderExerciseEditForm(ex, idx);
      // Remove borda/bg padrão da linha e adiciona estilo de edição
      row.classList.remove('animate-zoom-in');
      row.classList.add('border-theme-accent/40', 'bg-zinc-900/70', 'p-3', 'rounded-xl');
      if (window.lucide) lucide.createIcons({ nodes: [row] });
      row.querySelector('[data-field="name"]')?.focus();
    } catch {}
  });

  // Cancelar edição inline
  delegate(container, '[data-action="cancel-edit-ex"]', 'click', () => {
    handler('cancel-edit-ex');
  });

  // Salvar edição inline
  delegate(container, '[data-action="save-edit-ex"]', 'click', (e, el) => {
    const idx  = parseInt(el.dataset.idx);
    const form = el.closest('[data-edit-form]');
    if (!form) return;

    const nameInput = form.querySelector('[data-field="name"]');
    const name = nameInput?.value?.trim();
    if (!name) {
      nameInput?.focus();
      nameInput?.classList.add('ring-1', 'ring-red-500/70');
      setTimeout(() => nameInput?.classList.remove('ring-1', 'ring-red-500/70'), 1200);
      return;
    }

    const activeSetBtn = [...form.querySelectorAll('[data-edit-sets]')]
      .find(b => b.classList.contains('border-theme-accent'));
    const sets = activeSetBtn ? parseInt(activeSetBtn.dataset.editSets) : 3;

    const repsVal = form.querySelector('[data-field="reps"]')?.value?.trim();
    const restVal = form.querySelector('[data-field="rest"]')?.value?.trim();
    const noteVal = form.querySelector('[data-field="note"]')?.value?.trim();

    const repsNum = parseInt(repsVal);
    const restNum = parseInt(restVal);
    handler('update-ex', {
      idx,
      name,
      sets,
      reps: !isNaN(repsNum) && repsNum > 0 ? repsNum : undefined,
      rest: !isNaN(restNum) && restNum >= 0 ? restNum : undefined,
      note: noteVal || undefined,
    });
  });

  delegate(container, '[data-action="reorder-ex"]', 'click', (e, el) => {
    handler('reorder-ex', {
      idx: parseInt(el.dataset.idx),
      dir: parseInt(el.dataset.dir),
    });
  });

  delegate(container, '[data-action="remove-ex"]', 'click', (e, el) => {
    handler('remove-ex', parseInt(el.dataset.idx));
  });

  delegate(container, '[data-action="delete-custom-workout"]', 'click', (e, el) => {
    createRipple(e, el);
    handler('delete-custom-workout');
  });
}
