import { CAMPAIGN, WORLD } from './config.js';

const LEVEL_TEMPLATES = {
  1: {
    worldWidth: 4050,
    spawn: { x: 130, y: 340 },
    theme: 'forest',
    platforms: [
      [0,623,610,97], [660,623,430,97], [1150,623,540,97], [1760,623,490,97], [2320,623,620,97], [3010,623,1040,97],
      [250,498,150,24], [510,420,125,24], [740,506,142,24], [950,410,142,24], [1208,490,144,24], [1420,394,128,24],
      [1727,480,145,24], [1940,387,140,24], [2165,500,115,24], [2445,430,145,24], [2700,345,136,24], [3030,470,154,24], [3320,400,138,24], [3600,492,150,24],
    ],
    berries: [
      [315,453], [566,375], [794,461], [1010,365],
      [1290,445], [1480,349], [1996,342], [2760,300],
    ],
    spikes: [
      [445,607,3], [880,607,2], [1083,607,3], [1570,607,3],
      [2070,607,3], [2260,607,3], [2850,607,3], [3240,607,3],
    ],
    movingObstacles: [
      { originX: 1260, originY: 568, axis: 'x', distance: 130, speed: 1.15, phase: 0 },
      { originX: 2625, originY: 565, axis: 'y', distance: -115, speed: 0.95, phase: 1.5 },
      { originX: 3390, originY: 568, axis: 'x', distance: 150, speed: 1.25, phase: 2.8 },
    ],
    checkpoints: [
      { x: 1795, y: 415 },
      { x: 3045, y: 405 },
    ],
    goal: { x: 3870, y: 355, type: 'exit' },
  },

  2: {
    worldWidth: 4300,
    spawn: { x: 130, y: 340 },
    theme: 'vale',
    platforms: [
      [0,623,560,97], [640,623,480,97], [1200,623,520,97], [1800,623,500,97], [2380,623,620,97], [3080,623,1220,97],
      [190,510,130,24], [400,430,120,24], [660,500,150,24], [910,415,130,24], [1160,355,120,24], [1360,470,140,24],
      [1620,405,130,24], [1900,490,120,24], [2140,420,140,24], [2410,345,120,24], [2660,450,130,24], [2920,380,140,24],
      [3200,485,130,24], [3460,410,120,24], [3700,470,140,24],
    ],
    berries: [
      [280,465], [465,385], [740,455], [980,370],
      [1220,310], [1425,425], [1970,445], [2480,300],
    ],
    spikes: [
      [400,607,2], [860,607,3], [1030,607,2], [1300,607,3],
      [1540,607,3], [1980,607,2], [2170,607,3], [2620,607,3],
      [2850,607,2], [3300,607,3], [3650,607,2],
    ],
    movingObstacles: [
      { originX: 700, originY: 568, axis: 'y', distance: -120, speed: 1.05, phase: 0.5 },
      { originX: 1580, originY: 566, axis: 'x', distance: 130, speed: 1.25, phase: 1.2 },
      { originX: 2650, originY: 568, axis: 'x', distance: 140, speed: 1.35, phase: 2.4 },
      { originX: 3480, originY: 565, axis: 'y', distance: -115, speed: 1.1, phase: 3.1 },
    ],
    checkpoints: [
      { x: 1820, y: 415 },
      { x: 3120, y: 405 },
    ],
    goal: { x: 4120, y: 355, type: 'exit' },
  },

  3: {
    worldWidth: 4400,
    spawn: { x: 130, y: 340 },
    theme: 'night',
    platforms: [
      [0,623,520,97], [600,623,450,97], [1130,623,490,97], [1700,623,460,97], [2240,623,520,97], [2840,623,560,97], [3480,623,920,97],
      [170,505,115,24], [360,425,120,24], [580,505,110,24], [780,420,115,24], [990,350,120,24], [1200,470,110,24],
      [1410,400,115,24], [1620,330,120,24], [1830,460,110,24], [2040,390,115,24], [2260,320,120,24], [2480,450,110,24],
      [2690,380,115,24], [2910,460,110,24], [3120,390,115,24], [3340,470,110,24], [3560,400,115,24], [3780,465,110,24],
    ],
    berries: [
      [245,460], [430,380], [655,460], [860,375],
      [1070,305], [1290,425], [1490,355], [1995,445],
    ],
    spikes: [
      [440,607,2], [750,607,3], [950,607,3], [1230,607,2],
      [1480,607,3], [1870,607,3], [2060,607,2], [2430,607,3],
      [2600,607,3], [3030,607,2], [3210,607,3], [3650,607,3],
      [4000,607,2],
    ],
    movingObstacles: [
      { originX: 520, originY: 565, axis: 'y', distance: -120, speed: 1.15, phase: 0.3 },
      { originX: 1300, originY: 568, axis: 'x', distance: 120, speed: 1.35, phase: 1.0 },
      { originX: 1900, originY: 566, axis: 'x', distance: 130, speed: 1.45, phase: 1.9 },
      { originX: 2700, originY: 567, axis: 'x', distance: 130, speed: 1.3, phase: 2.6 },
      { originX: 3600, originY: 565, axis: 'y', distance: -115, speed: 1.2, phase: 3.4 },
    ],
    checkpoints: [
      { x: 1850, y: 415 },
      { x: 3150, y: 405 },
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
      [180,505,110,24], [360,420,115,24], [570,505,105,24], [760,415,110,24], [970,345,115,24], [1180,465,105,24],
      [1380,395,110,24], [1590,325,115,24], [1800,455,105,24], [2000,385,110,24], [2210,315,115,24], [2420,445,105,24],
      [2620,375,110,24], [2830,455,105,24], [3040,385,110,24], [3250,465,105,24], [3460,395,110,24], [3670,460,105,24],
      [3880,390,110,24],
    ],
    berries: [
      [250,455], [425,370], [640,455], [830,365],
      [1045,295], [1255,415], [1455,345], [1995,335],
    ],
    spikes: [
      [330,607,2], [700,607,3], [880,607,2], [1130,607,3],
      [1400,607,3], [1790,607,3], [1960,607,2], [2300,607,3],
      [2520,607,3], [2900,607,3], [3100,607,2], [3550,607,3],
      [3750,607,3], [4200,607,3],
    ],
    movingObstacles: [
      { originX: 480, originY: 565, axis: 'y', distance: -120, speed: 1.25, phase: 0.2 },
      { originX: 1250, originY: 568, axis: 'x', distance: 120, speed: 1.5, phase: 1.1 },
      { originX: 1830, originY: 566, axis: 'x', distance: 125, speed: 1.55, phase: 2.0 },
      { originX: 2480, originY: 567, axis: 'x', distance: 130, speed: 1.6, phase: 2.8 },
      { originX: 3150, originY: 565, axis: 'y', distance: -115, speed: 1.35, phase: 3.6 },
      { originX: 3850, originY: 566, axis: 'x', distance: 130, speed: 1.45, phase: 4.2 },
    ],
    checkpoints: [
      { x: 1800, y: 415 },
      { x: 3150, y: 405 },
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
