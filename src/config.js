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
});

export const ENDING_SEQUENCE = Object.freeze({
  rescueFrameDuration: 0.55,
  rescueDuration: 3.3,
  kissFrameDuration: 0.7,
  duration: 7.5,
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
