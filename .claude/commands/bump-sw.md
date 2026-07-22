Faça o bump da versão do Service Worker do projeto Treino Monstro.

## Passos obrigatórios

1. Leia `sw.js` e identifique o valor atual de `CACHE` (ex: `'monstro-v16'`).
2. Leia `src/app.js` para listar todos os arquivos importados (imports ES module).
3. Leia a estrutura de `src/` com Glob para garantir que nenhum arquivo novo ficou de fora do cache.
4. Compare `LOCAL_ASSETS` em `sw.js` com os arquivos reais em `src/`.
5. Adicione qualquer arquivo ausente ao array `LOCAL_ASSETS`.
6. Incremente o número da versão em `CACHE` (ex: `monstro-v16` → `monstro-v17`).
7. Reporte:
   - Versão anterior → nova versão
   - Arquivos adicionados ao cache (se houver)
   - Arquivos que estão no cache mas não existem mais (se houver)

## Regras

- Nunca remova arquivos do cache sem confirmar com o usuário.
- O prefixo sempre é `monstro-v` seguido de número inteiro.
- `MEDIA_CACHE` (`monstro-media-v1`) não deve ser alterado.
