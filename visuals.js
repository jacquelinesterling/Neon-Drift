function spawnHazard() {
  const size = 18 + Math.random() * 25;
  state.hazards.push({
    x: size + Math.random() * (width - size * 2),
    y: -size,
    size,
    speed: 135 + Math.random() * 100 + state.elapsed * 2,
    rotation: Math.random() * 6,
    spin: (Math.random() - 0.5) * 4,
    type: Math.floor(Math.random() * 3)
  });
}

function drawHazard(hazard) {
  context.save();
  context.translate(hazard.x, hazard.y);
  context.rotate(hazard.rotation);
  context.shadowBlur = 16;
  context.shadowColor = '#ff8066';
  context.strokeStyle = '#ff8066';
  context.fillStyle = 'rgba(255,128,102,.16)';
  context.lineWidth = 2;

  if (hazard.type === 0) {
    context.beginPath();
    context.moveTo(0, -hazard.size);
    context.lineTo(hazard.size * 0.8, 0);
    context.lineTo(0, hazard.size);
    context.lineTo(-hazard.size * 0.8, 0);
    context.closePath();
    context.fill();
    context.stroke();
  } else if (hazard.type === 1) {
    context.beginPath();
    context.arc(0, 0, hazard.size * 0.72, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(0, 0, hazard.size * 0.3, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(-hazard.size * 0.9, 0);
    context.lineTo(hazard.size * 0.9, 0);
    context.moveTo(0, -hazard.size * 0.9);
    context.lineTo(0, hazard.size * 0.9);
    context.stroke();
  } else {
    context.beginPath();
    for (let point = 0; point < 8; point += 1) {
      const angle = point * Math.PI / 4;
      const radius = point % 2 === 0 ? hazard.size : hazard.size * 0.4;
      const pointX = Math.cos(angle) * radius;
      const pointY = Math.sin(angle) * radius;
      if (point === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    }
    context.closePath();
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(0, 0, hazard.size * 0.16, 0, Math.PI * 2);
    context.fillStyle = '#ff8066';
    context.fill();
  }

  context.restore();
}

const powerupStatus = document.querySelector('#powerup-status');
const powerupName = document.querySelector('#powerup-name');
const powerupTimer = document.querySelector('#powerup-timer');
const powerups = [
  { name: 'BOOST: move faster', color: '#d8f36b' },
  { name: 'SHIELD: one free hit', color: '#b8f7dc' },
  { name: 'MAGNET: pull energy', color: '#6de7e8' }
];
let activePowerup = null;
let powerupClock = 0;
let lastPowerupTime = performance.now();
let stars = [];

const baseDrawBackground = drawBackground;
drawBackground = function () {
  baseDrawBackground();
  if (stars.length === 0) {
    stars = Array.from({ length: 54 }, (_, index) => ({
      x: (index * 83) % Math.max(width, 1),
      y: (index * 47) % Math.max(height, 1),
      size: index % 5 === 0 ? 1.4 : 0.8,
      depth: 0.4 + (index % 4) * 0.12
    }));
  }
  context.save();
  context.fillStyle = 'rgba(184,247,220,.42)';
  stars.forEach((star) => {
    const y = (star.y + state.elapsed * 8 * star.depth) % height;
    context.globalAlpha = 0.28 + Math.sin(state.elapsed * 1.5 + star.x) * 0.08;
    context.beginPath();
    context.arc(star.x, y, star.size, 0, Math.PI * 2);
    context.fill();
  });
  context.restore();
};

function activatePowerup() {
  activePowerup = powerups[Math.floor(Math.random() * powerups.length)];
  powerupClock = 5;
  powerupStatus.style.borderColor = activePowerup.color;
  powerupName.textContent = activePowerup.name;
  powerupStatus.classList.remove('is-hidden');
  burst(ship.x, ship.y, activePowerup.color, 18);
}

function updatePowerup() {
  const now = performance.now();
  const delta = Math.min((now - lastPowerupTime) / 1000, 0.1);
  lastPowerupTime = now;
  if (state.active && !activePowerup && state.energy >= 15) {
    state.energy -= 15;
    activatePowerup();
    updateHud();
  }
  if (activePowerup) {
    powerupClock -= delta;
    powerupTimer.textContent = `${Math.max(0, powerupClock).toFixed(1)}s`;
    if (powerupClock <= 0) {
      activePowerup = null;
      powerupStatus.classList.add('is-hidden');
    }
  }
  requestAnimationFrame(updatePowerup);
}

const baseOverlaps = overlaps;
overlaps = function (first, second) {
  const isShard = second.size <= 8;
  const reach = activePowerup && activePowerup.name.startsWith('MAGNET') && isShard ? 2.8 : 1;
  return Math.abs(first.x - second.x) < first.width / 2 + second.size * 0.65 * reach && Math.abs(first.y - second.y) < first.height / 2 + second.size * 0.65 * reach;
};

const baseEndGame = endGame;
endGame = function () {
  if (activePowerup && activePowerup.name.startsWith('SHIELD')) {
    activePowerup = null;
    powerupStatus.classList.add('is-hidden');
    burst(ship.x, ship.y, '#b8f7dc', 28);
    return;
  }
  baseEndGame();
};

const baseUpdate = update;
update = function (delta) {
  const normalSpeed = ship.speed;
  if (activePowerup && activePowerup.name.startsWith('BOOST')) ship.speed = normalSpeed * 1.65;
  baseUpdate(delta);
  ship.speed = normalSpeed;
};

const baseStartGame = startGame;
startGame = function () {
  activePowerup = null;
  powerupClock = 0;
  powerupStatus.classList.add('is-hidden');
  baseStartGame();
};

updatePowerup();
