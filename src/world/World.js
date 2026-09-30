function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class World {
  constructor() {
    this.tileSize = 16;
    this.width = 80;
    this.height = 80;
    this.viewWidth = 1280;
    this.viewHeight = 720;

    this.tiles = [];
    this.decorations = [];
    this.resourceNodes = [];
    this.depletedNodeIds = new Set();

    this.baseCenter = {
      x: (this.width * this.tileSize) / 2,
      y: (this.height * this.tileSize) / 2
    };

    this.startPosition = { x: this.baseCenter.x, y: this.baseCenter.y + 60 };
    this.corePosition = { x: this.baseCenter.x, y: this.baseCenter.y };
  }

  generate() {
    const rand = mulberry32(1337);

    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const dx = x - this.width / 2;
        const dy = y - this.height / 2;
        const distFromCenter = Math.hypot(dx, dy);

        let type = 'grass';
        if (distFromCenter < 11) type = 'grass';
        else {
          const r = rand();
          if (r < 0.22) type = 'sand';
          else if (r < 0.55) type = 'grass';
          else type = 'dirt';
        }

        if (x <= 1 || y <= 1 || x >= this.width - 2 || y >= this.height - 2) {
          type = 'dirt';
        }

        row.push(type);
      }
      this.tiles.push(row);
    }

    for (let y = 2; y < this.height - 2; y++) {
      for (let x = 2; x < this.width - 2; x++) {
        const worldX = x * this.tileSize + this.tileSize * 0.5;
        const worldY = y * this.tileSize + this.tileSize * 0.5;

        const centerDist = Math.hypot(
          worldX - this.baseCenter.x,
          worldY - this.baseCenter.y
        );

        if (centerDist > 90) {
          const r = rand();
          if (r < 0.04) {
            this.decorations.push({
              type: 'rock',
              x: worldX,
              y: worldY,
              radius: 12 + rand() * 8,
              solid: true
            });
          } else if (r < 0.08) {
            this.decorations.push({
              type: 'plant',
              x: worldX,
              y: worldY,
              radius: 8 + rand() * 6,
              solid: true
            });
          }
        }
      }
    }

    this.placeResourceNodes();
  }

  placeResourceNodes() {
    const rand = mulberry32(2020);
    const nodeCount = 30;

    for (let i = 0; i < nodeCount; i++) {
      const resource = rand() < 0.62 ? 'ORE' : 'CRYSTAL';
      let tries = 0;

      while (tries < 1000) {
        const x = 90 + rand() * (this.width * this.tileSize - 180);
        const y = 90 + rand() * (this.height * this.tileSize - 180);
        const dist = Math.hypot(x - this.baseCenter.x, y - this.baseCenter.y);

        if (dist > 180 && dist < 860) {
          const id = `node_${i}_${Math.round(x)}_${Math.round(y)}`;
          const amount = resource === 'ORE' ? 2 + Math.floor(rand() * 3) : 1 + Math.floor(rand() * 3);

          this.resourceNodes.push({
            id,
            resource,
            x,
            y,
            radius: resource === 'ORE' ? 12 : 10,
            health: resource === 'ORE' ? 18 : 16,
            maxHealth: resource === 'ORE' ? 18 : 16,
            amount,
            depleted: false
          });
          break;
        }
        tries++;
      }
    }
  }

  drawTileMap(ctx, camera) {
    const tileSize = this.tileSize;
    const startX = Math.floor(camera.x / tileSize) - 1;
    const startY = Math.floor(camera.y / tileSize) - 1;
    const endX = Math.ceil((camera.x + this.viewWidth / camera.zoom) / tileSize) + 1;
    const endY = Math.ceil((camera.y + this.viewHeight / camera.zoom) / tileSize) + 1;

    for (let y = Math.max(0, startY); y < Math.min(this.height, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(this.width, endX); x++) {
        const type = this.tiles[y][x];
        const drawX = x * tileSize - camera.x;
        const drawY = y * tileSize - camera.y;

        ctx.fillStyle = this.getTileColor(type);
        ctx.fillRect(drawX * camera.zoom, drawY * camera.zoom, tileSize * camera.zoom, tileSize * camera.zoom);

        if (type === 'grass') {
          ctx.fillStyle = 'rgba(120, 180, 120, 0.08)';
          if ((x + y) % 5 === 0) {
            ctx.fillRect(drawX * camera.zoom, drawY * camera.zoom, tileSize * camera.zoom, tileSize * camera.zoom);
          }
        }
      }
    }
  }

  getTileColor(type) {
    switch (type) {
      case 'sand': return '#6f7c6d';
      case 'dirt': return '#4d443d';
      default: return '#2d6c69';
    }
  }

  isBlocked(x, y, radius = 10) {
    if (x - radius < 0 || x + radius > this.width * this.tileSize ||
        y - radius < 0 || y + radius > this.height * this.tileSize) {
      return true;
    }

    const coreDist = Math.hypot(x - this.corePosition.x, y - this.corePosition.y);
    if (coreDist < 28 + radius) {
      return true;
    }

    for (const deco of this.decorations) {
      const d = Math.hypot(x - deco.x, y - deco.y);
      if (d < radius + deco.radius) return true;
    }

    return false;
  }
}
