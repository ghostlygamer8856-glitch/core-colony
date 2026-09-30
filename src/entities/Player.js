import { buildRobotAtlas } from '../render/sprites/robot.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 86;
    this.dir = 'down';
    this.animTime = 0;
    this.walkDustTimer = 0;
    this.swingTime = 0;
    this.attackCooldown = 0;
    this.atlas = buildRobotAtlas();
    this.facing = { x: 0, y: 1 };
    this.aimWorld = { x: x, y: y + 40 };
    this.lastX = x;
    this.lastY = y;
  }

  update(dt, input, world, game) {
    const move = input.getMoveVector();
    let dx = move.x * this.speed * dt;
    let dy = move.y * this.speed * dt;

    if (move.x !== 0 || move.y !== 0) {
      const mag = Math.hypot(dx, dy);
      if (mag > 0) {
        dx = (dx / mag) * this.speed * dt;
        dy = (dy / mag) * this.speed * dt;
      }

      const nextX = this.x + dx;
      if (!world.isBlocked(nextX, this.y, this.radius)) this.x = nextX;

      const nextY = this.y + dy;
      if (!world.isBlocked(this.x, nextY, this.radius)) this.y = nextY;

      this.animTime += dt * 9;
      this.walkDustTimer += dt;
      if (this.walkDustTimer > 0.12) {
        this.walkDustTimer = 0;
        game.particles.spawnDust(this.x, this.y + 6, '#dceee8', 2);
      }
    } else {
      this.animTime += dt * 2.5;
    }

    this.aimWorld.x = input.mouse.worldX ?? this.x;
    this.aimWorld.y = input.mouse.worldY ?? this.y + 50;

    const fx = this.aimWorld.x - this.x;
    const fy = this.aimWorld.y - this.y;

    if (Math.abs(fx) > Math.abs(fy)) {
      this.dir = fx >= 0 ? 'right' : 'left';
    } else {
      this.dir = fy >= 0 ? 'down' : 'up';
    }

    this.facing.x = fx;
    this.facing.y = fy;

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.swingTime > 0) this.swingTime -= dt;

    if (input.mouse.left && this.attackCooldown <= 0) {
      this.attackCooldown = 0.2;
      this.swingTime = 0.18;
      game.resourceSystem.tryMine(this, input.mouse.worldX, input.mouse.worldY);
    }
  }

  draw(ctx, camera) {
    const dir = this.dir;
    const atlasDir = dir === 'right' ? 'right' : dir === 'left' ? 'left' : dir;
    const pose = this.swingTime > 0 ? 'swing' : (Math.abs(this.x - this.lastX) > 0.01 || Math.abs(this.y - this.lastY) > 0.01 ? 'walk' : 'idle');

    const spriteSet = this.atlas[atlasDir][pose];
    const frameIndex = this.getFrameIndex(pose, spriteSet.length);
    const s = spriteSet[frameIndex];

    const screenX = (this.x - camera.x) * camera.zoom;
    const screenY = (this.y - camera.y) * camera.zoom;

    const drawX = screenX - s.ax * camera.zoom;
    const drawY = screenY - s.ay * camera.zoom;

    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 12 * camera.zoom, 14 * camera.zoom, 7 * camera.zoom, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s.canvas, drawX, drawY, s.w * camera.zoom, s.h * camera.zoom);
    this.lastX = this.x;
    this.lastY = this.y;
  }

  getFrameIndex(pose, length) {
    if (pose === 'idle') return Math.floor(this.animTime * 0.8) % length;
    if (pose === 'walk') return Math.floor(this.animTime) % length;
    return Math.floor(this.animTime * 1.5) % length;
  }
}
