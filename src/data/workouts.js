export const WORKOUTS = [
  /* ─── PUSH A — Peitoral Superior + Deltoide Lateral ─────────────── */
  {
    id: '1',
    label: 'Push A',
    title: 'PUSH A',
    subtitle: 'Peitoral Superior + Deltoide Lateral',
    muscleFocus: ['Peito', 'Ombros', 'Braços'],
    exercises: [
      { id: 't1_1',    icon: 'dumbbell',  name: 'Supino Inclinado (Halter/Articulado)', sets: 3, reps: '6-8',   note: '1ª Série leve 15x', rest: 120 },
      { id: 't1_2',    icon: 'dumbbell',  name: 'Supino Reto (Halter/Articulado)',      sets: 3, reps: '6-8',   rest: 90 },
      { id: 't1_3',    icon: 'layers',    name: 'Supino Declinado Articulado',          sets: 3, reps: '10-12', rest: 90 },
      { id: 't1_4',    icon: 'dumbbell',  name: 'Elevação Lateral (Halter)',            sets: 4, reps: '12-15', rest: 60 },
      { id: 't1_lat',  icon: 'layers',    name: 'Elevação Lateral na Máquina',          sets: 4, reps: '12-15', rest: 60 },
      { id: 't1_5',    icon: 'activity',  name: 'Tríceps Francês',                      sets: 3, reps: '8-10',  note: 'Cabeça longa · cotovelo alto', rest: 60 },
      { id: 't1_6',    icon: 'activity',  name: 'Tríceps Pulley',                       sets: 3, reps: '10-12', note: 'Pico 2s', rest: 60 },
      { id: 't1_7',    icon: 'target',    name: 'Infra Suspenso',                       sets: 3, reps: '15',    rest: 0 },
      { id: 't1_8',    icon: 'target',    name: 'Prancha Ventral',                      sets: 3, reps: '60s',   rest: 60 },
      { id: 't1_calf', icon: 'move',      name: 'Panturrilha em Pé',                    sets: 4, reps: '15-20', note: '★ Ponto fraco · 2s embaixo', rest: 45 },
    ],
  },

  /* ─── LEGS A — Quadríceps + Posterior (alto volume) ─────────────── */
  {
    id: '2',
    label: 'Legs A',
    title: 'LEGS A',
    subtitle: 'Quadríceps + Posterior — Alto Volume',
    muscleFocus: ['Pernas'],
    exercises: [
      { id: 't2_calf_a', icon: 'move',     name: 'Panturrilha em Pé',            sets: 3, reps: '20',    note: '★ Ativação · pico 2s embaixo', rest: 30 },
      { id: 't2_1',      icon: 'move',     name: 'Agachamento Livre / Pendular', sets: 3, reps: '6-8',   note: '1ª Série leve 15x', rest: 180 },
      { id: 't2_2',      icon: 'dumbbell', name: 'Stiff',                        sets: 3, reps: '8-10',  note: 'Ênfase no alongamento', rest: 90 },
      { id: 't2_legp',   icon: 'move',     name: 'Leg Press 45°',                sets: 4, reps: '10-15', rest: 120 },
      { id: 't2_4',      icon: 'layers',   name: 'Extensora Unilateral',         sets: 4, reps: '12-15', note: 'Pico 2s · quad primeiro', rest: 90 },
      { id: 't2_3',      icon: 'layers',   name: 'Flexora Unilateral',           sets: 3, reps: '10-12', note: 'Pico 2s', rest: 90 },
      { id: 't2_5',      icon: 'layers',   name: 'Adutora',                      sets: 3, reps: '15',    rest: 60 },
      { id: 't2_6',      icon: 'layers',   name: 'Abdutora',                     sets: 3, reps: '15',    rest: 60 },
      { id: 't2_7',      icon: 'layers',   name: 'Panturrilha Sentada',          sets: 4, reps: '12-15', note: '★ Sóleo · pico 2s embaixo', rest: 60 },
      { id: 't2_calf_s', icon: 'move',     name: 'Panturrilha em Pé',            sets: 3, reps: '15-20', note: '★ Finalizador · drop set opcional', rest: 45 },
    ],
  },

  /* ─── PULL A — Largura de Costas + Panturrilha ───────────────────── */
  {
    id: '3',
    label: 'Pull A',
    title: 'PULL A',
    subtitle: 'Largura de Costas',
    muscleFocus: ['Costas', 'Braços'],
    exercises: [
      { id: 't3_2',    icon: 'layers',    name: 'Puxada Frente Pronada',        sets: 4, reps: '6-10',  note: '1ª Série leve 15x · Pico 2s', rest: 120 },
      { id: 't3_1',    icon: 'dumbbell',  name: 'Remada Curvada Pronada',       sets: 3, reps: '8-10',  rest: 90 },
      { id: 't3_3',    icon: 'layers',    name: 'Remada Unilateral Articulada', sets: 3, reps: '8-10',  rest: 90 },
      { id: 't3_pull', icon: 'activity',  name: 'Pullover na Polia',            sets: 4, reps: '12-15', rest: 60 },
      { id: 't3_4',    icon: 'layers',    name: 'Crucifixo Inverso Máquina',    sets: 3, reps: '12-15', rest: 60 },
      { id: 't3_face', icon: 'crosshair', name: 'Face Pull',                    sets: 3, reps: '12-15', note: 'Pico 2s', rest: 60 },
      { id: 't3_5',    icon: 'layers',    name: 'Rosca Scott Máquina',          sets: 3, reps: '8-10',  rest: 60 },
      { id: 't3_6',    icon: 'dumbbell',  name: 'Rosca Martelo Banco 60°',      sets: 3, reps: '8-10',  rest: 60 },
      { id: 't3_7',    icon: 'target',    name: 'Abdominal Remador',            sets: 3, reps: '15',    rest: 0 },
      { id: 't3_8',    icon: 'target',    name: 'Prancha Lateral',              sets: 3, reps: '60s',   rest: 60 },
      { id: 't3_calf', icon: 'move',      name: 'Panturrilha Unilateral em Pé', sets: 3, reps: '15-20', note: '★ Ponto fraco · corrige assimetria D/E', rest: 45 },
    ],
  },

  /* ─── PUSH B — Ombros + Peitoral ─────────────────────────────────── */
  {
    id: '4',
    label: 'Push B',
    title: 'PUSH B',
    subtitle: 'Ombros + Peitoral',
    muscleFocus: ['Ombros', 'Peito', 'Braços'],
    exercises: [
      { id: 't4_1',    icon: 'dumbbell',  name: 'Desenvolvimento com Halteres',   sets: 4, reps: '6-8',   note: '1ª Série leve 15x', rest: 120 },
      { id: 't4_new',  icon: 'activity',  name: 'Elevação Lateral na Polia',      sets: 4, reps: '12-15', rest: 60 },
      { id: 't4_latm', icon: 'layers',    name: 'Elevação Lateral na Máquina',    sets: 4, reps: '12-15', rest: 60 },
      { id: 't4_bench',icon: 'dumbbell',  name: 'Supino Reto (Halter)',           sets: 3, reps: '8-10',  note: 'Tempo 3-1-2 · volume', rest: 90 },
      { id: 't4_2',    icon: 'layers',    name: 'Crucifixo Inclinado Articulado', sets: 3, reps: '8-10',  rest: 90 },
      { id: 't4_3',    icon: 'layers',    name: 'Peck Deck',                      sets: 3, reps: '10-12', note: 'Pico 2s', rest: 60 },
      { id: 't4_5',    icon: 'activity',  name: 'Tríceps Testa Cabo',             sets: 3, reps: '8-10',  note: 'Cabeça longa · trocar por Paralelas a cada 2 meses', rest: 60 },
      { id: 't4_6',    icon: 'activity',  name: 'Tríceps Pulley',                 sets: 3, reps: '10-12', note: 'Pico 2s', rest: 60 },
      { id: 't4_7b',   icon: 'target',    name: 'Prancha Lateral',                sets: 3, reps: '60s',   rest: 60 },
      { id: 't4_calf', icon: 'move',      name: 'Panturrilha em Pé',              sets: 3, reps: '15-20', note: '★ Ponto fraco · 2s embaixo', rest: 45 },
    ],
  },

  /* ─── LEGS B — Posterior + Glúteo (alto volume) ─────────────────── */
  {
    id: '5',
    label: 'Legs B',
    title: 'LEGS B',
    subtitle: 'Posterior + Glúteo — Alto Volume',
    muscleFocus: ['Pernas', 'Glúteo', 'Costas'],
    exercises: [
      { id: 't5_calf_a', icon: 'move',    name: 'Panturrilha em Pé',  sets: 3, reps: '20',    note: '★ Ativação · pico 2s embaixo', rest: 30 },
      { id: 't5_4',      icon: 'layers',  name: 'Cadeira Extensora',   sets: 3, reps: '15',    note: 'Ativação · leve · pré-Terra', rest: 45 },
      { id: 't5_1',      icon: 'move',    name: 'Levantamento Terra',  sets: 3, reps: '6-8',   note: '1ª Série leve 15x', rest: 180 },
      { id: 't5_hip',    icon: 'move',    name: 'Elevação Pélvica',    sets: 4, reps: '10-12', note: 'Pico 2s · glúteo', rest: 90 },
      { id: 't5_2',      icon: 'move',    name: 'Afundo Smith',        sets: 4, reps: '10-12', note: 'Priorize lado E — déficit 1,5cm registrado', asymmetryFocus: 'E', rest: 90 },
      { id: 't5_3',      icon: 'layers',  name: 'Mesa Flexora',        sets: 4, reps: '10-12', note: 'Pico 2s', rest: 90 },
      { id: 't5_legc',   icon: 'layers',  name: 'Flexora Sentada',     sets: 3, reps: '12-15', note: 'Pico 2s', rest: 60 },
      { id: 't5_5',      icon: 'layers',  name: 'Adutora',             sets: 3, reps: '15',    rest: 60 },
      { id: 't5_6',      icon: 'layers',  name: 'Abdutora',            sets: 3, reps: '15',    note: 'Pico 2s', rest: 60 },
      { id: 't5_7',      icon: 'layers',  name: 'Panturrilha Sentada', sets: 4, reps: '12-15', note: '★ Sóleo · pico 2s embaixo', rest: 60 },
      { id: 't5_calf_s', icon: 'move',    name: 'Panturrilha em Pé',  sets: 3, reps: '15-20', note: '★ Finalizador · drop set opcional', rest: 45 },
    ],
  },

  /* ─── PULL B — Espessura de Costas + Trapézio + Panturrilha ─────── */
  {
    id: '6',
    label: 'Pull B',
    title: 'PULL B',
    subtitle: 'Espessura de Costas + Trapézio',
    muscleFocus: ['Costas', 'Braços'],
    exercises: [
      { id: 't6_1',    icon: 'layers',    name: 'Remada Articulada Pronada',   sets: 3, reps: '6-8',   note: '1ª Série leve 15x', rest: 120 },
      { id: 't6_2',    icon: 'activity',  name: 'Puxada com Triângulo',        sets: 4, reps: '8-10',  note: 'Pico 2s', rest: 90 },
      { id: 't6_3',    icon: 'activity',  name: 'Remada Baixa c/ Triângulo',   sets: 3, reps: '10-12', rest: 90 },
      { id: 't6_4',    icon: 'activity',  name: 'Face Pull',                   sets: 3, reps: '12-15', note: 'Pico 2s', rest: 60 },
      { id: 't6_shrug',icon: 'dumbbell',  name: 'Encolhimento com Halteres',   sets: 4, reps: '10-15', note: 'Pico 2s no topo', rest: 60 },
      { id: 't6_5',    icon: 'dumbbell',  name: 'Rosca Barra W',               sets: 3, reps: '6-8',   rest: 60 },
      { id: 't6_6',    icon: 'activity',  name: 'Rosca Unilateral Polia Alta', sets: 3, reps: '10-12', rest: 60 },
      { id: 't6_7',    icon: 'target',    name: 'Abdominal Infra',             sets: 3, reps: '15',    rest: 0 },
      { id: 't6_calf', icon: 'move',      name: 'Panturrilha Sentada',         sets: 3, reps: '15-20', note: '★ Ponto fraco · sóleo · pico 2s', rest: 45 },
    ],
  },

  /* ─── DIA FLEX — Recuperação Ativa · Sua Escolha ────────────────── */
  {
    id: 'flex',
    label: 'Flex',
    title: 'DIA FLEX',
    subtitle: 'Recuperação Ativa · Sua Escolha',
    muscleFocus: ['Core', 'Mobilidade'],
    isFlexDay: true,
    exercises: [
      { id: 'fx_1', icon: 'target',   name: 'Prancha Ventral',         sets: 3, reps: '60s',    rest: 60,  note: 'Respire fundo · não prenda' },
      { id: 'fx_2', icon: 'target',   name: 'Prancha Lateral (D+E)',   sets: 2, reps: '45s',    rest: 45 },
      { id: 'fx_3', icon: 'activity', name: 'Abdominal Infra',         sets: 3, reps: '15',     rest: 30 },
      { id: 'fx_4', icon: 'move',     name: 'Panturrilha em Pé',       sets: 4, reps: '20',     rest: 30,  note: '★ Ponto fraco · pico 2s' },
      { id: 'fx_5', icon: 'repeat',   name: 'Mobilidade de Quadril',   sets: 1, reps: '5min',   rest: 0,   note: 'Círculos + passadas' },
      { id: 'fx_6', icon: 'repeat',   name: 'Alongamento Global',      sets: 1, reps: '10min',  rest: 0,   note: 'Ombros · cadeia post.' },
    ],
  },

  /* ─── CARDIO ─────────────────────────────────────────────────────── */
  {
    id: 'cardio',
    label: 'Cardio',
    title: 'PROTOCOLO CARDIO',
    subtitle: 'Resistência & Condicionamento',
    muscleFocus: ['Cardio'],
    isCardio: true,
    exercises: [
      { id: 'c1', icon: 'timer',    name: 'Aquecimento Ativo',   sets: 1, reps: '5min',      note: 'Mobilidade + Leve',    rest: 0 },
      { id: 'c2', icon: 'zap',      name: 'HIIT Tabata',         sets: 8, reps: '20s / 10s', note: '100% intensidade',     rest: 0 },
      { id: 'c3', icon: 'activity', name: 'Corrida / Esteira',   sets: 1, reps: '20min',     note: 'Zona 2 — FC ~65%',     rest: 0 },
      { id: 'c4', icon: 'move',     name: 'Pular Corda / Steps', sets: 4, reps: '60s',       note: 'Pausa 30s',            rest: 30 },
      { id: 'c5', icon: 'wind',     name: 'Bike / Elíptico',     sets: 1, reps: '15min',     note: 'Cadência constante',   rest: 0 },
      { id: 'c6', icon: 'heart',    name: 'Desaquecimento',      sets: 1, reps: '5min',      note: 'Respiração + Alongar', rest: 0 },
    ],
  },
];
