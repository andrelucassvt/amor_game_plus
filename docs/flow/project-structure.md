---
generated_at: 2026-08-09
source_commit: 058451a
source_state: dirty
verified_at: 2026-08-09
status: current
related_plans:
  - docs/plan/campanha-quatro-fases.md
---

# Estrutura do Projeto: Thaissa — Missão de resgate

> **Resumo:** Jogo de plataforma 2D para navegador, implementado com HTML, CSS, JavaScript modular e Canvas 2D, com campanha de quatro fases sequenciais, composição centralizada e módulos separados para regras, fases, renderização, interface e serviços do navegador.

## Stack e Tecnologias

| Elemento | Valor |
|----------|-------|
| Linguagem | JavaScript (módulos ES), HTML5 e CSS |
| Framework | Nenhum; usa APIs nativas do navegador e Canvas 2D |
| Gerenciador de pacotes | Nenhum manifesto ou gerenciador de pacotes no repositório |
| Principais dependências | DOM, Canvas 2D, Web Audio API e `requestAnimationFrame` |

## Arquitetura

`index.html` monta a interface e carrega o ponto de entrada estável `game.js`, que importa `src/main.js`. O `bootstrap` de `src/main.js` carrega os sprites, lê o progresso da campanha do `localStorage` (com fallback em memória), instancia interface, entrada, áudio, renderizador e jogo, conecta a navegação e inicia o loop com `requestAnimationFrame`. A campanha alterna menu principal → menu de fases → partida → menu de fases: `Game` concentra o ciclo da partida, `src/campaign.js` concentra as regras puras de desbloqueio e persistência, `Renderer` apenas desenha o estado recebido, enquanto `GameUI`, `InputController` e `SoundManager` encapsulam as integrações com o navegador.

```text
index.html → game.js → src/main.js (bootstrap e composição)
                              ├─ src/campaign.js ──► localStorage
                              ├─ createLevel(n) → Game.startLevel(level)
eventos de UI/entrada ────────┤        │
                              ├─ GameUI / SoundManager
                              └─ requestAnimationFrame → Renderer.draw(game)
```

### Regras de dependência

- `src/main.js` é o ponto de composição: cria as dependências, mantém o progresso da campanha e conecta navegação, seleção de fase e retorno após conclusão.
- `src/campaign.js` é regra pura: não conhece DOM, canvas ou áudio; recebe o storage como dependência e faz leitura/escrita defensiva.
- `src/game.js` não consulta o DOM nem o canvas; interage com entrada, áudio e interface pelos objetos recebidos no construtor e emite a conclusão por callback abstrato.
- `src/renderer.js` consome o estado público de `Game` e não altera as regras da partida.
- `src/level.js` cria novos objetos mutáveis a partir de templates internos por fase, permitindo que cada partida reinicie itens e checkpoints sem alterar os templates.
- Constantes de viewport, física, sprites, assets e metadados da campanha ficam centralizadas em `src/config.js`.

## Features

| Feature | Caminho principal | Descrição resumida |
|---------|------------------|-------------------|
| Campanha e progressão de fases | `src/main.js` + `src/campaign.js` | Menu inicial, menu de fases com desbloqueio sequencial, repetição sem regressão, persistência no `localStorage` e retorno ao menu após conclusão. |
| Jogabilidade e progressão da partida | `src/game.js` | Controla início/troca de fase, pausa, movimento, pulo, colisões, coleta de morangos, dano, respawn, checkpoints, câmera e emissão única de conclusão. |
| Fases 1–4 | `src/level.js` | Quatro templates (Floresta do Coração, Vale das Promessas, Noite da Saudade e Fortaleza do Resgate) com plataformas, morangos, espinhos, obstáculos, checkpoints, tema e objetivo; saída nas fases 1–3 e resgate na fase 4. |
| Apresentação visual e animações | `src/renderer.js` | Desenha céu, cenário e plataformas por tema, elementos da fase, personagens, câmera, pausa, saída comum e a sequência de resgate exclusiva da fase 4. |
| Interface e HUD | `src/ui.js` | Alterna menu inicial, seleção de fases e partida; atualiza cartões, contadores, mensagens e o sprite cativo de André no cartão da fase 4. |

## Camadas / Módulos Compartilhados

| Tipo | Caminho | Responsabilidade |
|------|---------|-----------------|
| Campanha | `src/campaign.js` | Normaliza o progresso, calcula bloqueio/disponibilidade/conclusão, registra o maior nível e lê/escreve no storage com fallback seguro. |
| Carregamento de assets | `src/core/assets.js` | Carrega de forma assíncrona as imagens descritas no manifesto e propaga falhas de carregamento. |
| Áudio | `src/core/audio.js` | Mantém o estado do som e gera efeitos e a sequência de vitória com Web Audio API. |
| Colisão | `src/core/collision.js` | Implementa sobreposição entre retângulos e filtra colisões com plataformas. |
| Entrada | `src/core/input.js` | Converte teclado e toque/clique no canvas em eixo horizontal, pedido de pulo e pausa. |
| Assets visuais | `Assets/` | Armazena sprites de personagens e coleções de imagens de terreno, itens, inimigos e armadilhas. |
| Estilos da página | `style.css` | Define layout responsivo, overlays de menu, cartões de fase, HUD, botões, tipografia e preferências de movimento reduzido. |

## Configuração

| Componente | Arquivo | Responsabilidade |
|-----------|---------|-----------------|
| Documento e shell do jogo | `index.html` | Declara canvas, menus, cartões, HUD, overlays, controles, fontes e o módulo de entrada do navegador. |
| Ponto de entrada estável | `game.js` | Encaminha a execução para `src/main.js`. |
| Bootstrap e composição | `src/main.js` | Carrega assets, instancia módulos, mantém o progresso da campanha, conecta callbacks e executa os ciclos de atualização e desenho. |
| Constantes e manifesto | `src/config.js` | Centraliza viewport, mundo, física, estado inicial, sequência final, caminhos, recortes de sprites e a campanha (`CAMPAIGN`). |

## Dependências Externas Principais

| Pacote | Versão | Uso no projeto |
|--------|--------|---------------|
| Google Fonts: Fredoka e DM Mono | Não fixada | Fontes carregadas por `index.html` para interface, HUD e textos desenhados no canvas. |

## Observações

- O projeto não possui manifesto de dependências, etapa de build, roteamento ou contêiner de injeção de dependência.
- A suíte de testes usa o executor nativo do Node (`node --test`, sem novas dependências) em `tests/`, cobrindo campanha, níveis e ciclo da partida.
- Por usar módulos ES, o README orienta servir a raiz por HTTP com `python3 -m http.server 8080`; esse comando não foi executado durante a análise.
- O runtime carrega somente os quatro sprites declarados em `ASSET_MANIFEST`; as demais imagens de `Assets/` não são referenciadas pelo código atual.
- A origem analisada estava com alterações locais não rastreadas (implementação da campanha de quatro fases), por isso `source_state` está marcado como `dirty`.
