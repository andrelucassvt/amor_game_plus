---
generated_at: 2026-08-10
source_commit: 42e9b84
source_state: dirty
verified_at: 2026-08-10
status: current
related_plans: []
---

# Flow: Layout das fases

> **Resumo:** Ao iniciar uma fase, os templates de terreno, rotas elevadas, morangos, espinhos, obstáculos móveis, checkpoints e objetivo são copiados para um estado isolado que o ciclo de jogo usa para colisões, dano, coleta e conclusão.

## Visão Geral

Ao selecionar uma fase disponível, `src/main.js` chama `createLevel(levelNumber)`. A função busca o template interno correspondente em `src/level.js`, combina seus metadados com a configuração da campanha e cria cópias mutáveis de todos os elementos de gameplay. Cada tentativa, portanto, começa com uma instância limpa: plataformas e perigos podem ser consumidos ou animados sem alterar o template da próxima partida.

`Game.startLevel()` recebe essa instância, posiciona a jogadora no spawn, restaura o estado da partida e atualiza o HUD. Em cada quadro, `Game.update()` move os obstáculos móveis, aplica movimento e colisões nas plataformas, verifica coleta dos morangos, ativa checkpoints e compara a personagem aos hitboxes de espinhos e obstáculos.

O layout é inteiramente declarativo no template: plataformas com altura maior que 24 são sólidas também nas laterais; as de altura 24 são passáveis por baixo e aterrissáveis por cima. Espinhos e obstáculos móveis causam dano e levam ao último checkpoint; o objetivo encerra a fase. O renderizador desenha os mesmos arrays, sem modificar a lógica nem os dados da fase.

## Passo a Passo

1. **[Orquestração]** — `src/main.js` → callback `onSelectLevel`
   Depois de validar que a fase está desbloqueada, cria uma nova instância com `createLevel(levelNumber)` e entrega o resultado a `Game.startLevel()`.

2. **[Domínio — template]** — `src/level.js` → `LEVEL_TEMPLATES`
   Cada uma das quatro fases declara largura do mundo, ponto de spawn, tema, plataformas, oito morangos, espinhos, obstáculos móveis, checkpoints e objetivo. Os templates não são exportados.

3. **[Domínio — criação isolada]** — `src/level.js` → `createLevel(levelNumber)`
   Copia os arrays de plataformas e espinhos; converte morangos, obstáculos e checkpoints em objetos com estado de runtime; e copia spawn, metadata e objetivo. Uma fase inexistente lança erro.

4. **[Jogo — inicialização]** — `src/game.js` → `Game.startLevel(level)`
   Define o nível atual, coloca a jogadora no spawn, limpa câmera, tempo e flags de vitória, e exibe os metadados e o total de morangos na interface.

5. **[Jogo — deslocamento]** — `src/game.js` → `Game.updateMovingObstacles()` / `Game.moveAndCollide(dt)`
   Os obstáculos oscilam sobre seu eixo a partir de origem, distância, velocidade e fase. A jogadora colide com todas as plataformas no eixo vertical e com plataformas de altura superior a 24 também no eixo horizontal.

6. **[Jogo — interações]** — `src/game.js` → `Game.updateWorldInteractions()`
   Morangos sobrepostos são marcados como coletados; checkpoints próximos tornam-se ativos e atualizam o respawn; espinhos e obstáculos móveis aplicam dano; cruzar o limite do objetivo chama `Game.finish()`.

7. **[Apresentação]** — `src/renderer.js` → `Renderer.drawLevel()`
   Desenha plataformas, espinhos, obstáculos móveis, morangos, checkpoints e objetivo recebidos do estado atual do jogo, com paleta determinada pelo tema.

### Caminhos alternativos

- **Fase inexistente:** `src/level.js` lança `Error('Fase desconhecida: ...')`; a criação não retorna um layout parcial.
- **Queda ou contato com perigo:** `src/game.js` → `Game.hurt()` reduz uma vida, reposiciona a jogadora no último checkpoint e, quando as vidas chegam a zero, restaura a quantidade inicial antes do respawn.
- **Objetivo final:** `src/game.js` → `Game.finish()` emite a conclusão uma única vez. Fases 1–3 usam `exit`; a fase 4 usa `rescue` e inicia a sequência final.

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Orquestração | `src/main.js` | Cria e inicia uma fase após a seleção liberada. |
| Domínio | `src/level.js` | Mantém templates privados e gera uma instância mutável por tentativa. |
| Domínio | `src/game.js` | Atualiza física, colisão, dano, coleta, checkpoints e finalização usando os dados da fase. |
| Apresentação | `src/renderer.js` | Desenha o layout e seus estados visuais no canvas. |
| Configuração | `src/config.js` | Define física, dimensões do mundo base, estado da personagem e metadados de campanha. |
| Testes | `tests/levels.test.js` | Confere estado completo, diversidade e independência das instâncias de fase. |

## Regras de Negócio Relevantes

- **Instâncias independentes por tentativa** — `src/level.js`: arrays e objetos do template são copiados antes de chegarem ao jogo, evitando que coleta, ativação de checkpoint ou animação contaminem uma nova partida.
- **Oito morangos por fase** — `src/level.js` e `tests/levels.test.js`: cada template contém oito posições e o HUD exibe o total recebido no nível.
- **Checkpoint redefine o respawn** — `src/game.js`: o primeiro contato válido com cada checkpoint o ativa e define o próximo respawn acima de sua posição.
- **Perigo provoca respawn, não game over imediato** — `src/game.js`: espinhos, obstáculos móveis e queda chamam `hurt()`; as vidas são restauradas ao chegar a zero e a partida continua do checkpoint.
- **Resgate apenas na fase 4** — `src/level.js`: os três primeiros objetivos são saídas; apenas o quarto é `rescue`.

## Observações

- Os templates declaram coordenadas absolutas em arrays compactos, sem nomes de trechos ou validação automática de alcance entre plataformas; por isso, a intenção de cada sequência e a progressão de dificuldade precisam ser inferidas das posições.
- `tests/levels.test.js` valida estrutura e isolamento, mas não mede saltos, zonas seguras ou sobreposição entre perigos; a jogabilidade de um layout permanece uma verificação manual no navegador.
