/**
 * Mapa de nome de exercício → arquivo de mídia local.
 *
 * Como popular:
 *  1. Baixe GIFs/vídeos de ExerciseDB (https://exercisedb.p.rapidapi.com)
 *     ou Wger (https://wger.de/api/v2/exercise/).
 *  2. Converta para WebM com ffmpeg:
 *       ffmpeg -i input.gif -c:v libvpx-vp9 -b:v 0 -crf 33 -vf scale=480:480:force_original_aspect_ratio=decrease,pad=480:480:-1:-1 output.webm
 *  3. Coloque os arquivos em: htdocs/treino-monstro/media/exercises/
 *
 * O player só aparece quando o arquivo existe — erro 404 remove o player silenciosamente.
 */

const EXERCISE_MEDIA = {
  // ── PEITO ──────────────────────────────────────────────────────────────
  'Supino Reto (Halter)':                    'supino-reto-halter.webm',
  'Supino Reto (Halter/Articulado)':         'supino-reto-halter.webm',
  'Supino Inclinado (Halter)':               'supino-inclinado-halter.webm',
  'Supino Inclinado (Halter/Articulado)':    'supino-inclinado-halter.webm',
  'Supino Declinado Articulado':             'supino-declinado.webm',
  'Peck Deck':                               'peck-deck.webm',
  'Cross Over':                              'cross-over.webm',
  'Crucifixo Inclinado Articulado':          'crucifixo-inclinado.webm',

  // ── OMBROS ─────────────────────────────────────────────────────────────
  'Desenvolvimento com Halteres':            'desenvolvimento-halter.webm',
  'Elevação Lateral (Halter)':               'elevacao-lateral-halter.webm',
  'Elevação Lateral na Máquina':             'elevacao-lateral-maquina.webm',
  'Elevação Lateral na Polia':               'elevacao-lateral-polia.webm',
  'Face Pull':                               'face-pull.webm',
  'Crucifixo Inverso Máquina':               'crucifixo-inverso-maquina.webm',

  // ── TRÍCEPS ────────────────────────────────────────────────────────────
  'Tríceps Pulley':                          'triceps-pulley.webm',
  'Tríceps Testa no Cabo':                   'triceps-testa-cabo.webm',
  'Tríceps Testa Cabo':                      'triceps-testa-cabo.webm',
  'Tríceps Corda':                           'triceps-corda.webm',

  // ── COSTAS ─────────────────────────────────────────────────────────────
  'Puxada Frente Pronada':                   'puxada-frente-pronada.webm',
  'Puxada com Triângulo':                    'puxada-triangulo.webm',
  'Remada Curvada Pronada':                  'remada-curvada-pronada.webm',
  'Remada Unilateral Articulada':            'remada-unilateral-articulada.webm',
  'Remada Articulada Pronada':               'remada-articulada-pronada.webm',
  'Remada Baixa c/ Triângulo':               'remada-baixa-triangulo.webm',
  'Pullover na Polia':                       'pullover-polia.webm',
  'Encolhimento com Halteres':               'encolhimento-halter.webm',

  // ── BÍCEPS ─────────────────────────────────────────────────────────────
  'Rosca Direta (Barra W)':                  'rosca-direta-barra-w.webm',
  'Rosca Barra W':                           'rosca-direta-barra-w.webm',
  'Rosca Alternada (Halter)':                'rosca-alternada-halter.webm',
  'Rosca Martelo':                           'rosca-martelo.webm',
  'Rosca Martelo Banco 60°':                 'rosca-martelo.webm',
  'Rosca Scott Máquina':                     'rosca-scott-maquina.webm',
  'Rosca Unilateral Polia Alta':             'rosca-unilateral-polia.webm',

  // ── PERNAS ─────────────────────────────────────────────────────────────
  'Agachamento Livre':                       'agachamento-livre.webm',
  'Agachamento Livre / Pendular':            'agachamento-livre.webm',
  'Leg Press 45°':                           'leg-press-45.webm',
  'Extensora Unilateral':                    'extensora-unilateral.webm',
  'Cadeira Extensora':                       'extensora-unilateral.webm',
  'Stiff (Halter)':                          'stiff-halter.webm',
  'Stiff':                                   'stiff-halter.webm',
  'Flexora Unilateral':                      'flexora-unilateral.webm',
  'Mesa Flexora':                            'mesa-flexora.webm',
  'Flexora Sentada':                         'flexora-sentada.webm',
  'Hip Thrust':                              'hip-thrust.webm',
  'Levantamento Terra':                      'levantamento-terra.webm',
  'Afundo Smith':                            'afundo-smith.webm',
  'Adutora':                                 'adutora.webm',
  'Abdutora':                                'abdutora.webm',

  // ── PANTURRILHA ────────────────────────────────────────────────────────
  'Panturrilha em Pé (Máquina)':             'panturrilha-pe.webm',
  'Panturrilha em Pé':                       'panturrilha-pe.webm',
  'Panturrilha Sentada':                     'panturrilha-sentada.webm',

  // ── CORE ───────────────────────────────────────────────────────────────
  'Prancha Ventral':                         'prancha-ventral.webm',
  'Prancha Lateral':                         'prancha-lateral.webm',
  'Abdominal Remador':                       'abdominal-remador.webm',
  'Abdominal Infra':                         'abdominal-infra.webm',
  'Infra Suspenso':                          'infra-suspenso.webm',
};

const MEDIA_BASE = './media/exercises/';

/**
 * Retorna a URL local do vídeo do exercício, ou null se não mapeado.
 * O player usa onerror para se auto-remover quando o arquivo não existe.
 */
export function getExerciseMedia(exName) {
  if (!exName) return null;
  const file = EXERCISE_MEDIA[exName];
  return file ? MEDIA_BASE + file : null;
}
