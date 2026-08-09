---
generated_at: 2026-08-09
source_commit: 1e38217
source_state: dirty
verified_at: 2026-08-09
status: current
related_plans: []
---

# Estrutura do Projeto: Thaissa — Missão de resgate

> **Resumo:** Jogo de plataforma 2D para navegador, implementado com HTML, CSS, JavaScript modular e Canvas 2D, com composição centralizada e módulos separados para regras, fase, renderização, interface e serviços do navegador.

## Stack e Tecnologias

| Elemento | Valor |
|----------|-------|
| Linguagem | JavaScript (módulos ES), HTML5 e CSS |
| Framework | Nenhum; usa APIs nativas do navegador e Canvas 2D |
| Gerenciador de pacotes | Nenhum manifesto ou gerenciador de pacotes no repositório |
| Principais dependências | DOM, Canvas 2D, Web Audio API e `requestAnimationFrame` |

## Arquitetura

`index.html` monta a interface e carrega o ponto de entrada estável `game.js`, que importa `src/main.js`. O `bootstrap` de `src/main.js` carrega os sprites, cria a fase, instancia interface, entrada, áudio, renderizador e jogo, conecta os eventos e inicia o loop com `requestAnimationFrame`. A classe `Game` concentra estado e regras; `Renderer` apenas desenha o estado recebido, enquanto `GameUI`, `InputController` e `SoundManager` encapsulam as integrações com o navegador.

```text
index.html → game.js → src/main.js (bootstrap e composição)
                              ├─ createLevel() → Game.update(dt)
eventos de UI/entrada ────────┤                    │
                              ├─ GameUI / SoundManager
                              └─ requestAnimationFrame → Renderer.draw(game)
```

### Regras de dependência

- `src/main.js` é o ponto de composição: cria as dependências e as injeta em `Game`.
- `src/game.js` não consulta o DOM nem o canvas; interage com entrada, áudio e interface pelos objetos recebidos no construtor.
- `src/renderer.js` consome o estado público de `Game` e não altera as regras da partida.
- `src/level.js` cria novos objetos mutáveis a partir de templates internos, permitindo que `Game.reset()` restaure itens e checkpoints sem alterar os templates.
- Constantes de viewport, física, sprites e assets ficam centralizadas em `src/config.js`.

## Features

| Feature | Caminho principal | Descrição resumida |
|---------|------------------|-------------------|
| Jogabilidade e progressão | `src/game.js` | Controla início, pausa, movimento, pulo, colisões, coleta de morangos, dano, respawn, checkpoints, câmera e conclusão da missão. |
| Fase 1–1 | `src/level.js` | Define plataformas, oito morangos, espinhos, obstáculos móveis, checkpoints e o objetivo da fase. |
| Apresentação visual e animações | `src/renderer.js` | Desenha cenário, elementos da fase, personagens, câmera, pausa e sequência final no Canvas 2D. |
| Interface e HUD | `src/ui.js` | Controla telas de introdução e encerramento, contadores, mensagens e botões de início, reinício, pausa e som. |

## Camadas / Módulos Compartilhados

| Tipo | Caminho | Responsabilidade |
|------|---------|-----------------|
| Carregamento de assets | `src/core/assets.js` | Carrega de forma assíncrona as imagens descritas no manifesto e propaga falhas de carregamento. |
| Áudio | `src/core/audio.js` | Mantém o estado do som e gera efeitos e a sequência de vitória com Web Audio API. |
| Colisão | `src/core/collision.js` | Implementa sobreposição entre retângulos e filtra colisões com plataformas. |
| Entrada | `src/core/input.js` | Converte teclado e toque/clique no canvas em eixo horizontal, pedido de pulo e pausa. |
| Assets visuais | `Assets/` | Armazena sprites de personagens e coleções de imagens de terreno, itens, inimigos e armadilhas. |
| Estilos da página | `style.css` | Define layout responsivo, HUD, overlays, botões, tipografia e preferências de movimento reduzido. |

## Configuração

| Componente | Arquivo | Responsabilidade |
|-----------|---------|-----------------|
| Documento e shell do jogo | `index.html` | Declara canvas, HUD, overlays, controles, fontes e o módulo de entrada do navegador. |
| Ponto de entrada estável | `game.js` | Encaminha a execução para `src/main.js`. |
| Bootstrap e composição | `src/main.js` | Carrega assets, instancia módulos, conecta callbacks e executa os ciclos de atualização e desenho. |
| Constantes e manifesto | `src/config.js` | Centraliza viewport, mundo, física, estado inicial, sequência final, caminhos e recortes de sprites. |

## Dependências Externas Principais

| Pacote | Versão | Uso no projeto |
|--------|--------|---------------|
| Google Fonts: Fredoka e DM Mono | Não fixada | Fontes carregadas por `index.html` para interface, HUD e textos desenhados no canvas. |

## Observações

- O projeto não possui manifesto de dependências, etapa de build, roteamento, contêiner de injeção de dependência nem suíte de testes automatizados.
- Por usar módulos ES, o README orienta servir a raiz por HTTP com `python3 -m http.server 8080`; esse comando não foi executado durante a análise.
- O runtime carrega somente os quatro sprites declarados em `ASSET_MANIFEST`; as demais imagens de `Assets/` não são referenciadas pelo código atual.
- A origem analisada estava com alterações locais não rastreadas em `.agents/`, `.claude/` e `sync-brain.sh`, por isso `source_state` está marcado como `dirty`.
