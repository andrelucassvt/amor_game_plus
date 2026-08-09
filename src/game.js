import { ENDING_SEQUENCE, PHYSICS, PLAYER_INITIAL, VIEWPORT } from './config.js';
import { rectsOverlap, solidCollisions } from './core/collision.js';

function createPlayer() {
  return {
    ...PLAYER_INITIAL,
    vx: 0,
    vy: 0,
    dir: 1,
    grounded: false,
    coyote: 0,
    jumpBuffer: 0,
    frame: 0,
    berries: 0,
    invulnerable: 0,
  };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export class Game {
  constructor({ input, audio, ui, onFinish }) {
    this.input = input;
    this.audio = audio;
    this.ui = ui;
    this.onFinish = onFinish;
    this.level = null;
    this.player = createPlayer();
    this.started = false;
    this.paused = false;
    this.won = false;
    this.elapsed = 0;
    this.endingElapsed = 0;
    this.endingShown = false;
    this.cameraX = 0;
    this.respawn = { x: PLAYER_INITIAL.x, y: PLAYER_INITIAL.y };
  }

  startLevel(level) {
    this.level = level;
    this.player = createPlayer();
    this.respawn = { x: level.spawn.x, y: level.spawn.y };
    this.cameraX = 0;
    this.elapsed = 0;
    this.endingElapsed = 0;
    this.endingShown = false;
    this.won = false;
    this.paused = false;
    this.started = true;
    this.ui.hideEnding();
    this.ui.setPaused(false);
    this.ui.setLevelMeta(level);
    this.ui.updateHud(this.player);
    this.ui.announce(level.metadata.intro);
  }

  stop() {
    this.started = false;
    this.paused = false;
  }

  togglePause() {
    if (!this.started || this.won) return;
    this.paused = !this.paused;
    this.ui.setPaused(this.paused);
  }

  update(dt) {
    if (!this.started || this.paused) return;

    if (this.won) {
      if (this.level.goal.type === 'rescue') this.updateEnding(dt);
      return;
    }

    this.elapsed += dt;
    this.player.invulnerable = Math.max(0, this.player.invulnerable - dt);
    if (this.input.consumeJump()) this.player.jumpBuffer = PHYSICS.jumpBufferTime;

    this.updateMovingObstacles();
    this.updateHorizontalMovement(dt);
    this.updateJump(dt);
    this.moveAndCollide(dt);
    this.updateWorldInteractions();
    this.updateCamera(dt);
  }

  updateEnding(dt) {
    this.endingElapsed = Math.min(ENDING_SEQUENCE.duration, this.endingElapsed + dt);
    if (this.endingShown || this.endingElapsed < ENDING_SEQUENCE.duration) return;

    this.endingShown = true;
    this.ui.showEnding({
      berries: this.player.berries,
      time: formatTime(this.elapsed),
    });
  }

  updateHorizontalMovement(dt) {
    const target = this.input.horizontalAxis;
    const acceleration = this.player.grounded
      ? PHYSICS.groundAcceleration
      : PHYSICS.airAcceleration;

    this.player.vx += target * acceleration * dt;
    const friction = this.player.grounded ? PHYSICS.groundFriction : PHYSICS.airFriction;
    this.player.vx *= Math.pow(friction, dt);
    this.player.vx = Math.max(-PHYSICS.maxSpeed, Math.min(PHYSICS.maxSpeed, this.player.vx));
    if (target) this.player.dir = target;
  }

  updateJump(dt) {
    this.player.jumpBuffer = Math.max(0, this.player.jumpBuffer - dt);
    this.player.coyote = this.player.grounded
      ? PHYSICS.coyoteTime
      : Math.max(0, this.player.coyote - dt);

    if (this.player.jumpBuffer && this.player.coyote) {
      this.player.vy = -PHYSICS.jumpSpeed;
      this.player.grounded = false;
      this.player.jumpBuffer = 0;
      this.player.coyote = 0;
      this.audio.playTone(480, 0.06, 'square');
    }

    this.player.vy = Math.min(
      PHYSICS.maxFallSpeed,
      this.player.vy + PHYSICS.gravity * dt,
    );
  }

  updateMovingObstacles() {
    for (const obstacle of this.level.movingObstacles) {
      const progress = (Math.sin(this.elapsed * obstacle.speed + obstacle.phase) + 1) / 2;
      obstacle.x = obstacle.originX + (obstacle.axis === 'x' ? obstacle.distance * progress : 0);
      obstacle.y = obstacle.originY + (obstacle.axis === 'y' ? obstacle.distance * progress : 0);
      obstacle.angle = this.elapsed * obstacle.speed * Math.PI * 1.6;
    }
  }

  moveAndCollide(dt) {
    this.player.x += this.player.vx * dt;
    const solidPlatforms = this.level.platforms.filter(([, , , height]) => height > 24);
    for (const [x, , w] of solidCollisions(this.player, solidPlatforms)) {
      if (this.player.vx > 0) this.player.x = x - this.player.w;
      else if (this.player.vx < 0) this.player.x = x + w;
      this.player.vx = 0;
    }

    const previousBottom = this.player.y + this.player.h;
    this.player.y += this.player.vy * dt;
    this.player.grounded = false;
    for (const [, y, , h] of solidCollisions(this.player, this.level.platforms)) {
      if (this.player.vy > 0) {
        const isElevatedPlatform = h <= 24;
        if (isElevatedPlatform && previousBottom > y + 4) continue;
        this.player.y = y - this.player.h;
        this.player.grounded = true;
      } else if (this.player.vy < 0) {
        if (h <= 24) continue;
        this.player.y = y + h;
      }
      this.player.vy = 0;
    }

    if (this.player.y > VIEWPORT.height + 130) this.hurt();
    this.player.frame += dt * (Math.abs(this.player.vx) > 35 ? 10 : 2.2);
  }

  updateWorldInteractions() {
    for (const berry of this.level.berries) {
      if (berry.taken || !rectsOverlap(this.player, { x: berry.x, y: berry.y, w: 32, h: 32 })) continue;
      berry.taken = true;
      this.player.berries += 1;
      this.ui.updateHud(this.player);
      this.audio.playTone(740, 0.06, 'sine');
      if (this.player.berries === this.level.berries.length) {
        this.ui.announce('Todos os morangos! Agora, até André!');
      }
    }

    for (const checkpoint of this.level.checkpoints) {
      const reached = Math.abs(this.player.x - checkpoint.x) < 46
        && Math.abs(this.player.y - checkpoint.y) < 120;
      if (checkpoint.active || !reached) continue;
      checkpoint.active = true;
      this.respawn = { x: checkpoint.x, y: checkpoint.y - 90 };
      this.ui.announce('Checkpoint alcançado — mais um momento nosso!');
      this.audio.playTone(620, 0.1, 'triangle');
    }

    for (const [x, y, count] of this.level.spikes) {
      if (rectsOverlap(this.player, { x, y, w: count * 21, h: 16 })) this.hurt();
    }

    for (const obstacle of this.level.movingObstacles) {
      const hitbox = {
        x: obstacle.x + 7,
        y: obstacle.y + 7,
        w: obstacle.w - 14,
        h: obstacle.h - 12,
      };
      if (rectsOverlap(this.player, hitbox)) this.hurt();
    }

    if (this.player.x > this.level.goal.x - 45 && this.player.y > this.level.goal.y - 100) {
      this.finish();
    }
  }

  updateCamera(dt) {
    const desired = Math.max(
      0,
      Math.min(this.level.world.width - VIEWPORT.width, this.player.x - VIEWPORT.width * 0.34),
    );
    this.cameraX += (desired - this.cameraX) * Math.min(1, dt * 4.5);
  }

  hurt() {
    if (this.player.invulnerable > 0 || this.won) return;

    this.player.lives -= 1;
    this.player.invulnerable = 1.5;
    this.audio.playTone(110, 0.16, 'sawtooth');
    if (this.player.lives <= 0) {
      this.player.lives = PLAYER_INITIAL.lives;
      this.ui.announce('Não desista do seu sonho, Thaíssa!');
    }

    Object.assign(this.player, {
      x: this.respawn.x,
      y: this.respawn.y,
      vx: 0,
      vy: 0,
    });
    this.cameraX = Math.max(0, this.player.x - VIEWPORT.width * 0.33);
    this.ui.updateHud(this.player);
  }

  finish() {
    if (this.won) return;
    this.won = true;
    this.endingElapsed = 0;
    this.endingShown = false;
    this.player.vx = 0;
    this.player.vy = 0;
    this.audio.playVictory();
    this.onFinish({
      levelNumber: this.level.metadata.number,
      berries: this.player.berries,
      time: formatTime(this.elapsed),
      goalType: this.level.goal.type,
    });
  }
}
