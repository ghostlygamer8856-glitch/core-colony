export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(x, y, color, count = 8, spread = 80) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.8;
      const speed = (Math.random() * spread) * 0.4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.8,
        life: 0.4 + Math.random() * 0.7,
        maxLife: 0.4 + Math.random() * 0.7,
        color,
        size: 1 + Math.random() * 2
      });
    }
  }

  spawnDust(x, y, color = '#b5d7cc', count = 3) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 8,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        color,
        size: 1 + Math.random() * 2
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 7 * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(ctx, camera) {
    for (const p of this.particles) {
      const sx = (p.x - camera.x) * camera.zoom;
      const sy = (p.y - camera.y) * camera.zoom;
      const s = p.size * camera.zoom;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillRect(sx, sy, s, s);
      ctx.globalAlpha = 1;
    }
  }
}
