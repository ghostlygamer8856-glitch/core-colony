import { RESOURCE_DEFS } from '../data/resources.js';

export class HUD {
  constructor(game) {
    this.game = game;
    this.fadeHint = 1;
    this.hintTimer = 0;
  }

  update(dt) {
    const input = this.game.input;

    if (input.isDown('w') || input.isDown('a') || input.isDown('s') || input.isDown('d') ||
        input.mouse.left) {
      this.hintTimer = 2.8;
    }

    if (this.hintTimer > 0) {
      this.hintTimer -= dt;
      this.fadeHint = Math.max(0, this.hintTimer / 2.8);
    } else {
      this.fadeHint *= 0.96;
    }
  }

  draw(ctx, camera) {
    const { width, height } = this.game.canvas;

    const inventoryX = 18;
    const inventoryY = 18;
    const rowW = 170;

    ctx.fillStyle = 'rgba(9, 20, 30, 0.72)';
    ctx.fillRect(inventoryX, inventoryY, rowW, 72);
    ctx.strokeStyle = '#2b5869';
    ctx.strokeRect(inventoryX, inventoryY, rowW, 72);

    let dx = inventoryX + 18;
    let dy = inventoryY + 20;

    for (const key of ['ORE', 'CRYSTAL']) {
      const def = RESOURCE_DEFS[key];
      const value = this.game.resourceSystem.inventory[key] ?? 0;

      ctx.fillStyle = def.color;
      ctx.fillRect(dx, dy, 10, 10);
      ctx.fillStyle = '#e7f8ff';
      ctx.font = 'bold 16px Segoe UI';
      ctx.fillText(`${def.label}: ${value}`, dx + 18, dy + 10);
      dy += 20;
    }

    const coreX = width * 0.5 - 220;
    const coreY = 18;
    const coreBarW = 440;
    const coreBarH = 18;

    ctx.fillStyle = 'rgba(9, 20, 30, 0.72)';
    ctx.fillRect(coreX, coreY, coreBarW, 46);
    ctx.strokeStyle = '#2b5869';
    ctx.strokeRect(coreX, coreY, coreBarW, 46);

    const healthRatio = this.game.core.hp / this.game.core.maxHp;
    const barFill = coreBarW - 20;
    const filledWidth = Math.max(0, barFill * healthRatio);

    ctx.fillStyle = '#2d4a5d';
    ctx.fillRect(coreX + 10, coreY + 22, barFill, coreBarH);

    ctx.fillStyle = '#5ef0ff';
    ctx.fillRect(coreX + 10, coreY + 22, filledWidth, coreBarH);

    ctx.fillStyle = '#dffcff';
    ctx.font = 'bold 13px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('CORE', coreX + coreBarW * 0.5, coreY + 16);
    ctx.textAlign = 'left';

    const hintAlpha = this.fadeHint;
    ctx.fillStyle = `rgba(23, 40, 48, ${0.5 * hintAlpha})`;
    ctx.fillRect(width * 0.5 - 215, height - 45, 430, 30);

    ctx.fillStyle = `rgba(214, 236, 245, ${0.9 * hintAlpha})`;
    ctx.font = '13px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('WASD / Arrows = move  •  Mouse aim  •  Left click = mine  •  Scroll = zoom  •  Esc = pause', width * 0.5, height - 24);
    ctx.textAlign = 'left';
  }
}
