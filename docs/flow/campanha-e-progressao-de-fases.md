---
generated_at: 2026-08-09
source_commit: 058451a
source_state: dirty
verified_at: 2026-08-09
status: current
related_plans:
  - docs/plan/campanha-quatro-fases.md
---

# Flow: Campanha e progressão de fases

> **Resumo:** Do menu inicial ao resgate de André na fase 4, a campanha navega entre menu principal, seleção de fase e partida, desbloqueando mapas em sequência, persistindo o maior nível concluído no `localStorage` com fallback em memória e voltando ao menu de fases ao fim de cada partida.

## Visão Geral

O jogo abre no menu principal; ao clicar em "Escolher fase", o menu de fases mostra quatro cartões cujos estados (bloqueado/disponível/concluído) derivam do progresso salvo. Cada cartão é um botão que só inicia a fase quando ela está liberada (`levelNumber <= completedLevel + 1`). Ao iniciar a partida, `src/main.js` cria a fase via `createLevel(levelNumber)`, chama `Game.startLevel` (que reinicializa jogador, coletáveis, checkpoints, câmera e HUD) e o `Game` assume o ciclo.

Quando o jogador cruza o objetivo, `Game.finish()` emite **uma única** conclusão com número da fase, morangos, tempo e tipo de objetivo (`exit` para fases 1–3, `rescue` para a 4). `src/main.js` registra o maior nível concluído sem regressão, persiste no `localStorage` (com captura de erro e progresso mantido em memória quando o storage falha) e atualiza os quatro cartões. Em fases de saída, a partida para e a tela volta imediatamente ao menu de fases; na fase 4, a sequência de resgate e o beijo rodam no canvas antes de o cartão de encerramento oferecer o retorno ao menu.

## Passo a Passo

1. **[UI — botões]** — `index.html` → `#playButton`, `#levelCard1`..`#levelCard4`, `#backButton`, `#brand`, `#endingReturnButton`; `src/ui.js` → `GameUI.bind()`
   O `bootstrap` de `src/main.js` conecta `onPlay`, `onSelectLevel`, `onHome`, `onBack`, `onReturnEnding`, `onPause` e `onSound` aos eventos de clique dos elementos. Botões de cartão bloqueado ficam `disabled` via `GameUI.updateLevelCards()`.

2. **[UI — apresentação]** — `src/ui.js` → `GameUI.showMainMenu()` / `GameUI.showLevelSelect()` / `GameUI.showGame()`
   Alternam as classes `hidden` dos overlays `#mainMenuCard`, `#levelSelectCard` e `#endingCard`. `showLevelSelect` reaplica os estados dos cartões e inicia a animação do sprite cativo de André no canvas `#andrePreview` (somente no cartão 4).

3. **[Orquestração — seleção]** — `src/main.js` → `bootstrap()` (callback `onSelectLevel`)
   Consulta `isLevelSelectable(campaign.completedLevel, levelNumber)` e retorna sem ação para fases bloqueadas. Autorizada, chama `createLevel(levelNumber)` de `src/level.js` e `Game.startLevel(level)`.

4. **[Domínio — criação da fase]** — `src/level.js` → `createLevel(levelNumber)`
   Copia o template interno da fase (mundo, spawn, plataformas, oito morangos, espinhos, obstáculos móveis, checkpoints, tema e objetivo), mescla o metadata imutável de `CAMPAIGN.levels` e devolve estado 100% mutável e independente entre criações. Objetivo: `goal.type = 'exit'` nas fases 1–3 e `'rescue'` na 4.

5. **[Jogo — partida]** — `src/game.js` → `Game.startLevel(level)` / `Game.update(dt)`
   `startLevel` reinicializa jogador (spawn do nível), coletáveis, checkpoints, câmera, tempo e flags, e atualiza HUD/mensagem. O `update` roda física, colisões, coleta, checkpoints, dano e câmera até o jogador cruzar o objetivo (`player.x > goal.x - 45 && player.y > goal.y - 100`).

6. **[Jogo — conclusão]** — `src/game.js` → `Game.finish()`
   Guard `if (this.won) return` garante emissão única. Marca `won`, toca a vitória e chama `onFinish({ levelNumber, berries, time, goalType })`. Para `goal.type === 'exit'`, a partida congela (sem poses de resgate); para `'rescue'`, `updateEnding` anima a sequência e, ao fim, chama `GameUI.showEnding()` com morangos e tempo.

7. **[Orquestração — progresso]** — `src/main.js` → `bootstrap()` (callback `onFinish`)
   `registerLevelCompletion` retorna `max(completedLevel, levelNumber)`; se avançou, `writeCompletedLevel` persiste no storage. Depois `GameUI.updateLevelCards()` rederiva estados e a contagem do cartão 4. Em `exit`, `Game.stop()` + `showLevelSelect()`; em `rescue`, a fase 4 permanece visível até o encerramento.

8. **[UI — encerramento]** — `src/ui.js` → `GameUI.showEnding()` / `GameUI.hideEnding()`
   `showEnding` preenche `#finishBerries` e `#finishTime` e exibe `#endingCard`. O botão "Voltar ao menu de fases" dispara `onReturnEnding` (passo 1), que para a partida e reabre o menu de fases.

9. **[Dados — persistência]** — `src/campaign.js` → `readCompletedLevel()` / `writeCompletedLevel()`
   `src/main.js` cria o storage com `createProgressStore()` (fallback `null` se `window.localStorage` lançar). Leitura e escrita são defensivas: storage ausente ou `getItem`/`setItem` com exceção resultam em `0`/`false`, e o progresso corrente segue em memória durante a sessão.

### Caminhos alternativos

- **Falha de carregamento dos sprites:** `src/main.js` cai no `catch` do `bootstrap` e chama `GameUI.showLoadError()`, que desabilita o botão de jogar, mostra `#loadError` e abre o menu principal.
- **Fase bloqueada solicitada por evento ou chamada programática:** `onSelectLevel` de `src/main.js` valida com `isLevelSelectable` antes de criar a fase; botões bloqueados também têm `disabled` no DOM.
- **Storage indisponível ou corrompido:** `readCompletedLevel` retorna 0 e a campanha permanece jogável na sessão; escrita falha silenciosamente (`false`).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação | `index.html` | Declara menu principal, menu de fases, cartões, HUD dinâmico, canvas do sprite de André e controles de retorno. |
| Apresentação | `src/ui.js` | Alterna telas, atualiza estados dos cartões e HUD, anima o recorte cativo de André no cartão 4. |
| Orquestração | `src/main.js` | Compõe campanha, storage, entrada, áudio, UI, jogo e renderer; conecta navegação, desbloqueio e retorno após conclusão. |
| Domínio | `src/campaign.js` | Regras puras de normalização, desbloqueio, repetição sem regressão e leitura/escrita defensiva do progresso. |
| Domínio | `src/game.js` | Ciclo da partida, troca de fase, física, colisões e emissão única de conclusão sem navegar nem persistir. |
| Domínio | `src/level.js` | Quatro templates internos e cópias mutáveis completas via `createLevel(levelNumber)`. |
| Apresentação | `src/renderer.js` | Céu, cenário e plataformas por tema; saída comum nas fases 1–3 e objetivo com André apenas na fase 4. |
| Configuração | `src/config.js` | `CAMPAIGN` com quantidade de fases, chave de storage e metadados de apresentação dos mapas. |
| Dados | `window.localStorage` | Guarda o maior nível concluído sob a chave `thaissa.campaign.completedLevel`. |
| Testes | `tests/campaign.test.js` | Contrato de persistência, desbloqueio, repetição e proteção contra regressão. |
| Testes | `tests/levels.test.js` | Independência das quatro fases, layouts distintos, metadados e objetivos. |
| Testes | `tests/game-campaign.test.js` | Troca de fase sem vazamento de estado e conclusão única pelo `Game`. |

## Regras de Negócio Relevantes

- **Desbloqueio sequencial** — `src/campaign.js` → `isLevelSelectable()`: uma fase é selecionável quando `1 <= levelNumber <= completedLevel + 1`; fases concluídas continuam disponíveis para repetição.
- **Sem regressão de progresso** — `src/campaign.js` → `registerLevelCompletion()`: concluir uma fase antiga nunca reduz `completedLevel`; só o máximo persiste.
- **Normalização do progresso** — `src/campaign.js` → `normalizeCompletedLevel()`: qualquer valor lido (corrompido, negativo, fracionário ou acima do total) é convertido para um inteiro entre 0 e `CAMPAIGN.totalLevels`.
- **Fase 4 como único resgate** — `src/level.js`: fases 1–3 terminam com `goal.type = 'exit'` e não desenham André; a fase 4 tem `goal.type = 'rescue'`, desenha André cativo no objetivo e executa a sequência de resgate e beijo.
- **Retorno das fases 1–3 imediato** — `src/main.js` (callback `onFinish`): ao concluir uma saída, a partida para (`Game.stop()`) e o menu de fases abre na hora; a fase 4 só oferece retorno após a sequência de resgate terminar.
- **Contagem do cartão 4** — `src/ui.js` → `GameUI.updateLevelCards()`: "Faltam X fases para salvar André" (X = total − concluídas) e, com a campanha completa, "André foi salvo ♥".
- **Conclusão única** — `src/game.js` → `Game.finish()`: guard `won` impede mais de uma emissão de `onFinish` por fase.

## Observações

- `readCompletedLevel` trata a ausência de storage como progresso zero, mas não expõe à UI se a escrita falhou: uma sessão sem `localStorage` joga a campanha inteira sem persistir, por design.
- A sequência de resgate (`ENDING_SEQUENCE`) é animada apenas quando `level.goal.type === 'rescue'`; em fases de saída o `Game` congela o estado final, que fica visível atrás do overlay do menu de fases até a próxima partida.
- Os layouts dos quatro mapas foram projetados a partir de `PHYSICS.maxSpeed`/`jumpSpeed`, mas o alcance real de cada salto ainda depende da validação manual no navegador.
