import { buildCoreSprites } from '../render/sprites/coreSprites.js';

export class Core {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxHp = 1000;
    this.hp = 1000;
    this.pulse = 0;
    this.fxTimer = 0;
    this.sprites = buildCoreSprites();
  }

  update(dt, particles) {
    this.pulse += dt * 4.2;
    this.fxTimer += dt;

    if (this.fxTimer > 0.12) {
      this.fxTimer = 0;
      particles.spawn(this.x + (Math.random() - 0.5) * 20, this.y - 18, '#82f8ff', 3, 20);
    }
  }

  draw(ctx, camera) {
    const base = this.sprites.base;
    const front = this.sprites.front;
    const gem = this.sprites.gem[Math.floor(this.pulse * 2.5) % this.sprites.gem.length];

    const sx = (this.x - camera.x) * camera.zoom;
    const sy = (this.y - camera.y) * camera.zoom;

    const glow = ctx.createRadialGradient(
      sx, sy + 30 * camera.zoom, 8 * camera.zoom,
      sx, sy + 30 * camera.zoom, 100 * camera.zoom
    );
    glow.addColorStop(0, 'rgba(111, 242, 255, 0.55)');
    glow.addColorStop(1, 'rgba(111, 242, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 100 * camera.zoom, sy - 70 * camera.zoom, 200 * camera.zoom, 200 * camera.zoom);

    ctx.drawImage(
      base.canvas,
      sx - base.ax * camera.zoom,
      sy - base.ay * camera.zoom,
      base.w * camera.zoom,
      base.h * camera.zoom
    );

    const gemOffset = 2 * camera.zoom;
    ctx.drawImage(
      gem.canvas,
      sx - gem.ax * camera.zoom,
      sy - 62 * camera.zoom + Math.sin(this.pulse) * 4 * camera.zoom,
      gem.w * camera.zoom,
      gem.h * camera.zoom
    );

    ctx.drawImage(
      front.canvas,
      sx - front.ax * camera.zoom,
      sy - front.ay * camera.zoom,
      front.w * camera.zoom,
      front.h * camera.zoom
    );

    const barW = 84;
    const barH = 8;
    const hpR = this.hp / this.maxHp;
    const barX = sx - barW * 0.5;
    const barY = sy - 80 * camera.zoom;

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(barX, barY, barW * camera.zoom, barH * camera.zoom);

    ctx.fillStyle = '#46d4f2';
    ctx.fillRect(barX, barY, (barW * hpR) * camera.zoom, barH * camera.zoom);

    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.strokeRect(barX, barY, barW * camera.zoom, barH * camera.zoom);
  }
}
