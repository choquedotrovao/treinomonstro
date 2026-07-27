# ADR-003 — Ciclo PPL: avanço sequencial vs. baseado em indexOf

> 2026-07-27 · Status: Aceito

## Contexto

Quando o usuário finaliza um treino fora de ordem (ex: treina Pull B mas `cyclePosition=0`), há duas formas de calcular o próximo `cyclePosition`:

1. **Sequential (+1):** `(cyclePosition + 1) % cycleOrder.length`
2. **indexOf:** `(cycleOrder.indexOf(w.id) + 1) % cycleOrder.length`

## Tentativa anterior (indexOf)

Implementado em v6.5.1 e revertido em v6.6. Problema: treinar Pull B (pos=6) quando `cyclePosition=0` saltava o ciclo para a posição 7 (OFF), como se os 6 treinos anteriores tivessem sido feitos. O usuário experimentaria o banner de "ciclo completo" sem ter completado os outros treinos.

## Decisão

Manter **avanço sequencial (+1)** de `cyclePosition`.

`cyclePosition` indica "qual slot vem a seguir na ordem PPL", não "o que foi feito". A rastreabilidade de quais treinos foram feitos está em `cycleDone` (array de IDs).

## Trade-off

- **Positivo:** `cyclePosition` nunca salta slots — ciclo avança naturalmente sem efeitos colaterais inesperados.
- **Negativo:** Ao treinar fora de ordem, `cyclePosition` não reflete o treino real feito — pode mostrar o treino "errado" como próximo no DashboardView.
- **Mitigação:** Modais `cycle-overview` e `workout-picker` (v6.6) expõem o estado real do ciclo via `cycleDone` e permitem escolha livre, tornando `cyclePosition` uma sugestão, não uma obrigação.

## Consequências

- `cycleDone` é a fonte de verdade para "o que foi feito no ciclo".
- `cyclePosition` é a sugestão de "próximo na fila".
- Banner de ciclo completo usa `cycleDone.length >= cycleGoal`, não `cyclePosition`.
