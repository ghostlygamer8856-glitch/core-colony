export class ResourceSystem {
  constructor(game) {
    this.game = game;
    this.inventory = { ORE: 0, CRYSTAL: 0 };
    this.pickups = [];
    this.floatingText = [];
  }

  tryMine(player, worldMouseX, worldMouseY) {
    let nearest = null;
    let nearestDist = Infinity;

    for (const node of this.game.world.resourceNodes) {
      if (node.depleted) continue;
      const d = Math.hypot(player.x - node.x, player.y - node.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = node;
      }
    }

    if (!nearest) return;

    const aimDist = Math.hypot(worldMouseX - player.x, worldMouseY - player.y);
    if (nearestDist > 120 || aimDist > 160) return;

    nearest.health -= 8;
    const hitX = nearest.x + (Math.random() - 0.5) * 8;
    const hitY = nearest.y + (Math.random() - 0.5) * 8;
    this.game.particles.spawn(hitX, hitY, '#ffd38c', 6, 50);

    if (nearest.health <= 0) {
      this.onNodeDepleted(nearest);
    }
  }

  onNodeDepleted(node) {
    node.depleted = true;
    this.game.world.depletedNodeIds.add(node.id);

    this.inventory[node.resource] = (this.inventory[node.resource] ?? 0) + node.amount;

    this.floatingText.push({
      x: node.x,
      y: node.y - 8,
      text: `+${node.amount} ${node.resource}`,
      color: node.resource === 'ORE' ? '#ffd38c' : '#9ef5ff',
      life: 1.1
    });

    this.game.particles.spawn(node.x, node.y, node.resource === 'ORE' ? '#ffbf5b' : '#7afcff', 18, 90);

    const pickupCount = node.amount;
    for (let i = 0; i < pickupCount; i++) {
      this.pickups.push({
        x: node.x,
        y: node.y,
        resource: node.resource,
        vx: (Math.random() - 0.5) * 70,
        vy: -50 - Math.random() * 30,
        life: 1.2,
        size: 4
      });
    }
  }

  update(dt, player) {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 25 * dt;

      const dx = player.x - p.x;
      const dy = player.y - p.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 24) {
        const pull = 180 / d;
        p.vx += dx * pull * dt;
        p.vy += dy * pull * dt;
      }

      if (d < 12) {
        this.inventory[p.resource] = (this.inventory[p.resource] ?? 0) + 1;
        this.floatingText.push({
          x: player.x,
          y: player.y - 14,
          text: `+1 ${p.resource}`,
          color: p.resource === 'ORE' ? '#ffd38c' : '#9ef5ff',
          life: 0.8
        });
        this.pickups.splice(i, 1);
      } else if (p.life <= 0) {
        this.pickups.splice(i, 1);
      }
    }

    for (let i = this.floatingText.length - 1; i >= 0; i--) {
      const t = this.floatingText[i];
      t.life -= dt;
      t.y -= 18 * dt;
      if (t.life <= 0) this.floatingText.splice(i, 1);
    }
  }

  draw(ctx, camera) {
    for (const p of this.pickups) {
      const sx = (p.x - camera.x) * camera.zoom;
      const sy = (p.y - camera.y) * camera.zoom;

      ctx.fillStyle = p.resource === 'ORE' ? '#f7c661' : '#90f5ff';
      ctx.fillRect(sx, sy, p.size * camera.zoom, p.size * camera.zoom);
    }

    for (const t of this.floatingText) {
      const sx = (t.x - camera.x) * camera.zoom;
      const sy = (t.y - camera.y) * camera.zoom;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 13px Segoe UI';
      ctx.globalAlpha = Math.max(0, t.life / 1.1);
      ctx.fillText(t.text, sx, sy);
      ctx.globalAlpha = 1;
    }
  }
}
