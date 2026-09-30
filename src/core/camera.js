export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.targetZoom = 1;
    this.smoothing = 0.12;
  }

  update(dt, player, world) {
    const targetX = player.x - (world.viewWidth * 0.5) / this.zoom;
    const targetY = player.y - (world.viewHeight * 0.5) / this.zoom;

    const minX = 0;
    const minY = 0;
    const maxX = world.width * world.tileSize - world.viewWidth / this.zoom;
    const maxY = world.height * world.tileSize - world.viewHeight / this.zoom;

    this.x += (Math.max(minX, Math.min(maxX, targetX)) - this.x) * this.smoothing;
    this.y += (Math.max(minY, Math.min(maxY, targetY)) - this.y) * this.smoothing;

    this.zoom += (this.targetZoom - this.zoom) * (0.18 + dt * 0.5);
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x) * this.zoom,
      y: (wy - this.y) * this.zoom
    };
  }

  screenToWorld(sx, sy) {
    return {
      x: sx / this.zoom + this.x,
      y: sy / this.zoom + this.y
    };
  }
}
