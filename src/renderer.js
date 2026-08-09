import { ENDING_SEQUENCE, SPRITE_FRAMES, VIEWPORT } from './config.js';

function getSequenceFrame(frames, elapsed, frameDuration, loop = false) {
  const rawIndex = Math.floor(elapsed / frameDuration);
  const index = loop
    ? rawIndex % frames.length
    : Math.min(frames.length - 1, rawIndex);
  return frames[index];
}

export class Renderer {
  constructor(canvas, assets) {
    this.canvas = canvas;
    this.assets = assets;
    this.ctx = canvas.getContext('2d');
    this.configureCanvas();
  }

  configureCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, VIEWPORT.maxPixelRatio);
    this.canvas.width = VIEWPORT.width * ratio;
    this.canvas.height = VIEWPORT.height * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  draw(game) {
    this.drawSky(game.cameraX);
    this.ctx.save();
    this.ctx.translate(-Math.round(game.cameraX), 0);
    this.drawWorld(game);
    this.ctx.restore();

    if (game.won && game.endingElapsed >= ENDING_SEQUENCE.rescueDuration) {
      this.drawCelebration(game.endingElapsed - ENDING_SEQUENCE.rescueDuration);
    }
    if (game.paused && game.started && !game.won) this.drawPause();
  }

  drawSky(cameraX) {
    const { ctx } = this;
    ctx.fillStyle = '#79c5e6';
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    ctx.fillStyle = 'rgba(255,248,220,.75)';
    ctx.beginPath();
    ctx.arc(1010, 112, 50, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 10; i += 1) {
      let x = (i * 193 - cameraX * 0.12) % 1450;
      if (x < 0) x += 1450;
      this.drawCloud(x, 75 + (i % 4) * 67, 1 + (i % 3) * 0.15);
    }

    for (let i = 0; i < 22; i += 1) {
      const x = i * 100 - (cameraX * 0.23 % 100);
      this.drawTree(x, 510 + (i % 3) * 13, 1.15 + (i % 2) * 0.18, '#408b75', '#2a7066');
    }
    for (let i = 0; i < 20; i += 1) {
      const x = i * 135 - (cameraX * 0.45 % 135);
      this.drawTree(x, 565 + (i % 2) * 15, 0.84 + (i % 3) * 0.08, '#317b68', '#205f5d');
    }
  }

  drawCloud(x, y, scale) {
    const { ctx } = this;
    ctx.fillStyle = 'rgba(255,255,255,.76)';
    ctx.beginPath();
    ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y - 12 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 58 * scale, y, 18 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTree(x, y, scale, crown, trunk) {
    const { ctx } = this;
    ctx.fillStyle = trunk;
    ctx.fillRect(x + 30 * scale, y - 110 * scale, 16 * scale, 125 * scale);
    ctx.fillStyle = crown;
    ctx.beginPath();
    ctx.arc(x + 38 * scale, y - 130 * scale, 42 * scale, 0, Math.PI * 2);
    ctx.arc(x + 10 * scale, y - 105 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 68 * scale, y - 103 * scale, 34 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWorld(game) {
    const { level } = game;
    level.platforms.forEach(platform => this.drawPlatform(...platform));
    level.spikes.forEach(([x, y, count]) => this.drawSpikes(x, y, count));
    level.berries.forEach(berry => {
      if (!berry.taken) {
        const bob = Math.sin(game.elapsed * 3 + berry.bob) * 4;
        this.drawFruit(berry.x, berry.y + bob, game.elapsed);
      }
    });
    level.checkpoints.forEach(checkpoint => this.drawCheckpoint(checkpoint));
    this.drawGoal(level.goal, game);
    if (!game.won) this.drawPlayer(game);
  }

  drawPlatform(x, y, width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(48,35,57,.2)';
    ctx.fillRect(x + 6, y + 9, width, height);

    const earth = ctx.createLinearGradient(0, y, 0, y + height);
    earth.addColorStop(0, '#a95f43');
    earth.addColorStop(0.55, '#814c43');
    earth.addColorStop(1, '#633a42');
    ctx.fillStyle = earth;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#513440';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, y + 1.5, width - 3, height - 3);

    const cap = ctx.createLinearGradient(0, y, 0, y + 18);
    cap.addColorStop(0, '#ffe3a1');
    cap.addColorStop(0.45, '#efb966');
    cap.addColorStop(1, '#cb7b4d');
    ctx.fillStyle = cap;
    ctx.beginPath();
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x, y + 4);
    for (let xx = x; xx < x + width; xx += 18) {
      ctx.quadraticCurveTo(xx + 5, y - 2, Math.min(xx + 12, x + width), y + 4);
      ctx.quadraticCurveTo(xx + 16, y + 9, Math.min(xx + 18, x + width), y + 5);
    }
    ctx.lineTo(x + width, y + 18);
    ctx.lineTo(x, y + 18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#704442';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 17);
    ctx.lineTo(x + width, y + 17);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,210,133,.22)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let xx = x + 24; xx < x + width - 12; xx += 54) {
      const yy = y + 33 + ((xx / 18) % 3) * 13;
      ctx.beginPath();
      ctx.moveTo(xx, yy);
      ctx.quadraticCurveTo(xx + 8, yy - 5, xx + 17, yy);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFruit(x, y, elapsed) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x + 16, y + 17);
    ctx.rotate(Math.sin(elapsed * 3 + x) * 0.08);
    ctx.shadowColor = 'rgba(55,39,62,.28)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 5;

    const red = ctx.createLinearGradient(-12, -10, 14, 15);
    red.addColorStop(0, '#ff8b8c');
    red.addColorStop(0.5, '#ef5367');
    red.addColorStop(1, '#bd334f');
    ctx.fillStyle = red;
    ctx.strokeStyle = '#7e3047';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.bezierCurveTo(-4, 12, -15, 3, -14, -7);
    ctx.bezierCurveTo(-13, -17, -3, -18, 0, -11);
    ctx.bezierCurveTo(5, -18, 15, -15, 15, -6);
    ctx.bezierCurveTo(15, 3, 5, 12, 0, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffe3a1';
    [[-7,-5],[6,-6],[-8,3],[5,3],[0,9]].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.ellipse(px, py, 1.2, 2, 0.25, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#4d9064';
    ctx.strokeStyle = '#315f4e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-10, -14);
    ctx.lineTo(-5, -8);
    ctx.lineTo(0, -16);
    ctx.lineTo(4, -9);
    ctx.lineTo(11, -14);
    ctx.lineTo(7, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawSpikes(x, y, count) {
    const { ctx } = this;
    ctx.save();
    ctx.lineJoin = 'round';
    for (let i = 0; i < count; i += 1) {
      const px = x + i * 21;
      const shine = ctx.createLinearGradient(px, y, px + 21, y + 16);
      shine.addColorStop(0, '#fff4d6');
      shine.addColorStop(0.55, '#e7b979');
      shine.addColorStop(1, '#9d5e52');
      ctx.fillStyle = shine;
      ctx.strokeStyle = '#653d49';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 1, y + 15);
      ctx.quadraticCurveTo(px + 8, y + 5, px + 11, y);
      ctx.quadraticCurveTo(px + 15, y + 6, px + 20, y + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#75464b';
    ctx.fillRect(x, y + 14, count * 21, 3);
    ctx.restore();
  }

  drawCheckpoint(checkpoint) {
    const { ctx } = this;
    const { x, y, active } = checkpoint;
    ctx.save();
    ctx.globalAlpha = active ? 1 : 0.72;
    ctx.shadowColor = active ? 'rgba(255,108,126,.55)' : 'transparent';
    ctx.shadowBlur = active ? 17 : 0;
    ctx.strokeStyle = '#5a3a49';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 62);
    ctx.lineTo(x + 10, y + 6);
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = active ? '#f25f73' : '#f2b76f';
    ctx.strokeStyle = '#6b3d4b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 9);
    ctx.quadraticCurveTo(x + 34, y + 1, x + 52, y + 13);
    ctx.lineTo(x + 48, y + 35);
    ctx.quadraticCurveTo(x + 30, y + 23, x + 12, y + 31);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff3dc';
    ctx.font = '700 19px Fredoka';
    ctx.textAlign = 'center';
    ctx.fillText(active ? '♥' : '◇', x + 31, y + 25);
    ctx.fillStyle = '#70434b';
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 63, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(game) {
    const { player } = game;
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 11) % 2 === 0) return;

    let frame;
    if (!player.grounded) {
      const index = player.vy < -360 ? 1 : player.vy < -90 ? 2 : player.vy < 260 ? 3 : 4;
      frame = SPRITE_FRAMES.thaissa.jump[index];
    } else if (Math.abs(player.vx) > 34) {
      frame = SPRITE_FRAMES.thaissa.run[Math.floor(player.frame) % SPRITE_FRAMES.thaissa.run.length];
    } else {
      frame = SPRITE_FRAMES.thaissa.idle;
    }

    this.drawCharacterFrame(
      this.assets.thaissa,
      frame,
      player.x + player.w / 2,
      player.y + player.h,
      147,
      player.dir,
    );
  }

  drawCharacterFrame(image, frame, anchorX, anchorY, targetHeight, direction = 1) {
    const { ctx } = this;
    const [sx, sy, sw, sh] = frame;
    const targetWidth = targetHeight * (sw / sh);
    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.scale(direction, 1);
    ctx.drawImage(image, sx, sy, sw, sh, -targetWidth / 2, -targetHeight, targetWidth, targetHeight);
    ctx.restore();
  }

  drawCharacterFrameAtScale(image, frame, anchorX, anchorY, scale, direction = 1) {
    const { ctx } = this;
    const [sx, sy, sw, sh] = frame;
    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.scale(direction, 1);
    ctx.drawImage(image, sx, sy, sw, sh, -(sw * scale) / 2, -sh * scale, sw * scale, sh * scale);
    ctx.restore();
  }

  drawGoal(goal, game) {
    const { ctx } = this;
    ctx.save();
    const glow = ctx.createRadialGradient(goal.x + 72, goal.y + 180, 5, goal.x + 72, goal.y + 180, 105);
    glow.addColorStop(0, 'rgba(255,225,154,.38)');
    glow.addColorStop(1, 'rgba(255,225,154,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(goal.x + 72, goal.y + 180, 105, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#301e4a';
    ctx.beginPath();
    ctx.ellipse(goal.x + 72, 625, 48, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#5b3a48';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(goal.x + 121, 622);
    ctx.lineTo(goal.x + 121, 520);
    ctx.stroke();
    ctx.fillStyle = '#f36b75';
    ctx.strokeStyle = '#633c4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(goal.x + 123, 522);
    ctx.quadraticCurveTo(goal.x + 153, 511, goal.x + 176, 528);
    ctx.lineTo(goal.x + 166, 558);
    ctx.quadraticCurveTo(goal.x + 146, 542, goal.x + 123, 552);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff1d4';
    ctx.font = '700 24px Fredoka';
    ctx.textAlign = 'center';
    ctx.fillText('♥', goal.x + 147, goal.y + 188);
    if (game.won) {
      const andreFrame = getSequenceFrame(
        SPRITE_FRAMES.andre.rescue,
        game.endingElapsed,
        ENDING_SEQUENCE.rescueFrameDuration,
      );
      const thaissaFrame = getSequenceFrame(
        SPRITE_FRAMES.thaissa.rescue,
        game.endingElapsed,
        ENDING_SEQUENCE.rescueFrameDuration,
      );
      this.drawCharacterFrameAtScale(this.assets.andre, andreFrame, goal.x + 72, 623, 0.35);
      this.drawCharacterFrameAtScale(this.assets.action, thaissaFrame, goal.x - 10, 623, 0.42);
    } else {
      const captiveFrame = getSequenceFrame(
        SPRITE_FRAMES.andre.captive,
        game.elapsed,
        0.42,
        true,
      );
      this.drawCharacterFrameAtScale(this.assets.andre, captiveFrame, goal.x + 72, 623, 0.35);
      ctx.fillStyle = '#f66a57';
      ctx.font = '700 18px Fredoka';
      ctx.fillText('ANDRÉ!', goal.x + 72, goal.y + 91);
    }
    ctx.restore();
  }

  drawCelebration(elapsed) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(25,25,70,.45)';
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    ctx.translate(VIEWPORT.width / 2, VIEWPORT.height / 2 + 20);

    const frame = getSequenceFrame(
      SPRITE_FRAMES.kiss,
      elapsed,
      ENDING_SEQUENCE.kissFrameDuration,
    );
    const [sx, sy, sw, sh] = frame;
    const targetHeight = 520;
    const targetWidth = targetHeight * (sw / sh);
    ctx.drawImage(this.assets.kiss, sx, sy, sw, sh, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

    for (let i = 0; i < 8; i += 1) {
      const angle = elapsed * 1.8 + i * 0.8;
      const x = Math.cos(angle) * 250;
      const y = Math.sin(angle * 1.4) * 140;
      ctx.fillStyle = i % 2 ? '#ffd97c' : '#ff6b83';
      ctx.font = '28px Fredoka';
      ctx.fillText(i % 2 ? '♥' : '✦', x, y - 90);
    }
    ctx.restore();
  }

  drawPause() {
    const { ctx } = this;
    ctx.fillStyle = 'rgba(23,27,72,.58)';
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    ctx.fillStyle = '#fff8e8';
    ctx.textAlign = 'center';
    ctx.font = '700 48px Fredoka';
    ctx.fillText('Pausa', VIEWPORT.width / 2, VIEWPORT.height / 2);
  }
}
