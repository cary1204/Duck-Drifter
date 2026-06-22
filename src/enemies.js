const enemies = {
  list: [],
  spawnTimer: 0,
  spawnInterval: 60,
  spawn(canvas) {
    const W = canvas.width;
    const H = canvas.height;
    const futureX = duck.x + duck.vx * 180;
    const futureY = duck.y + duck.vy * 180;
    //spawn
    const noise = 300;
    const targetX = futureX + (Math.random() - 0.5) * noise;
    const targetY = futureY + (Math.random() - 0.5) * noise;
    const screenX = targetX - duck.x + W / 2;
    const screenY = targetY - duck.y + H / 2;
    let spawnWorldX, spawnWorldY;
    const margin = 32;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { //up
      spawnWorldX = targetX;
      spawnWorldY = duck.y - H / 2 - margin;
    } else if (side === 1) { //down
      spawnWorldX = targetX;
      spawnWorldY = duck.y + H / 2 + margin;
    } else if (side === 2) { //left
      spawnWorldX = duck.x - W / 2 - margin;
      spawnWorldY = targetY;
    } else { //right
      spawnWorldX = duck.x + W / 2 + margin;
      spawnWorldY = targetY;
    }
    //bad ducks
    const baseAngle = Math.random() * Math.PI * 2;
    const baseSpeed = 1.5 + Math.random() * 1.5;
    const homingBase = 0.01;
    this.list.push({
      x: spawnWorldX,
      y: spawnWorldY,
      vx: Math.cos(baseAngle) * baseSpeed,
      vy: Math.sin(baseAngle) * baseSpeed,
      angle: baseAngle,       // visual
      heading: baseAngle,     // real vel
      wobbleTimer: 0,
      wobbleX: 0,
      wobbleY: 0,
      // go to plr
      homingStrength: homingBase + Math.random() * 0.008,

    }); 
  },
  update(canvas) {
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawn(canvas);
      this.spawn(canvas);
      this.spawn(canvas);
      this.spawnInterval = Math.max(30, this.spawnInterval - 2);
    }

    // bonus spawns at high speed
    const duckSpeed = Math.sqrt(duck.vx * duck.vx + duck.vy * duck.vy);
    if (duckSpeed > 8 && Math.random() > 0.95) this.spawn(canvas);
    if (duckSpeed > 10 && Math.random() > 0.92) this.spawn(canvas);

    const W = canvas.width;
    const H = canvas.height;
    const despawnMargin = 600;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      e.wobbleTimer++;
      if (e.wobbleTimer > 50 + Math.random() * 40) {
        e.wobbleTimer = 0;
        const wobbleAngle = Math.random() * Math.PI * 2;
        e.wobbleX = Math.cos(wobbleAngle) * 0.3;
        e.wobbleY = Math.sin(wobbleAngle) * 0.3;
      }
      // homing
      const toDuckX = duck.x - e.x;
      const toDuckY = duck.y - e.y;
      const dist = Math.sqrt(toDuckX * toDuckX + toDuckY * toDuckY);
      if (dist > 0) {
        e.vx += (toDuckX / dist) * e.homingStrength;
        e.vy += (toDuckY / dist) * e.homingStrength;
      }
      e.vx += e.wobbleX * 0.05;
      e.vy += e.wobbleY * 0.05;
      // speed cap
      const speed = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
      const maxSpeed = 12;
      if (speed > maxSpeed) {
        e.vx = (e.vx / speed) * maxSpeed;
        e.vy = (e.vy / speed) * maxSpeed;
      }
      e.x += e.vx;
      e.y += e.vy;
      // angle
      if (speed > 0.1) {
        e.heading = Math.atan2(e.vy, e.vx);
      }
      let angleDiff = e.heading - e.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      e.angle += angleDiff * 0.08;
      // despawn
      const sx = e.x - duck.x + W / 2;
      const sy = e.y - duck.y + H / 2;
      if (sx < -despawnMargin || sx > W + despawnMargin || sy < -despawnMargin || sy > H + despawnMargin) {
        this.list.splice(i, 1);
      }
    }
  },
  draw(ctx, cameraX, cameraY) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    for (const e of this.list) {
      const sx = Math.round(e.x - cameraX + W / 2);
      const sy = Math.round(e.y - cameraY + H / 2);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(e.angle);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(renderer.duckImg, -32, -32, 64, 64);
      ctx.restore();
    }
  }
};