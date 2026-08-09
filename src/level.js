import { WORLD } from './config.js';

const PLATFORM_TEMPLATE = [
  [0,623,610,97], [660,623,430,97], [1150,623,540,97], [1760,623,490,97], [2320,623,620,97], [3010,623,1040,97],
  [250,498,150,24], [510,420,125,24], [740,506,142,24], [950,410,142,24], [1208,490,144,24], [1420,394,128,24],
  [1727,480,145,24], [1940,387,140,24], [2165,500,115,24], [2445,430,145,24], [2700,345,136,24], [3030,470,154,24], [3320,400,138,24], [3600,492,150,24],
];

const BERRY_TEMPLATE = [
  [315,453], [566,375], [794,461], [1010,365],
  [1290,445], [1480,349], [1996,342], [2760,300],
];

const SPIKE_TEMPLATE = [
  [445,607,3], [880,607,2], [1083,607,3], [1570,607,3],
  [2070,607,3], [2260,607,3], [2850,607,3], [3240,607,3],
];

const CHECKPOINT_TEMPLATE = [
  { x: 1795, y: 415 },
  { x: 3045, y: 405 },
];

export function createLevel() {
  return {
    world: { ...WORLD },
    platforms: PLATFORM_TEMPLATE.map(platform => [...platform]),
    berries: BERRY_TEMPLATE.map(([x, y], index) => ({
      x,
      y,
      taken: false,
      bob: index * 0.87,
    })),
    spikes: SPIKE_TEMPLATE.map(spike => [...spike]),
    checkpoints: CHECKPOINT_TEMPLATE.map(checkpoint => ({
      ...checkpoint,
      active: false,
    })),
    goal: { x: 3870, y: 355 },
  };
}
