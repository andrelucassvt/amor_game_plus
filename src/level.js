import { CAMPAIGN, WORLD } from './config.js';

const LEVEL_TEMPLATES = {
  1: {
    worldWidth: 4050,
    spawn: { x: 130, y: 340 },
    theme: 'forest',
    platforms: [
      [0,623,610,97], [660,623,430,97], [1150,623,540,97], [1760,623,490,97], [2320,623,620,97], [3010,623,1040,97],
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
      [1260,475], [1480,410], [1840,470], [3560,350],
    ],
    spikes: [
      [450,607,2],
      [820,607,2], [990,607,2],
      [1510,607,2],
      [2020,607,2], [2170,607,2],
      [2730,607,2],
      [3260,607,2], [3670,607,2],
    ],
    movingObstacles: [
      { originX: 1325, originY: 568, axis: 'x', distance: 65, speed: 1.05, phase: 0.4 },
      { originX: 2645, originY: 565, axis: 'y', distance: -80, speed: 0.9, phase: 1.7 },
      { originX: 3470, originY: 568, axis: 'x', distance: 75, speed: 1.1, phase: 3.1 },
    ],
    checkpoints: [
      { x: 1785, y: 435 },
      { x: 3045, y: 435 },
    ],
    goal: { x: 3870, y: 355, type: 'exit' },
  },

  2: {
    worldWidth: 4300,
    spawn: { x: 130, y: 340 },
    theme: 'vale',
    platforms: [
      [0,623,560,97], [640,623,480,97], [1200,623,520,97], [1800,623,500,97], [2380,623,620,97], [3080,623,1220,97],
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
      [3280,607,2], [3500,607,2], [3740,607,2],
    ],
    movingObstacles: [
      { originX: 760, originY: 565, axis: 'y', distance: -90, speed: 1.05, phase: 0.5 },
      { originX: 1495, originY: 568, axis: 'x', distance: 70, speed: 1.2, phase: 1.4 },
      { originX: 2700, originY: 568, axis: 'x', distance: 75, speed: 1.3, phase: 2.6 },
      { originX: 3580, originY: 565, axis: 'y', distance: -95, speed: 1.1, phase: 3.5 },
    ],
    checkpoints: [
      { x: 1825, y: 435 },
      { x: 3105, y: 435 },
    ],
    goal: { x: 4120, y: 355, type: 'exit' },
  },

  3: {
    worldWidth: 4400,
    spawn: { x: 130, y: 340 },
    theme: 'night',
    platforms: [
      [0,623,520,97], [600,623,450,97], [1130,623,490,97], [1700,623,460,97], [2240,623,520,97], [2840,623,560,97], [3480,623,920,97],
      // A rota noturna exige três degraus, mas preserva pousos largos.
      [160,520,135,24], [355,455,130,24],
      [625,515,140,24], [835,450,135,24], [1025,390,125,24],
      [1170,515,140,24], [1380,450,135,24], [1560,385,125,24],
      // Centro: pares de perigos alternam com uma plataforma de recuperação.
      [1735,515,140,24], [1950,450,135,24], [2140,390,125,24],
      [2265,515,140,24], [2485,450,135,24], [2670,385,125,24],
      [2875,515,140,24], [3090,450,135,24], [3280,390,125,24],
      // Fechamento: rota alta opcional para chegar à saída com segurança.
      [3515,515,140,24], [3730,450,135,24], [3930,385,135,24],
    ],
    berries: [
      [210,475], [400,410], [685,470], [895,405],
      [1085,345], [1435,405], [2005,405], [3980,340],
    ],
    spikes: [
      [425,607,2],
      [760,607,2], [955,607,2],
      [1260,607,2], [1480,607,2],
      [1875,607,2], [2075,607,2],
      [2430,607,2], [2620,607,2],
      [3015,607,2], [3210,607,2],
      [3650,607,2], [3850,607,2], [4080,607,2],
    ],
    movingObstacles: [
      { originX: 1035, originY: 565, axis: 'y', distance: -100, speed: 1.1, phase: 0.3 },
      { originX: 1455, originY: 568, axis: 'x', distance: 80, speed: 1.3, phase: 1.1 },
      { originX: 2015, originY: 568, axis: 'x', distance: 70, speed: 1.4, phase: 2.0 },
      { originX: 2635, originY: 565, axis: 'y', distance: -95, speed: 1.25, phase: 2.9 },
      { originX: 3190, originY: 568, axis: 'x', distance: 85, speed: 1.35, phase: 3.7 },
      { originX: 3855, originY: 565, axis: 'y', distance: -105, speed: 1.2, phase: 4.4 },
    ],
    checkpoints: [
      { x: 1735, y: 435 },
      { x: 3515, y: 435 },
    ],
    goal: { x: 4220, y: 355, type: 'exit' },
  },

  4: {
    worldWidth: 4700,
    spawn: { x: 130, y: 340 },
    theme: 'fortress',
    platforms: [
      [0,623,500,97], [580,623,440,97], [1100,623,470,97], [1650,623,440,97], [2170,623,500,97], [2750,623,580,97],
      [3410,623,500,97], [3990,623,710,97],
      // Fortaleza: preparação curta antes das sequências de três degraus.
      [150,520,135,24], [345,455,130,24],
      [610,515,140,24], [815,450,135,24], [995,390,125,24],
      [1140,515,140,24], [1350,450,135,24], [1530,385,125,24],
      // Centro: desafios densos, separados por pousos largos no solo.
      [1685,515,140,24], [1895,450,135,24], [2080,390,125,24],
      [2205,515,140,24], [2420,450,135,24], [2605,385,125,24],
      [2785,515,140,24], [3000,450,135,24], [3190,390,125,24],
      // Último trecho: a rota alta conduz ao resgate.
      [3445,515,140,24], [3660,450,135,24], [3850,385,125,24], [4070,450,140,24],
    ],
    berries: [
      [195,475], [390,410], [670,470], [870,405],
      [1055,345], [1410,405], [1955,405], [3905,340],
    ],
    spikes: [
      [350,607,2],
      [735,607,2], [910,607,2],
      [1215,607,2], [1425,607,2],
      [1815,607,2], [2015,607,2],
      [2350,607,2], [2550,607,2],
      [2920,607,2], [3120,607,2],
      [3550,607,2], [3760,607,2], [4210,607,2],
    ],
    movingObstacles: [
      { originX: 830, originY: 565, axis: 'y', distance: -100, speed: 1.2, phase: 0.2 },
      { originX: 1410, originY: 568, axis: 'x', distance: 85, speed: 1.4, phase: 1.1 },
      { originX: 1940, originY: 568, axis: 'x', distance: 80, speed: 1.5, phase: 2.0 },
      { originX: 2535, originY: 565, axis: 'y', distance: -105, speed: 1.55, phase: 2.9 },
      { originX: 3110, originY: 568, axis: 'x', distance: 90, speed: 1.35, phase: 3.8 },
      { originX: 3760, originY: 565, axis: 'y', distance: -110, speed: 1.4, phase: 4.6 },
    ],
    checkpoints: [
      { x: 1685, y: 435 },
      { x: 3445, y: 435 },
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
