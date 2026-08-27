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
