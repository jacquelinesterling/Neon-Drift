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
const energyGoal = document.querySelector('#energy-count');
const powerups = [
  { name: 'BOOST: move faster', color: '#d8f36b' },
  { name: 'SHIELD: one free hit', color: '#b8f7dc' },
  { name: 'MAGNET: pull energy', color: '#6de7e8' }
];
let activePowerup = null;
let powerupClock = 0;
let lastPowerupTime = performance.now();
let stars = [];
const traffic = [
  { x: 0.12, y: 0.24, speed: 18, size: 10, color: '#d8f36b' },
  { x: 0.68, y: 0.42, speed: 27, size: 8, color: '#d8f36b' },
  { x: 0.38, y: 0.68, speed: 14, size: 7, color: '#d8f36b' }
];
const backgroundNodes = [
  { x: 0.16, y: 0.18 }, { x: 0.28, y: 0.11 }, { x: 0.42, y: 0.2 },
  { x: 0.72, y: 0.28 }, { x: 0.82, y: 0.2 }, { x: 0.9, y: 0.34 }
];

function trafficPosition(craft) {
  return ((craft.x * width + state.elapsed * craft.speed) % (width + 80)) - 40;
}

function drawTimeOfDay() {
  const cycle = state.elapsed % 48;
  let tint = 'rgba(7,21,28,.08)';
  let celestial = '#6de7e8';
  if (cycle >= 12 && cycle < 24) {
    tint = 'rgba(58,128,142,.18)';
    celestial = '#d8f36b';
  } else if (cycle >= 24 && cycle < 36) {
    tint = 'rgba(188,86,72,.16)';
    celestial = '#ff8066';
  } else if (cycle >= 36) {
    tint = 'rgba(3,9,22,.24)';
    celestial = '#b8f7dc';
  }
  context.save();
  context.fillStyle = tint;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = 0.22;
  context.fillStyle = celestial;
  context.shadowBlur = 20;
  context.shadowColor = celestial;
  context.beginPath();
  context.arc(width * 0.82, height * 0.16, 22, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

const baseDrawBackground = drawBackground;
drawBackground = function () {
  baseDrawBackground();
  drawTimeOfDay();
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
  context.strokeStyle = 'rgba(184,247,220,.14)';
  context.lineWidth = 1;
  context.beginPath();
  backgroundNodes.forEach((node, index) => {
    const x = node.x * width;
    const y = node.y * height;
    if (index === 0 || index === 3) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
  context.fillStyle = 'rgba(216,243,107,.2)';
  backgroundNodes.forEach((node, index) => {
    if (index !== 0 && index !== 3) return;
    context.beginPath();
    context.arc(node.x * width, node.y * height, 2.5, 0, Math.PI * 2);
    context.fill();
  });
  context.fillStyle = 'rgba(109,231,232,.2)';
  for (let mote = 0; mote < 12; mote += 1) {
    const x = (mote * 137 + state.elapsed * (4 + mote % 3)) % width;
    const y = (mote * 79 + state.elapsed * 3) % height;
    context.fillRect(x, y, 1, 1);
  }
  traffic.forEach((craft) => {
    const x = trafficPosition(craft);
    const y = craft.y * height;
    context.globalAlpha = 0.86;
    context.fillStyle = craft.color;
    context.strokeStyle = craft.color;
    context.shadowBlur = 12;
    context.shadowColor = craft.color;
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(x + craft.size * 2, y);
    context.lineTo(x - craft.size, y - craft.size * 0.55);
    context.lineTo(x - craft.size * 1.8, y);
    context.lineTo(x - craft.size, y + craft.size * 0.55);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillRect(x - craft.size * 2.8, y - 1, craft.size * 1.2, 2);
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
  if (state.active && !activePowerup && state.energy >= 10) {
    state.energy -= 10;
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
  traffic.forEach((craft) => {
    const x = trafficPosition(craft);
    const y = craft.y * height;
    if (Math.abs(ship.x - x) < ship.width / 2 + craft.size * 1.5 && Math.abs(ship.y - y) < ship.height / 2 + craft.size * 0.7) {
      endGame();
    }
  });
  if (activePowerup && activePowerup.name.startsWith('MAGNET')) {
    state.shards.forEach((shard) => {
      const differenceX = ship.x - shard.x;
      const differenceY = ship.y - shard.y;
      const distance = Math.hypot(differenceX, differenceY);
      if (distance < 260 && distance > 1) {
        const pull = Math.min(1, delta * 5);
        shard.x += differenceX * pull;
        shard.y += differenceY * pull;
      }
    });
  }
  baseUpdate(delta);
  ship.speed = normalSpeed;
};

const baseDrawShip = drawShip;
drawShip = function () {
  baseDrawShip();
  if (activePowerup && activePowerup.name.startsWith('MAGNET')) {
    context.save();
    context.strokeStyle = 'rgba(109,231,232,.5)';
    context.shadowBlur = 16;
    context.shadowColor = '#6de7e8';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(ship.x, ship.y, 84 + Math.sin(state.elapsed * 8) * 8, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
};

const baseStartGame = startGame;
startGame = function () {
  activePowerup = null;
  powerupClock = 0;
  powerupStatus.classList.add('is-hidden');
  baseStartGame();
};

canvas.addEventListener('pointermove', (event) => {
  if (!state.active || event.pointerType !== 'mouse') return;
  const rect = canvas.getBoundingClientRect();
  ship.x = Math.max(26, Math.min(width - 26, event.clientX - rect.left));
});

const baseUpdateHud = updateHud;
updateHud = function () {
  baseUpdateHud();
  energyGoal.textContent = `${state.energy} / 10`;
  energyFill.style.width = `${Math.min(state.energy / 10 * 100, 100)}%`;
};

energyGoal.textContent = `${state.energy} / 10`;
energyFill.style.width = `${Math.min(state.energy / 10 * 100, 100)}%`;

updatePowerup();
