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
  jumpSpeed: 610,
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
    celebrate: [1054, 540, 170, 386],
  },
  andreCaptive: [789, 28, 186, 489],
  kiss: [
    [0, 170, 350, 649], [351, 173, 349, 649], [713, 178, 327, 645],
    [1078, 184, 306, 641], [1419, 191, 298, 636], [1758, 190, 288, 639],
  ],
});
