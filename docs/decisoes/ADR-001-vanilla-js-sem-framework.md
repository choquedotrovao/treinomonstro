# ADR-001 — Vanilla JS sem framework

> 2026-01-01 · Status: Aceito

## Contexto

App de uso pessoal, single-user, sem processo de build, rodando em XAMPP local + ngrok.
Escolha feita no início do projeto quando o escopo era pequeno e o objetivo era velocidade de prototipagem.

## Decisão

Vanilla ES Modules sem framework (sem React, Vue, Angular) e sem build step (sem npm, Webpack, Vite).

## Consequências

- **Positivo:** zero dependências de runtime, zero configuração de build, deploy = copiar arquivos, funciona em qualquer servidor estático
- **Positivo:** carrega diretamente no browser via `<script type="module">` — sem transpilação
- **Negativo:** sem reatividade automática — toda atualização de UI deve ser feita manualmente (patch cirúrgico ou re-render)
- **Negativo:** sem tree-shaking — Lucide e Tailwind CDN são carregados inteiros
- **Neutro:** exige disciplina de arquitetura (Store + subscriber) que frameworks dariam de graça
