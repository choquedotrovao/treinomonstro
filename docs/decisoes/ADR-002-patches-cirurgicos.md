# ADR-002 — Patches cirúrgicos em vez de re-render durante treino

> 2026-04-01 · Status: Aceito

## Contexto

Durante o treino ativo, o usuário interage intensamente com a WorkoutView (marcar séries, inserir pesos, ajustar reps). Re-render total da view a cada interação causava:
- Perda de foco em inputs numéricos abertos
- Flash visual perceptível
- Timer de descanso sendo reiniciado (estava no DOM)

## Decisão

Funções `patchXxx()` exportadas da WorkoutView fazem atualizações cirúrgicas no DOM já renderizado, sem re-render da view inteira. Re-render total só ocorre na entrada e saída da aba de treino.

## Consequências

- **Positivo:** inputs não perdem foco, sem flash, timer independente do render
- **Positivo:** performance — apenas o elemento mínimo é atualizado
- **Negativo:** cada tipo de mudança precisa de sua própria função patch (mais código para manter)
- **Negativo:** patches podem ficar dessincronizados do render se a lógica mudar — exige manutenção paralela
- **Neutro:** subscriber único no AppController decide qual patch chamar com base no diff de state
