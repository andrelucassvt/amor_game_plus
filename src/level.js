import { CAMPAIGN, WORLD } from './config.js';

const LEVEL_TEMPLATES = {
  // Fase 1 — introdução: fossos curtos (50–60), poucos espinhos, dois
  // obstáculos lentos e checkpoints logo após cada travessia importante.
  1: {
    worldWidth: 4050,
    spawn: { x: 130, y: 340 },
    theme: 'forest',
    platforms: [
      [0,623,610,97], [670,623,430,97], [1150,623,540,97], [1750,623,500,97], [2310,623,630,97], [3000,623,1050,97],
      // Abertura: saltos baixos para apresentar a rota elevada.
      [220,520,140,24], [420,465,130,24],
      // Travessias centrais: uma plataforma baixa e outra mais alta por trecho.
      [710,520,140,24], [925,465,135,24],
      [1210,520,145,24], [1430,455,135,24],
      [1785,515,140,24], [2005,450,140,24],
      [2375,515,140,24], [2595,450,140,24],
      // Reta final: escada suave para a saída.
      [3050,515,145,24], [3280,455,140,24], [3510,395,140,24], [3740,455,145,24],
    ],
    berries: [
      [270,475], [465,420], [760,475], [975,420],
      [1260,475], [1480,410], [2050,405], [3560,350],
    ],
    spikes: [
      [450,607,2],
      [830,607,2],
      [1510,607,2],
      [2060,607,2],
      [2650,607,2],
      [3320,607,2],
    ],
    movingObstacles: [
      { originX: 2440, originY: 568, axis: 'x', distance: 60, speed: 0.85, phase: 0.4 },
      { originX: 3470, originY: 568, axis: 'x', distance: 70, speed: 0.95, phase: 2.2 },
    ],
    checkpoints: [
      { x: 1180, y: 460 },
      { x: 1770, y: 460 },
      { x: 3020, y: 460 },
    ],
    goal: { x: 3870, y: 355, type: 'exit' },
  },

  // Fase 2 — intermediária: fossos de 70–80, pares de espinhos por trecho e
  // quatro obstáculos moderados que nunca se sobrepõem aos espinhos.
  2: {
    worldWidth: 4300,
    spawn: { x: 130, y: 340 },
    theme: 'vale',
    platforms: [
      [0,623,560,97], [630,623,490,97], [1200,623,520,97], [1800,623,500,97], [2380,623,620,97], [3080,623,1220,97],
      // Abertura: uma escada curta, seguida de uma travessia dupla.
      [180,520,140,24], [390,455,130,24],
      [690,520,145,24], [905,450,135,24], [1050,390,120,24],
      // Meio: rotas elevadas para cruzar pares de espinhos.
      [1230,515,145,24], [1450,450,140,24], [1630,390,125,24],
      [1830,515,140,24], [2045,450,140,24],
      [2410,515,145,24], [2635,445,140,24], [2820,385,130,24],
      // Final: desafio contínuo, mas com patamares de recuperação.
      [3110,515,145,24], [3340,450,140,24], [3570,390,135,24], [3800,455,145,24],
    ],
    berries: [
      [230,475], [435,410], [745,475], [960,405],
      [1290,470], [1510,405], [2105,405], [3630,345],
    ],
    spikes: [
      [405,607,2],
      [830,607,2], [1005,607,2],
      [1330,607,2], [1545,607,2],
      [1985,607,2], [2160,607,2],
      [2580,607,2], [2815,607,2],
      [3500,607,2], [3740,607,2],
    ],
    movingObstacles: [
      { originX: 760, originY: 565, axis: 'y', distance: -90, speed: 1.0, phase: 0.5 },
      { originX: 1400, originY: 568, axis: 'x', distance: 60, speed: 1.05, phase: 1.4 },
      { originX: 2680, originY: 568, axis: 'x', distance: 60, speed: 1.15, phase: 2.6 },
      { originX: 3640, originY: 565, axis: 'y', distance: -95, speed: 1.1, phase: 3.5 },
    ],
    checkpoints: [
      { x: 1220, y: 460 },
      { x: 2400, y: 460 },
      { x: 3100, y: 460 },
    ],
    goal: { x: 4120, y: 355, type: 'exit' },
  },

  // Fase 3 — avançada: fossos de 90, catorze grupos de espinhos (um triplo) e
  // obstáculos rápidos; a rota elevada de três degraus vira o caminho seguro.
  3: {
    worldWidth: 4400,
    spawn: { x: 130, y: 340 },
    theme: 'night',
    platforms: [
      [0,623,520,97], [610,623,440,97], [1140,623,480,97], [1710,623,450,97], [2250,623,510,97], [2850,623,550,97], [3490,623,910,97],
      // A rota noturna exige três degraus, mas preserva pousos largos.
      [160,520,135,24], [355,455,130,24],
      [625,515,140,24], [835,450,135,24], [1025,390,125,24],
      [1180,515,140,24], [1390,450,135,24], [1570,385,125,24],
      // Centro: pares de perigos alternam com uma plataforma de recuperação.
      [1745,515,140,24], [1955,450,135,24], [2145,390,125,24],
      [2275,515,140,24], [2495,450,135,24], [2680,385,125,24],
      [2885,515,140,24], [3100,450,135,24], [3290,390,125,24],
      // Fechamento: rota alta opcional para chegar à saída com segurança.
      [3525,515,140,24], [3740,450,135,24], [3940,385,135,24],
    ],
    berries: [
      [210,475], [400,410], [695,470], [905,405],
      [1085,345], [1445,405], [2015,405], [3990,340],
    ],
    spikes: [
      [420,607,2],
      [755,607,2], [950,607,2],
      [1270,607,2], [1490,607,2],
      [1880,607,2], [2070,607,2],
      [2440,607,2], [2620,607,2],
      [3020,607,2], [3210,607,2],
      [3660,607,2], [3860,607,3], [4090,607,2],
    ],
    movingObstacles: [
      { originX: 1035, originY: 565, axis: 'y', distance: -100, speed: 1.15, phase: 0.3 },
      { originX: 1330, originY: 568, axis: 'x', distance: 55, speed: 1.25, phase: 1.1 },
      { originX: 1950, originY: 568, axis: 'x', distance: 55, speed: 1.3, phase: 2.0 },
      { originX: 2680, originY: 565, axis: 'y', distance: -100, speed: 1.25, phase: 2.9 },
      { originX: 3120, originY: 565, axis: 'y', distance: -95, speed: 1.3, phase: 3.7 },
    ],
    checkpoints: [
      { x: 1160, y: 460 },
      { x: 2270, y: 460 },
      { x: 3510, y: 460 },
    ],
    goal: { x: 4220, y: 355, type: 'exit' },
  },

  // Fase 4 — final: fossos de 100, quinze grupos de espinhos (três triplos) e
  // sete obstáculos velozes; quatro checkpoints amparam a reta do resgate.
  4: {
    worldWidth: 4700,
    spawn: { x: 130, y: 340 },
    theme: 'fortress',
    platforms: [
      [0,623,500,97], [600,623,430,97], [1130,623,450,97], [1680,623,440,97], [2220,623,480,97], [2800,623,530,97],
      [3430,623,470,97], [4000,623,700,97],
      // Fortaleza: preparação curta antes das sequências de três degraus.
      [150,520,135,24], [345,455,130,24],
      [615,515,140,24], [820,450,135,24], [1000,390,130,24],
      [1150,515,140,24], [1360,450,135,24], [1540,385,130,24],
      // Centro: desafios densos, separados por pousos largos no solo.
      [1700,515,140,24], [1910,450,135,24], [2090,385,130,24],
      [2240,515,140,24], [2455,450,135,24], [2640,385,130,24],
      [2820,515,140,24], [3035,450,135,24], [3225,390,130,24],
      // Último trecho: a rota alta conduz ao resgate.
      [3450,515,140,24], [3660,450,135,24], [3850,385,130,24], [4080,450,140,24],
    ],
    berries: [
      [195,475], [390,410], [675,470], [880,405],
      [1060,345], [1420,405], [1965,405], [3910,340],
    ],
    spikes: [
      [365,607,2],
      [730,607,2], [920,607,2],
      [1240,607,2], [1450,607,3],
      [1800,607,2], [2000,607,2],
      [2330,607,3], [2540,607,2],
      [2930,607,2], [3120,607,3],
      [3560,607,2], [3760,607,2],
      [4150,607,2], [4330,607,3],
    ],
    movingObstacles: [
      { originX: 845, originY: 565, axis: 'y', distance: -100, speed: 1.3, phase: 0.2 },
      { originX: 1340, originY: 568, axis: 'x', distance: 55, speed: 1.4, phase: 1.1 },
      { originX: 1955, originY: 565, axis: 'y', distance: -105, speed: 1.45, phase: 2.0 },
      { originX: 2420, originY: 568, axis: 'x', distance: 55, speed: 1.5, phase: 2.9 },
      { originX: 3000, originY: 565, axis: 'y', distance: -105, speed: 1.5, phase: 3.6 },
      { originX: 3620, originY: 568, axis: 'x', distance: 55, speed: 1.4, phase: 4.3 },
      { originX: 4230, originY: 565, axis: 'y', distance: -110, speed: 1.55, phase: 5.0 },
    ],
    checkpoints: [
      { x: 1150, y: 460 },
      { x: 2240, y: 460 },
      { x: 3450, y: 460 },
      { x: 4020, y: 460 },
    ],
    goal: { x: 4500, y: 355, type: 'rescue' },
  },
};

export function createLevel(levelNumber) {
  const template = LEVEL_TEMPLATES[levelNumber];
  if (!template) throw new Error(`Fase desconhecida: ${levelNumber}`);

  return {
    metadata: { ...CAMPAIGN.levels[levelNumber - 1] },
    world: { ...WORLD, width: template.worldWidth },
    spawn: { ...template.spawn },
    theme: template.theme,
    platforms: template.platforms.map(platform => [...platform]),
    berries: template.berries.map(([x, y], index) => ({
      x,
      y,
      taken: false,
      bob: index * 0.87,
    })),
    spikes: template.spikes.map(spike => [...spike]),
    movingObstacles: template.movingObstacles.map(obstacle => ({
      ...obstacle,
      x: obstacle.originX,
      y: obstacle.originY,
      w: 42,
      h: 42,
      angle: 0,
    })),
    checkpoints: template.checkpoints.map(checkpoint => ({
      ...checkpoint,
      active: false,
    })),
    goal: { ...template.goal },
  };
}
