export const VIEWPORT = Object.freeze({
  width: 1280,
  height: 720,
  maxPixelRatio: 2,
});

export const WORLD = Object.freeze({
  width: 4050,
  floor: 623,
});

export const PHYSICS = Object.freeze({
  groundAcceleration: 2200,
  airAcceleration: 1150,
  maxSpeed: 310,
  gravity: 1680,
  maxFallSpeed: 900,
  jumpSpeed: 680,
  coyoteTime: 0.11,
  jumpBufferTime: 0.13,
  groundFriction: 0.0005,
  airFriction: 0.018,
});

export const PLAYER_INITIAL = Object.freeze({
  x: 130,
  y: 340,
  w: 57,
  h: 94,
  lives: 3,
});

export const ASSET_MANIFEST = Object.freeze({
  thaissa: 'Assets/sprites/thaissa-movement.png',
  action: 'Assets/sprites/thaissa-actions.png',
  andre: 'Assets/sprites/andre-captive.png',
  kiss: 'Assets/sprites/andre-thaissa-kiss.png',
  skyForest1: 'Assets/Background/Clouds/Clouds 1/1.png',
  skyForest2: 'Assets/Background/Clouds/Clouds 1/2.png',
  skyForest3: 'Assets/Background/Clouds/Clouds 1/3.png',
  skyForest4: 'Assets/Background/Clouds/Clouds 1/4.png',
  skyVale1: 'Assets/Background/Clouds/Clouds 6/1.png',
  skyVale2: 'Assets/Background/Clouds/Clouds 6/2.png',
  skyVale3: 'Assets/Background/Clouds/Clouds 6/3.png',
  skyVale4: 'Assets/Background/Clouds/Clouds 6/4.png',
  skyVale5: 'Assets/Background/Clouds/Clouds 6/5.png',
  skyVale6: 'Assets/Background/Clouds/Clouds 6/6.png',
  skyNight1: 'Assets/Background/Clouds/Clouds 3/1.png',
  skyNight2: 'Assets/Background/Clouds/Clouds 3/2.png',
  skyNight3: 'Assets/Background/Clouds/Clouds 3/3.png',
  skyNight4: 'Assets/Background/Clouds/Clouds 3/4.png',
  skyFortress1: 'Assets/Background/Clouds/Clouds 8/1.png',
  skyFortress2: 'Assets/Background/Clouds/Clouds 8/2.png',
  skyFortress3: 'Assets/Background/Clouds/Clouds 8/3.png',
  skyFortress4: 'Assets/Background/Clouds/Clouds 8/4.png',
  skyFortress5: 'Assets/Background/Clouds/Clouds 8/5.png',
  skyFortress6: 'Assets/Background/Clouds/Clouds 8/6.png',
});

export const SKY_PARALLAX = Object.freeze({
  forest: Object.freeze([
    Object.freeze({ asset: 'skyForest1', speed: 0.02 }),
    Object.freeze({ asset: 'skyForest2', speed: 0.05 }),
    Object.freeze({ asset: 'skyForest3', speed: 0.1 }),
    Object.freeze({ asset: 'skyForest4', speed: 0.17 }),
  ]),
  vale: Object.freeze([
    Object.freeze({ asset: 'skyVale1', speed: 0.02 }),
    Object.freeze({ asset: 'skyVale2', speed: 0.045 }),
    Object.freeze({ asset: 'skyVale3', speed: 0.08 }),
    Object.freeze({ asset: 'skyVale4', speed: 0.12 }),
    Object.freeze({ asset: 'skyVale5', speed: 0.17 }),
    Object.freeze({ asset: 'skyVale6', speed: 0.23 }),
  ]),
  night: Object.freeze([
    Object.freeze({ asset: 'skyNight1', speed: 0.02 }),
    Object.freeze({ asset: 'skyNight2', speed: 0.055 }),
    Object.freeze({ asset: 'skyNight3', speed: 0.11 }),
    Object.freeze({ asset: 'skyNight4', speed: 0.18 }),
  ]),
  fortress: Object.freeze([
    Object.freeze({ asset: 'skyFortress1', speed: 0.02 }),
    Object.freeze({ asset: 'skyFortress2', speed: 0.045 }),
    Object.freeze({ asset: 'skyFortress3', speed: 0.08 }),
    Object.freeze({ asset: 'skyFortress4', speed: 0.12 }),
    Object.freeze({ asset: 'skyFortress5', speed: 0.17 }),
    Object.freeze({ asset: 'skyFortress6', speed: 0.23 }),
  ]),
});

export const ENDING_SEQUENCE = Object.freeze({
  rescueFrameDuration: 0.55,
  rescueDuration: 3.3,
  kissFrameDuration: 0.7,
  duration: 7.5,
});

export const CAMPAIGN = Object.freeze({
  totalLevels: 4,
  storageKey: 'thaissa.campaign.completedLevel',
  levels: Object.freeze([
    Object.freeze({
      number: 1,
      name: 'Encontro em Salvaterra',
      chapter: 'Capítulo 01 · O começo da nossa história',
      description: 'A praia, a chuva, o sorvete e uma conversa que nunca faltou: foi assim que tudo começou.',
      intro: 'Reviva o dia em que tudo começou: Salvaterra, chuva e um sorvete.',
      theme: 'forest',
    }),
    Object.freeze({
      number: 2,
      name: 'O Primeiro Beijo',
      chapter: 'Capítulo 02 · Nosso primeiro beijo',
      description: 'Na piscina da Pousada dos Guaras, os rostos se alinham e acontece o nosso primeiro beijo — depois dele, nenhuma dúvida.',
      intro: 'Reviva a noite do nosso primeiro beijo.',
      theme: 'vale',
    }),
    Object.freeze({
      number: 3,
      name: 'Noite da Saudade',
      chapter: 'Capítulo 03 · A saudade e a lua',
      description: 'A lua está no céu e a saudade aperta: a Terra não se sustenta sem a lua — e eu não me sustento sem você.',
      intro: 'Olhe para a lua e sinta a saudade: ele não para de pensar em você.',
      theme: 'night',
    }),
    Object.freeze({
      number: 4,
      name: 'O Texto Sem Fim',
      chapter: 'Capítulo 04 · O resgate e o nosso futuro',
      description: 'O último muro: ele está preso aqui, mas o nosso texto não tem fim — casamento, casa e uma vida inteira juntos.',
      intro: 'Resgate André: o nosso texto não tem fim.',
      theme: 'fortress',
    }),
  ]),
});

// The source images are illustrated contact sheets rather than strict grids.
// Explicit transparent-safe bounds prevent neighboring poses from appearing.
export const SPRITE_FRAMES = Object.freeze({
  thaissa: {
    idle: [96, 23, 129, 317],
    run: [
      [80, 364, 175, 273], [316, 358, 196, 280], [552, 359, 201, 279],
      [780, 360, 200, 275], [1026, 360, 173, 278], [1258, 362, 213, 265],
    ],
    jump: [
      [77, 710, 151, 239], [300, 651, 209, 269], [553, 650, 202, 226],
      [794, 667, 173, 254], [1023, 695, 179, 257], [1284, 714, 144, 237],
    ],
    rescue: [
      [63, 547, 170, 361], [309, 554, 221, 358], [559, 565, 222, 349],
      [826, 586, 124, 330], [1064, 550, 150, 366], [1305, 519, 142, 397],
    ],
  },
  andre: {
    captive: [
      [55, 27, 171, 478], [317, 30, 172, 476], [566, 27, 167, 478],
      [799, 38, 166, 469], [1026, 40, 188, 467], [1289, 29, 176, 477],
    ],
    rescue: [
      [63, 536, 185, 461], [320, 539, 173, 459], [532, 541, 200, 459],
      [803, 539, 194, 461], [1049, 539, 163, 461], [1270, 530, 189, 471],
    ],
  },
  kiss: [
    [0, 170, 350, 649], [351, 173, 349, 649], [713, 178, 327, 645],
    [1078, 184, 306, 641], [1419, 191, 298, 636], [1758, 190, 288, 639],
  ],
});
