# Thaissa — Missão de resgate

Jogo de plataforma 2D para navegador feito com HTML, CSS, JavaScript modular e Canvas 2D, sem framework ou etapa de build.

## Stack

- JavaScript com módulos ES, HTML5 e CSS
- APIs nativas de DOM, Canvas 2D, Web Audio e `requestAnimationFrame`
- Sem manifesto de pacotes, dependências JavaScript externas ou ferramenta de build

## Estrutura

- `index.html` — shell da página, canvas, HUD, overlays e controles
- `game.js` — ponto de entrada estável que importa `src/main.js`
- `src/main.js` — bootstrap, composição das dependências e game loop
- `src/game.js` — estado, física, colisões, progressão e regras da partida
- `src/level.js` — templates e fábrica da fase 1–1
- `src/renderer.js` — cenário, sprites, câmera e animações no canvas
- `src/ui.js` — HUD, mensagens, overlays e eventos dos botões
- `src/core/` — carregamento de assets, áudio, colisão e entrada
- `src/config.js` — constantes de viewport, física, assets e recortes de sprites
- `Assets/` — sprites e demais recursos visuais; preserve maiúsculas e espaços dos caminhos

## Comandos

- `python3 -m http.server 8080` — serve a raiz por HTTP para execução manual pelo usuário; módulos ES não funcionam corretamente abrindo o HTML via `file://`

## Convenções

- Mantenha a composição de dependências em `src/main.js`; passe entrada, áudio e UI ao `Game` pelo construtor
- Não acople `src/game.js` ao DOM, ao canvas ou à criação concreta dos serviços
- Centralize números de viewport, mundo, física, estado inicial e sprites em `src/config.js`
- Em `src/level.js`, crie estado mutável copiando os templates internos; não exponha os templates diretamente ao jogo
- Cadastre em `ASSET_MANIFEST` todo sprite que precise ser carregado pelo runtime

## Gotchas

- O runtime atual carrega somente os quatro sprites declarados em `ASSET_MANIFEST`; existir em `Assets/` não torna uma imagem disponível ao renderizador
- Não há suíte de testes automatizados, linter ou comando de build configurado no repositório

## Não fazer

- Não introduza gerenciador de pacotes, framework ou etapa de build sem solicitação explícita
- Não renomeie nem mova assets sem atualizar todas as referências com a mesma capitalização

## 📖 Documentação de Flows

Para qualquer feature ou fluxo, verifique a pasta `./docs/flow/`: leia os títulos dos arquivos `.md` disponíveis e, se algum for relevante para a tarefa atual, leia-o antes de implementar ou debugar. Invoque a skill `flow` para criar ou atualizar flows individuais.

## 🧪 Teste funcional

Após implementar, não execute o projeto para validar o resultado (rodar o app, emulador/simulador, dispositivo físico, servidor local, screenshots ou interação simulada). Teste funcional/visual é responsabilidade do usuário.

- Limite a verificação a análise estática, build/compile e testes automatizados
- Ao concluir, liste objetivamente o que o usuário deve testar manualmente
- Não pergunte se deve executar o projeto — só faça isso se o usuário pedir explicitamente
