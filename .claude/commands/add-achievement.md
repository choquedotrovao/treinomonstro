Adicione o achievement: $ARGUMENTS

## Antes de implementar

1. Leia `src/data/achievements.js` completo para entender a estrutura existente.
2. Leia `src/controllers/WorkoutController.js` — funções `checkWorkoutAchievements`, `checkStreakAchievements`, `checkCycleAchievements`.
3. Leia `src/controllers/CardioController.js` — `checkAchievementsAfterEntry()`.
4. Confirme que o ID do novo achievement **não existe** no `ACHIEVEMENT_MAP`.

## Estrutura obrigatória

```js
// Em ACHIEVEMENT_MAP (src/data/achievements.js):
'id_do_achievement': {
  id:    'id_do_achievement',
  name:  'Nome Exibido',
  desc:  'Descrição curta do que o usuário fez',
  icon:  'nome-lucide-seguro',   // ver lista em CLAUDE.md
  color: 'text-XXX-400',        // usar paleta semântica do design system
}
```

## Onde adicionar a lógica de check

Escolha a função correta baseado no tipo:

- **Treino/volume/PR** → `checkWorkoutAchievements()` em WorkoutController.js
- **Streak** → `checkStreakAchievements()` em WorkoutController.js
- **Ciclo completo** → `checkCycleAchievements()` em WorkoutController.js
- **Cardio** → `checkAchievementsAfterEntry()` em CardioController.js

## Padrão de check

```js
if (!earned.includes('id_do_achievement') && /* condição */) {
  newAchievements.push('id_do_achievement');
}
```

## Checklist

- [ ] ID único e em snake_case
- [ ] Ícone Lucide da lista segura
- [ ] Cor da paleta semântica (`text-green-400`, `text-amber-400`, `text-purple-400`, etc.)
- [ ] Check function na controller correta
- [ ] Guard `!earned.includes(id)` para não duplicar
- [ ] Testado: conquista aparece no battle report + ProfileView galeria
