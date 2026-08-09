/* Thaissa — a small canvas platformer. All art is sourced from /Assets. */
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const W = 1280, H = 720;
const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = W * pixelRatio;
canvas.height = H * pixelRatio;
ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const assets = {
  thaissa: load('Assets/sprites/thaissa-movement.png'), action: load('Assets/sprites/thaissa-actions.png'),
  andre: load('Assets/sprites/andre-captive.png'), kiss: load('Assets/sprites/andre-thaissa-kiss.png'),
};
function load(src) { const image = new Image(); image.src = src; return image; }

const ui = {
  intro: document.querySelector('#introCard'), ending: document.querySelector('#endingCard'),
  start: document.querySelector('#startButton'), restart: document.querySelector('#restartButton'),
  pause: document.querySelector('#pauseButton'), sound: document.querySelector('#soundButton'), message: document.querySelector('#message'),
  berries: document.querySelector('#berryCount'), lives: document.querySelector('#lifeCount'), endBerries: document.querySelector('#finishBerries'), endTime: document.querySelector('#finishTime'),
};

const keys = new Set();
let started = false, paused = false, won = false, soundOn = false, last = 0, elapsed = 0, cameraX = 0, messageTimer;
const world = { width: 4050, floor: 623 };
const player = { x: 130, y: 340, w: 57, h: 94, vx: 0, vy: 0, dir: 1, grounded: false, coyote: 0, jumpBuffer: 0, frame: 0, berries: 0, lives: 3, invulnerable: 0 };

// These sheets were illustrated as contact sheets, not exported as a strict grid.
// Every pose therefore has its own transparent-safe crop to prevent neighboring
// heads, hair or feet from flashing during animation.
const thaissaFrames = {
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
};
const andreCaptiveFrame = [789, 28, 186, 489];
const kissFrames = [
  [0, 170, 350, 649], [351, 173, 349, 649], [713, 178, 327, 645],
  [1078, 184, 306, 641], [1419, 191, 298, 636], [1758, 190, 288, 639],
];

const platforms = [
  [0,623,610,97], [660,623,430,97], [1150,623,540,97], [1760,623,490,97], [2320,623,620,97], [3010,623,1040,97],
  [250,498,150,24], [510,420,125,24], [740,506,142,24], [950,410,142,24], [1208,490,144,24], [1420,394,128,24],
  [1727,480,145,24], [1940,387,140,24], [2165,500,115,24], [2445,430,145,24], [2700,345,136,24], [3030,470,154,24], [3320,400,138,24], [3600,492,150,24]
];
const berries = [
  [315,453], [566,375], [794,461], [1010,365], [1290,445], [1480,349], [1996,342], [2760,300]
].map(([x,y]) => ({x,y,taken:false,bob:Math.random()*6.28}));
const spikes = [[445,607,3],[880,607,2],[1083,607,3],[1570,607,3],[2070,607,3],[2260,607,3],[2850,607,3],[3240,607,3]];
const checkpoints = [{x: 1795, y: 415, active:false}, {x: 3045,y:405,active:false}];
const goal = {x: 3870, y: 355};
let respawn = {x: 130, y: 340};

function resetGame() {
  Object.assign(player, {x:130,y:340,vx:0,vy:0,dir:1,grounded:false,berries:0,lives:3,invulnerable:0});
  berries.forEach(b => b.taken=false); checkpoints.forEach(c => c.active=false); respawn={x:130,y:340}; cameraX=0; elapsed=0; won=false; paused=false; started=true;
  ui.ending.classList.add('hidden'); ui.pause.textContent='Ⅱ Pausar'; updateHud(); announce('Encontre André no fim da floresta!');
}
function updateHud() { ui.berries.textContent=String(player.berries).padStart(2,'0'); ui.lives.textContent=String(player.lives).padStart(2,'0'); }
function announce(text) { ui.message.textContent=text; ui.message.classList.add('show'); clearTimeout(messageTimer); messageTimer=setTimeout(()=>ui.message.classList.remove('show'),1900); }

function rectsOverlap(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
function solidAt(entity) { return platforms.filter(([x,y,w,h]) => rectsOverlap(entity,{x,y,w,h})); }
function hurt() {
  if (player.invulnerable > 0 || won) return;
  player.lives--; updateHud(); player.invulnerable=1.5; playTone(110,.16,'sawtooth');
  if (player.lives <= 0) { player.lives=3; updateHud(); announce('Tente outra vez, heroína!'); }
  player.x=respawn.x; player.y=respawn.y; player.vx=0; player.vy=0; cameraX=Math.max(0,player.x-W*.33);
}
function update(dt) {
  if (!started || paused || won) return;
  elapsed += dt; player.invulnerable=Math.max(0,player.invulnerable-dt);
  const left=keys.has('ArrowLeft')||keys.has('KeyA'), right=keys.has('ArrowRight')||keys.has('KeyD');
  const target=(right?1:0)-(left?1:0); const accel=player.grounded?2200:1150;
  player.vx += target*accel*dt; player.vx *= Math.pow(player.grounded?.0005:.018,dt); player.vx=Math.max(-310,Math.min(310,player.vx));
  if (target) player.dir=target;
  player.jumpBuffer=Math.max(0,player.jumpBuffer-dt); player.coyote=player.grounded?.11:Math.max(0,player.coyote-dt);
  if (player.jumpBuffer && player.coyote) { player.vy=-610; player.grounded=false; player.jumpBuffer=0; player.coyote=0; playTone(480,.06,'square'); }
  player.vy=Math.min(900,player.vy+1680*dt);
  player.x += player.vx*dt;
  for (const [x,y,w,h] of solidAt(player)) { if(player.vx>0) player.x=x-player.w; else if(player.vx<0) player.x=x+w; player.vx=0; }
  player.y += player.vy*dt; player.grounded=false;
  for (const [x,y,w,h] of solidAt(player)) { if(player.vy>0) { player.y=y-player.h; player.grounded=true; } else if(player.vy<0) player.y=y+h; player.vy=0; }
  if(player.y>H+130) hurt();
  player.frame += dt*(Math.abs(player.vx)>35?10:2.2);
  cameraX += ((Math.max(0,Math.min(world.width-W,player.x-W*.34)))-cameraX)*Math.min(1,dt*4.5);
  berries.forEach(b=>{ if(!b.taken && rectsOverlap(player,{x:b.x,y:b.y,w:32,h:32})) { b.taken=true; player.berries++; updateHud(); playTone(740,.06,'sine'); if(player.berries===8) announce('Todos os morangos! Agora, até André!'); } });
  checkpoints.forEach(c=>{if(!c.active && Math.abs(player.x-c.x)<46 && Math.abs(player.y-c.y)<120) {c.active=true; respawn={x:c.x,y:c.y-90}; announce('Checkpoint alcançado!'); playTone(620,.1,'triangle');}});
  for(const [x,y,n] of spikes) { if(rectsOverlap(player,{x,y,w:n*21,h:16})) hurt(); }
  if (player.x > goal.x-45 && player.y > 290) finish();
}
function finish() { if(won) return; won=true; playTone(523,.12,'sine'); setTimeout(()=>playTone(659,.13,'sine'),130); setTimeout(()=>playTone(784,.22,'sine'),270); setTimeout(()=>{ui.endBerries.textContent=String(player.berries).padStart(2,'0');ui.endTime.textContent=formatTime(elapsed);ui.ending.classList.remove('hidden');},1150); }

function draw() {
  drawSky(); ctx.save(); ctx.translate(-Math.round(cameraX),0); drawWorld(); ctx.restore();
  if (won) drawCelebration();
  if(paused && started && !won) { ctx.fillStyle='rgba(23,27,72,.58)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff8e8';ctx.textAlign='center';ctx.font='700 48px Fredoka';ctx.fillText('Pausa',W/2,H/2); }
}
function drawSky() {
  ctx.fillStyle='#79c5e6';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,248,220,.75)';ctx.beginPath();ctx.arc(1010,112,50,0,Math.PI*2);ctx.fill();
  for(let i=0;i<10;i++){let x=(i*193-cameraX*.12)%1450;if(x<0)x+=1450;let y=75+(i%4)*67; cloud(x,y,1+(i%3)*.15);}
  // parallax forest
  for(let i=0;i<22;i++){const x=i*100-(cameraX*.23%100);tree(x,510+(i%3)*13,1.15+(i%2)*.18,'#408b75','#2a7066');}
  for(let i=0;i<20;i++){const x=i*135-(cameraX*.45%135);tree(x,565+(i%2)*15,.84+(i%3)*.08,'#317b68','#205f5d');}
}
function cloud(x,y,s) {ctx.fillStyle='rgba(255,255,255,.76)';ctx.beginPath();ctx.arc(x,y,18*s,0,7);ctx.arc(x+25*s,y-12*s,25*s,0,7);ctx.arc(x+58*s,y,18*s,0,7);ctx.fill();}
function tree(x,y,s,a,b){ctx.fillStyle=b;ctx.fillRect(x+30*s,y-110*s,16*s,125*s);ctx.fillStyle=a;ctx.beginPath();ctx.arc(x+38*s,y-130*s,42*s,0,7);ctx.arc(x+10*s,y-105*s,30*s,0,7);ctx.arc(x+68*s,y-103*s,34*s,0,7);ctx.fill();}
function drawWorld() {
  // ground and platform blocks
  platforms.forEach(p=>platform(...p));
  spikes.forEach(([x,y,n])=>drawSpikes(x,y,n));
  berries.forEach(b=>{if(!b.taken){const bob=Math.sin(elapsed*3+b.bob)*4; drawFruit(b.x,b.y+bob);}});
  checkpoints.forEach(c=>drawCheckpoint(c));
  drawGoal(); drawPlayer();
}
function platform(x,y,w,h) {
  ctx.save();
  ctx.fillStyle='rgba(48,35,57,.2)';ctx.fillRect(x+6,y+9,w,h);
  const earth=ctx.createLinearGradient(0,y,0,y+h);
  earth.addColorStop(0,'#a95f43');earth.addColorStop(.55,'#814c43');earth.addColorStop(1,'#633a42');
  ctx.fillStyle=earth;ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#513440';ctx.lineWidth=3;ctx.strokeRect(x+1.5,y+1.5,w-3,h-3);
  // Rounded, hand-painted grass cap at the collision surface.
  const cap=ctx.createLinearGradient(0,y,0,y+18);cap.addColorStop(0,'#ffe3a1');cap.addColorStop(.45,'#efb966');cap.addColorStop(1,'#cb7b4d');
  ctx.fillStyle=cap;ctx.beginPath();ctx.moveTo(x,y+15);ctx.lineTo(x,y+4);
  for(let xx=x;xx<x+w;xx+=18){ctx.quadraticCurveTo(xx+5,y-2,Math.min(xx+12,x+w),y+4);ctx.quadraticCurveTo(xx+16,y+9,Math.min(xx+18,x+w),y+5);}
  ctx.lineTo(x+w,y+18);ctx.lineTo(x,y+18);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#704442';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y+17);ctx.lineTo(x+w,y+17);ctx.stroke();
  // Soft stone marks keep long ground sections from feeling flat.
  ctx.strokeStyle='rgba(255,210,133,.22)';ctx.lineWidth=2;ctx.lineCap='round';
  for(let xx=x+24;xx<x+w-12;xx+=54){const yy=y+33+((xx/18)%3)*13;ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+8,yy-5,xx+17,yy);ctx.stroke();}
  ctx.restore();
}
function drawFruit(x,y) {
  ctx.save();ctx.translate(x+16,y+17);ctx.rotate(Math.sin(elapsed*3+x)*.08);
  ctx.shadowColor='rgba(55,39,62,.28)';ctx.shadowBlur=8;ctx.shadowOffsetY=5;
  const red=ctx.createLinearGradient(-12,-10,14,15);red.addColorStop(0,'#ff8b8c');red.addColorStop(.5,'#ef5367');red.addColorStop(1,'#bd334f');
  ctx.fillStyle=red;ctx.strokeStyle='#7e3047';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,15);ctx.bezierCurveTo(-4,12,-15,3,-14,-7);ctx.bezierCurveTo(-13,-17,-3,-18,0,-11);ctx.bezierCurveTo(5,-18,15,-15,15,-6);ctx.bezierCurveTo(15,3,5,12,0,15);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowColor='transparent';ctx.fillStyle='#ffe3a1';
  [[-7,-5],[6,-6],[-8,3],[5,3],[0,9]].forEach(([px,py])=>{ctx.beginPath();ctx.ellipse(px,py,1.2,2,.25,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#4d9064';ctx.strokeStyle='#315f4e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(-10,-14);ctx.lineTo(-5,-8);ctx.lineTo(0,-16);ctx.lineTo(4,-9);ctx.lineTo(11,-14);ctx.lineTo(7,-7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
}
function drawSpikes(x,y,count) {
  ctx.save();ctx.lineJoin='round';
  for(let i=0;i<count;i++){
    const px=x+i*21,shine=ctx.createLinearGradient(px,y,px+21,y+16);shine.addColorStop(0,'#fff4d6');shine.addColorStop(.55,'#e7b979');shine.addColorStop(1,'#9d5e52');
    ctx.fillStyle=shine;ctx.strokeStyle='#653d49';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(px+1,y+15);ctx.quadraticCurveTo(px+8,y+5,px+11,y);ctx.quadraticCurveTo(px+15,y+6,px+20,y+15);ctx.closePath();ctx.fill();ctx.stroke();
  }
  ctx.fillStyle='#75464b';ctx.fillRect(x,y+14,count*21,3);ctx.restore();
}
function drawCheckpoint(c) {
  ctx.save();const active=c.active;ctx.globalAlpha=active?1:.72;
  ctx.shadowColor=active?'rgba(255,108,126,.55)':'transparent';ctx.shadowBlur=active?17:0;
  ctx.strokeStyle='#5a3a49';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(c.x+10,c.y+62);ctx.lineTo(c.x+10,c.y+6);ctx.stroke();
  ctx.shadowColor='transparent';ctx.fillStyle=active?'#f25f73':'#f2b76f';ctx.strokeStyle='#6b3d4b';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(c.x+12,c.y+9);ctx.quadraticCurveTo(c.x+34,c.y+1,c.x+52,c.y+13);ctx.lineTo(c.x+48,c.y+35);ctx.quadraticCurveTo(c.x+30,c.y+23,c.x+12,c.y+31);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff3dc';ctx.font='700 19px Fredoka';ctx.textAlign='center';ctx.fillText(active?'♥':'◇',c.x+31,c.y+25);ctx.fillStyle='#70434b';ctx.beginPath();ctx.ellipse(c.x+10,c.y+63,12,4,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawPlayer() {
  if(player.invulnerable>0 && Math.floor(player.invulnerable*11)%2===0)return;
  if (player.x > goal.x - 270 && !won) {
    drawCharacterFrame(assets.action, thaissaFrames.celebrate, player.x + player.w / 2, player.y + player.h, 155, player.dir);
    return;
  }
  let frame;
  if (!player.grounded) {
    const jumpIndex = player.vy < -360 ? 1 : player.vy < -90 ? 2 : player.vy < 260 ? 3 : 4;
    frame = thaissaFrames.jump[jumpIndex];
  } else if (Math.abs(player.vx) > 34) {
    frame = thaissaFrames.run[Math.floor(player.frame) % thaissaFrames.run.length];
  } else {
    frame = thaissaFrames.idle;
  }
  drawCharacterFrame(assets.thaissa, frame, player.x + player.w / 2, player.y + player.h, 147, player.dir);
}
function drawCharacterFrame(image, frame, anchorX, anchorY, targetHeight, direction=1) {
  const [sx,sy,sw,sh]=frame, targetWidth=targetHeight*(sw/sh);
  ctx.save();ctx.translate(anchorX,anchorY);ctx.scale(direction,1);
  ctx.drawImage(image,sx,sy,sw,sh,-targetWidth/2,-targetHeight,targetWidth,targetHeight);
  ctx.restore();
}
function drawGoal() {
  // André now shares Thaissa's world scale; only the ending close-up is cinematic.
  ctx.save();
  const glow=ctx.createRadialGradient(goal.x+72,goal.y+180,5,goal.x+72,goal.y+180,105);
  glow.addColorStop(0,'rgba(255,225,154,.38)');glow.addColorStop(1,'rgba(255,225,154,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(goal.x+72,goal.y+180,105,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=.25;ctx.fillStyle='#301e4a';ctx.beginPath();ctx.ellipse(goal.x+72,625,48,7,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  // A tall rescue marker replaces the old low-resolution end flag.
  ctx.strokeStyle='#5b3a48';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(goal.x+121,622);ctx.lineTo(goal.x+121,520);ctx.stroke();
  ctx.fillStyle='#f36b75';ctx.strokeStyle='#633c4a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(goal.x+123,522);ctx.quadraticCurveTo(goal.x+153,511,goal.x+176,528);ctx.lineTo(goal.x+166,558);ctx.quadraticCurveTo(goal.x+146,542,goal.x+123,552);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff1d4';ctx.font='700 24px Fredoka';ctx.textAlign='center';ctx.fillText('♥',goal.x+147,goal.y+188);
  drawCharacterFrame(assets.andre,andreCaptiveFrame,goal.x+72,623,165,1);
  ctx.fillStyle='#f66a57';ctx.font='700 18px Fredoka';ctx.textAlign='center';ctx.fillText('ANDRÉ!',goal.x+72,goal.y+91);ctx.restore();
}
function drawCelebration() {
  ctx.save();ctx.fillStyle='rgba(25,25,70,.45)';ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2+20);const frame=kissFrames[Math.floor(elapsed*2.3)%kissFrames.length];const [sx,sy,sw,sh]=frame,targetHeight=520,targetWidth=targetHeight*(sw/sh);ctx.drawImage(assets.kiss,sx,sy,sw,sh,-targetWidth/2,-targetHeight/2,targetWidth,targetHeight);
  for(let i=0;i<8;i++){const a=elapsed*1.8+i*0.8,x=Math.cos(a)*250,y=Math.sin(a*1.4)*140;ctx.fillStyle=i%2?'#ffd97c':'#ff6b83';ctx.font='28px Fredoka';ctx.fillText(i%2?'♥':'✦',x,y-90);}ctx.restore();
}
function formatTime(seconds){const min=Math.floor(seconds/60),sec=Math.floor(seconds%60);return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;}

function setupInput() {
  addEventListener('keydown', e=>{if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'].includes(e.code))e.preventDefault();keys.add(e.code);if(['Space','ArrowUp','KeyW'].includes(e.code)){player.jumpBuffer=.13;}if(e.code==='Escape'&&started&&!won)togglePause();});
  addEventListener('keyup',e=>keys.delete(e.code));
  canvas.addEventListener('pointerdown',()=>{if(started&&!paused&&!won)player.jumpBuffer=.13;});
}
function togglePause(){paused=!paused;ui.pause.textContent=paused?'▶ Continuar':'Ⅱ Pausar';}
ui.start.addEventListener('click',()=>{ui.intro.classList.add('hidden');resetGame();});ui.restart.addEventListener('click',resetGame);ui.pause.addEventListener('click',()=>{if(started&&!won)togglePause();});ui.sound.addEventListener('click',()=>{soundOn=!soundOn;ui.sound.textContent=soundOn?'♫':'♪';if(soundOn)playTone(520,.08,'sine');});
let audio;
function playTone(freq,duration,type){if(!soundOn)return;audio??=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
function loop(t){const dt=Math.min(.033,(t-last||0)/1000);last=t;update(dt);draw();requestAnimationFrame(loop);}setupInput();requestAnimationFrame(loop);
