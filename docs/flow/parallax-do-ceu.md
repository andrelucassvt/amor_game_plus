---
generated_at: 2026-08-09
source_commit: ad09858
source_state: dirty
verified_at: 2026-08-09
status: current
related_plans: []
---

# Flow: Parallax do céu

> **Resumo:** A cada quadro da partida, o tema da fase seleciona um conjunto de camadas ilustradas de céu que é carregado no bootstrap e deslocado em velocidades distintas conforme a câmera avança.

## Visão Geral

Durante o bootstrap, `src/main.js` passa o manifesto de assets para `loadAssets()`, que carrega os sprites e as imagens de céu antes de criar o `Renderer`. Cada tema de fase possui um conjunto declarado em `SKY_PARALLAX`: floresta usa `Clouds 4`, vale usa `Clouds 6`, noite usa `Clouds 3` e fortaleza usa `Clouds 8`.

No loop de animação, `Renderer.draw()` recebe o estado atual do `Game`. O tema vem da fase ativa (ou `forest` antes de iniciar uma partida) e determina as camadas que `drawSky()` desenha antes do mundo. Cada camada repete horizontalmente e recebe um deslocamento proporcional à câmera, produzindo profundidade sem alterar a física, colisões ou estado das fases.

## Passo a Passo

1. **[Configuração]** — `src/config.js` → `ASSET_MANIFEST` e `SKY_PARALLAX`
   Declara cada arquivo de céu carregável e associa, para cada tema, as chaves das camadas na ordem de desenho e suas velocidades de parallax.
2. **[Carregamento de assets]** — `src/main.js` → `bootstrap()` → `loadAssets(ASSET_MANIFEST)`
   Carrega todas as imagens antes de construir o jogo; o objeto resultante chega ao `Renderer` pelo construtor.
3. **[Loop de apresentação]** — `src/main.js` → `requestAnimationFrame(loop)` → `renderer.draw(game)`
   A cada quadro, aciona o renderizador com a câmera e a fase mantidas pelo `Game`.
4. **[Renderização]** — `src/renderer.js` → `Renderer.draw()`
   Obtém `game.level.theme`, chama `drawSky(game.cameraX, theme)` e só depois translada o canvas para desenhar plataformas, itens, objetivo e personagem.
5. **[Parallax]** — `src/renderer.js` → `Renderer.drawSky()`
   Recupera as camadas do tema, calcula `cameraX * speed` e desenha cópias contíguas de cada imagem na largura e altura do viewport para manter o céu preenchido durante o deslocamento.

### Caminhos alternativos

- **Sem fase iniciada:** `Renderer.draw()` usa o tema `forest`, mantendo um céu disponível por trás dos menus.
- **Tema não mapeado:** `Renderer.drawSky()` usa `SKY_PARALLAX.forest` como fallback visual.
- **Falha ao carregar qualquer imagem:** `loadAssets()` rejeita; o `catch` de `bootstrap()` em `src/main.js` mostra o erro de carregamento pela interface e não inicia a partida.

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Configuração | `src/config.js` | Mantém os caminhos dos arquivos e a associação entre tema, ordem e velocidade das camadas. |
| Assets | `Assets/Background/Clouds/Clouds 3`, `Clouds 4`, `Clouds 6`, `Clouds 8` | Fornecem as imagens RGBA que compõem os quatro céus. |
| Orquestração | `src/main.js` | Carrega o manifesto, instancia o renderizador e chama o desenho em cada quadro. |
| Serviço | `src/core/assets.js` | Converte os caminhos do manifesto em instâncias de `Image` e propaga erros de leitura. |
| Apresentação | `src/renderer.js` | Escolhe e desenha as camadas com deslocamentos diferentes. |
| Testes | `tests/levels.test.js` | Verifica que cada tema aponta para um conjunto existente, completo e ordenado de camadas. |

## Regras de Negócio Relevantes

Nenhuma regra de negócio relevante além do controle de fluxo padrão. A seleção do céu é puramente visual e segue o tema já atribuído a cada fase.

## Observações

- O carregamento é bloqueante para todos os assets do manifesto: uma imagem de céu ausente impede o bootstrap da mesma forma que um sprite ausente.
- As imagens têm a mesma proporção do viewport lógico (16:9) e são desenhadas em cópias horizontais para evitar áreas vazias durante o movimento da câmera.
