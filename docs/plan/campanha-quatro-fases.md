# Campanha com Quatro Fases

> **Objetivo:** Entregar um menu inicial, um menu de seleção com quatro mapas distintos e uma campanha sequencial cujo progresso fica salvo no navegador até o resgate de André na fase 4.
> **Design de origem:** brainstorming desta conversa
> **Flows relacionados:** `docs/flow/project-structure.md`; criar `docs/flow/campanha-e-progressao-de-fases.md` após a implementação

## Contexto

O jogo atual inicia uma única fase criada por `createLevel()`, mantém o número da fase fixo no HTML e sempre encerra com o resgate de André. A campanha nova precisa separar a navegação da partida, oferecer quatro mapas com desbloqueio sequencial, permitir repetir fases concluídas e persistir o maior progresso no `localStorage`. O jogo continuará sem framework, dependências externas ou etapa de build, e a validação funcional/visual ficará para o usuário.

## Design de Origem

- **Decisão aprovada:** manter a coordenação da campanha em `src/main.js`, criar as regras testáveis de progresso em um módulo pequeno e preservar `Game` como responsável somente pelo ciclo da partida; o fluxo será menu inicial → menu de fases → partida → menu de fases.
- **Alternativas descartadas:** criar uma classe `CampaignController` dedicada — adicionaria uma camada de orquestração desnecessária para a escala atual do projeto.
- **Tipo de mudança:** Logic
- **Arquivos-chave:** `index.html`, `style.css`, `src/main.js`, `src/game.js`, `src/level.js`, `src/renderer.js`, `src/ui.js` e `src/config.js`.
- **Direção visual:** seguir `frontend-design:frontend-design`, preservando Fredoka, DM Mono e a paleta romântica existente; a assinatura do menu será uma trilha de resgate ligando os quatro cartões, com o sprite cativo de André somente no cartão da fase 4.
- **Flows a revisitar:** atualizar `docs/flow/project-structure.md` e criar `docs/flow/campanha-e-progressao-de-fases.md` com a skill `flow` após a implementação.

## Regras Aprovadas

- A campanha começa com `completedLevel = 0`; apenas a fase 1 fica disponível.
- Concluir uma fase salva o maior número concluído sem regredir quando uma fase antiga é repetida.
- Uma fase fica selecionável quando seu número é menor ou igual a `completedLevel + 1`; fases concluídas continuam disponíveis para repetição.
- O cartão da fase 4 exibe o sprite cativo de André e a mensagem “Faltam X fases para salvar André”; após concluir a fase 4, a mensagem vira “André foi salvo ♥”.
- As fases 1–3 terminam em uma bandeira/saída, não desenham André e retornam ao menu de fases após a conclusão.
- A fase 4 desenha André no objetivo, executa a animação de resgate existente e oferece retorno ao menu de fases no encerramento.
- As quatro fases têm templates de mapa próprios. A fase 1 mantém a identidade da Floresta do Coração; as demais são Vale das Promessas, Noite da Saudade e Fortaleza do Resgate, com dificuldade progressiva.
- Morangos continuam opcionais; o HUD mostra dinamicamente fase, nome e total de morangos do mapa atual.

## Arquitetura / Escopo

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `tests/campaign.test.js` | criar | Definir o contrato de persistência, desbloqueio, repetição e proteção contra regressão do progresso. |
| `tests/levels.test.js` | criar | Garantir quatro níveis independentes, mapas distintos, metadados e objetivos corretos. |
| `tests/game-campaign.test.js` | criar | Garantir troca limpa de fase e notificação única de conclusão pelo `Game`. |
| `src/campaign.js` | criar | Encapsular regras puras de campanha e leitura/escrita defensiva do progresso no storage recebido. |
| `src/config.js` | alterar | Centralizar quantidade de fases, metadados de apresentação e constantes da campanha. |
| `src/level.js` | alterar | Manter quatro templates internos e criar uma cópia mutável completa da fase solicitada. |
| `src/game.js` | alterar | Iniciar a fase recebida, reinicializar seu estado e notificar conclusão sem navegar ou acessar armazenamento. |
| `index.html` | alterar | Declarar menu inicial, menu de fases, cartões, HUD dinâmico e controles de retorno. |
| `style.css` | alterar | Estilizar navegação, trilha de resgate, estados bloqueado/concluído e comportamento responsivo/acessível. |
| `src/ui.js` | alterar | Alternar telas, atualizar cartões/HUD e recortar o sprite de André no cartão da fase 4. |
| `src/renderer.js` | alterar | Desenhar paletas por fase e diferenciar a saída comum do objetivo final com André. |
| `src/main.js` | alterar | Compor campanha, storage, menus, seleção de fase, desbloqueio e retorno após conclusão. |
| `docs/flow/project-structure.md` | alterar | Atualizar arquitetura e inventário de features após a campanha ser implementada. |
| `docs/flow/campanha-e-progressao-de-fases.md` | criar | Documentar o fluxo completo do menu inicial ao resgate e à persistência. |

## Fases

### Fase 1 — Testes de contrato antes da implementação

> Os testes vão falhar inicialmente — isso é intencional.

- [x] Criar `tests/campaign.test.js` com `node:test` para cobrir progresso inicial, desbloqueio sequencial, repetição sem regressão, conclusão da fase 4, valor persistido corrompido e storage indisponível.
- [x] Criar `tests/levels.test.js` para exigir que `createLevel(1)` até `createLevel(4)` retornem cópias mutáveis independentes, layouts distintos, metadados coerentes e André somente no objetivo da fase 4.
- [x] Criar `tests/game-campaign.test.js` com dependências falsas de entrada, áudio e UI para exigir que a troca de fase restaure jogador, coletáveis, checkpoints, câmera e que a conclusão seja emitida apenas uma vez.
- [x] Verificação: executar `node --test tests/campaign.test.js tests/levels.test.js tests/game-campaign.test.js` e confirmar que os testes são descobertos, não têm erro de sintaxe e falham somente pelas APIs ou comportamentos ainda não implementados. _(Comando corrigido por drift do ambiente: o Node 26 removeu `--experimental-default-type=module`; a detecção ESM é automática.)_

### Fase 2 — Modelar campanha e quatro mapas

- [x] Adicionar em `src/config.js` a quantidade de fases e os metadados imutáveis aprovados: número, nome, capítulo, descrição curta e identidade visual de cada mapa.
- [x] Criar `src/campaign.js` com funções para normalizar `completedLevel` entre 0 e 4, calcular estado bloqueado/disponível/concluído, impedir seleção bloqueada, registrar o maior nível concluído e ler/escrever no storage recebido com fallback seguro.
- [x] Reestruturar `src/level.js` em quatro templates internos completos, cada um com `id`, mundo, ponto inicial, plataformas, oito morangos, espinhos, obstáculos móveis, checkpoints, tema e objetivo; copiar profundamente todo estado mutável em `createLevel(levelNumber)`.
- [x] Definir nas fases 1–3 `goal.type = 'exit'` e na fase 4 `goal.type = 'rescue'`, mantendo o sprite de André fora dos três primeiros mapas.
- [x] Verificação: `node --test tests/campaign.test.js tests/levels.test.js` passa e uma mutação feita no nível retornado por um teste não aparece numa criação posterior.

### Fase 3 — Adaptar o ciclo da partida à campanha

- [x] Alterar `Game` em `src/game.js` para receber o callback abstrato de conclusão e disponibilizar uma operação de início/troca de fase que use o spawn do nível e reinicialize todo o estado transitório.
- [x] Atualizar colisão de objetivo e `finish()` em `src/game.js` para emitir uma única conclusão com número da fase, morangos, tempo e tipo de objetivo, sem acessar DOM, `localStorage` ou decidir qual tela abrir.
- [x] Preservar em `src/game.js` a sequência de resgate somente quando `level.goal.type` for `rescue`; saídas das fases 1–3 devem encerrar a partida sem iniciar as poses de André e Thaissa.
- [x] Ajustar em `src/game.js` respawn, limites de câmera e total de coletáveis para usar o nível atualmente carregado, sem depender dos valores da fase 1.
- [x] Verificação: `node --test tests/game-campaign.test.js` passa com uma conclusão por fase e sem vazamento de estado ao trocar de mapa.

### Fase 4 — Construir menus, HUD e identidade visual das fases

- [x] Substituir em `index.html` a introdução fixa por um menu inicial e adicionar um menu de fases com quatro botões semânticos, estados acessíveis, ação de voltar e uma área de sprite/contagem dentro do cartão da fase 4.
- [x] Tornar em `index.html` o rótulo da fase, o nome do mapa, o total de morangos e os textos de encerramento atualizáveis por `GameUI`, trocando a ação final por retorno ao menu de fases.
- [x] Ampliar `GameUI` em `src/ui.js` para alternar menu inicial, seleção e partida; aplicar bloqueado/disponível/concluído; atualizar a contagem restante e desenhar no cartão 4 somente um recorte cativo de `assets.andre` usando `SPRITE_FRAMES.andre.captive`.
- [x] Ampliar `Renderer` em `src/renderer.js` para consumir o tema do nível no céu, cenário e plataformas, desenhar uma saída sem André nas fases 1–3 e preservar André/animação de resgate apenas na fase 4.
- [x] Atualizar `style.css` com a trilha de resgate, cartões temáticos, foco visível, estados `disabled`, layout móvel e respeito a `prefers-reduced-motion`, mantendo os tokens, Fredoka e DM Mono existentes.
- [x] Verificação: confirmar estaticamente que os quatro botões têm nome acessível, botões bloqueados usam `disabled`, somente o cartão 4 contém o canvas/área do sprite e todos os IDs consultados em `src/ui.js` existem em `index.html`; a validação visual permanece manual.

### Fase 5 — Compor navegação, persistência e conclusão

- [x] Alterar `bootstrap()` em `src/main.js` para carregar o progresso de `window.localStorage`, manter fallback em memória quando o storage falhar e abrir inicialmente o menu principal após os assets ficarem prontos.
- [x] Conectar em `src/main.js` as ações menu inicial → seleção, seleção autorizada → `createLevel(levelNumber)` → partida, marca → menu inicial e encerramento final → menu de fases.
- [x] Tratar em `src/main.js` a conclusão sem regressão: persistir o maior nível, atualizar os quatro cartões e voltar imediatamente ao menu nas fases 1–3, mantendo a fase 4 visível até terminar a sequência de resgate.
- [x] Atualizar em `src/main.js` o HUD ao iniciar cada mapa e impedir que uma chamada programática ou evento de um botão bloqueado inicie uma fase ainda não liberada.
- [x] Executar `node --test tests/campaign.test.js tests/levels.test.js tests/game-campaign.test.js` e confirmar todos os testes passando sem iniciar servidor, navegador ou app.
- [x] Verificação: executar `for file in game.js src/*.js src/core/*.js tests/*.js; do node --check "$file" || exit 1; done` e `git diff --check`, ambos sem erros.

### Fase 6 — Documentar o flow implementado

- [x] Invocar a skill `flow` para criar `docs/flow/campanha-e-progressao-de-fases.md`, rastreando eventos de `index.html`/`src/ui.js` até `src/main.js`, `src/campaign.js`, `src/game.js`, `src/level.js` e o `localStorage`.
- [x] Registrar em `docs/flow/campanha-e-progressao-de-fases.md` as regras de bloqueio, repetição sem regressão, fallback de storage, retorno das fases 1–3 e resgate exclusivo da fase 4.
- [x] Atualizar `docs/flow/project-structure.md` com os novos módulos, as quatro fases, os menus e a ordem de navegação da campanha.
- [x] Verificação: `grep -n '\*\*Resumo:\*\*' docs/flow/*.md` lista o novo flow, e o documento cita todos os arquivos realmente envolvidos na implementação.

## Critérios de Sucesso

- [ ] O menu inicial abre o menu de fases e permite retornar sem recarregar a página.
- [ ] Quatro cartões representam mapas realmente distintos; apenas a fase seguinte fica disponível e fases concluídas podem ser repetidas.
- [ ] O progresso não regride, sobrevive ao recarregamento e continua utilizável na sessão quando o `localStorage` está indisponível.
- [ ] O cartão da fase 4 mostra André cativo e informa corretamente quantas fases faltam; nenhum outro cartão ou final intermediário mostra o sprite dele.
- [ ] As fases 1–3 retornam ao menu e liberam a próxima; a fase 4 executa o resgate antes de oferecer retorno ao menu.
- [ ] O HUD reflete número, nome e total de morangos do mapa atual.
- [x] Todos os testes unitários passam com o executor nativo do Node, sem novas dependências.
- [x] Todos os módulos JavaScript passam na verificação de sintaxe e `git diff --check` não encontra erros.
- [ ] _(manual — feito pelo usuário)_ Navegação, jogabilidade, alcance das plataformas, persistência após recarregar, animações, áudio, responsividade e aparência dos quatro temas foram validados no navegador.

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Algum mapa novo ter salto impossível ou colisão injusta | Média | Projetar distâncias a partir de `PHYSICS.maxSpeed`/`jumpSpeed`, revisar coordenadas estaticamente e incluir cada mapa no checklist manual do usuário. |
| `localStorage` lançar erro por privacidade, quota ou ambiente | Baixa | Receber o storage como dependência, capturar leitura/escrita e manter o progresso corrente em memória durante a sessão. |
| O recorte do contact sheet de André ficar desalinhado no cartão responsivo | Média | Usar as coordenadas já validadas de `SPRITE_FRAMES.andre.captive` em um canvas com dimensões fixas e deixar a conferência visual explícita para o usuário. |
| Alterações de menu interferirem em pausa, som ou controles atuais | Média | Manter os callbacks concretos em `src/main.js`, desativar a partida fora da tela de jogo e pedir validação manual desses controles em desktop e mobile. |

## Rollback

Reverter somente as alterações dos arquivos listados neste plano e remover os arquivos novos `src/campaign.js`, `tests/campaign.test.js`, `tests/levels.test.js`, `tests/game-campaign.test.js` e `docs/flow/campanha-e-progressao-de-fases.md`, preservando quaisquer mudanças locais não relacionadas já existentes no worktree.
