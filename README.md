# Thaissa — Missão de resgate

Platformer 2D em HTML Canvas, CSS e JavaScript modular.

## Executar

Módulos ES precisam ser servidos por HTTP. Na raiz do projeto, execute:

```bash
python3 -m http.server 8080
```

Depois abra `http://localhost:8080`.

## Arquitetura

```text
index.html               interface e canvas
style.css                apresentação da página e HUD
game.js                  ponto de entrada estável
src/
├── main.js              composição das dependências e game loop
├── config.js            viewport, física, assets e recortes de sprites
├── level.js             dados e fábrica da fase
├── game.js              estado, regras, física e progressão
├── renderer.js          renderização de cenário, personagens e efeitos
├── ui.js                HUD, overlays, mensagens e botões
└── core/
    ├── assets.js        carregamento assíncrono de imagens
    ├── audio.js         efeitos sonoros
    ├── collision.js     detecção de colisões
    └── input.js         teclado e ponteiro
```

As dependências são montadas apenas em `src/main.js`. O motor não consulta o DOM diretamente: `GameUI`, `InputController`, `SoundManager` e `Renderer` são injetados no jogo.
