import { Camera } from './camera.js';
import { InputManager } from './input.js';
import { World } from '../world/World.js';
import { Player } from '../entities/Player.js';
import { Core } from '../entities/Core.js';
import { ParticleSystem } from '../systems/particles.js';
import { ResourceSystem } from '../systems/ResourceSystem.js';
import { HUD } from '../ui/HUD.js';

const STORAGE_KEY = 'core_colony_save_v1';

export class Game {
  constructor(canvas, pauseMenu) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.input = new InputManager(canvas);
    this.camera = new Camera();

    this.world = new World();
    this.world.generate();

    this.player = new Player(this.world.startPosition.x, this.world.startPosition.y);
    this.core = new Core(this.world.corePosition.x, this.world.corePosition.y);
    this.particles = new ParticleSystem();
    this.resourceSystem = new ResourceSystem(this);
    this.hud = new HUD(this);

    this.paused = false;
    this.pauseMenu = pauseMenu;
    this.lastTime = 0;

    this.loadSave();

    const self = this;
    window.addEventListener('game:toggle-pause', () => {
      self.togglePause();
    });

    document.getElementById('resumeBtn')?.addEventListener('click', () => {
      this.togglePause(false);
    });

    document.getElementById('newGameBtn')?.addEventListener('click', () => {
      this.newGame();
      this.togglePause(false);
    });

    window.addEventListener('beforeunload', () => {
      this.saveGame();
    });

    this.spawnCoreParticles();
  }

  spawnCoreParticles() {
    for (let i = 0; i < 16; i++) {
      this.particles.spawn(
        this.core.x + (Math.random() - 0.5) * 30,
        this.core.y - 26,
        '#7ef3ff',
        3,
        18
      );
    }
  }

  togglePause(force) {
    if (typeof force === 'boolean') {
      this.paused = force ? false : true;
    } else {
      this.paused = !this.paused;
    }

    if (this.pauseMenu) {
      this.pauseMenu.classList.toggle('visible', this.paused);
    }
  }

  newGame() {
    this.world = new World();
    this.world.generate();

    this.player = new Player(this.world.startPosition.x, this.world.startPosition.y);
    this.core = new Core(this.world.corePosition.x, this.world.corePosition.y);
    this.resourceSystem.inventory = { ORE: 0, CRYSTAL: 0 };
    this.resourceSystem.floatingText = [];
    this.resourceSystem.pickups = [];
    this.world.depletedNodeIds.clear();

    for (let i = this.world.resourceNodes.length - 1; i >= 0; i--) {
      this.world.resourceNodes[i].depleted = false;
      this.world.resourceNodes[i].health = this.world.resourceNodes[i].maxHealth;
    }

    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.zoom = 1;
    this.camera.targetZoom = 1;
    this.saveGame();
  }

  loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (!data) return;

      this.resourceSystem.inventory = {
        ORE: Number(data.inventory?.ORE || 0),
        CRYSTAL: Number(data.inventory?.CRYSTAL || 0)
      };

      if (data.player) {
        this.player.x = Number(data.player.x || this.world.startPosition.x);
        this.player.y = Number(data.player.y || this.world.startPosition.y);
      }

      if (data.core) {
        this.core.hp = Number(data.core.hp || this.core.maxHp);
      }

      if (Array.isArray(data.depletedNodes)) {
        this.world.depletedNodeIds = new Set(data.depletedNodes);
        for (const node of this.world.resourceNodes) {
          node.depleted = this.world.depletedNodeIds.has(node.id);
          if (node.depleted) node.health = 0;
        }
      }
    } catch {
      console.warn('Unable to load save file.');
    }
  }

  saveGame() {
    const data = {
      inventory: this.resourceSystem.inventory,
      player: { x: this.player.x, y: this.player.y },
      core: { hp: this.core.hp },
      depletedNodes: [...this.world.depletedNodeIds]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  start() {
    requestAnimationFrame((ts) => this.frame(ts));
  }

  frame(ts) {
    const dt = Math.min(0.033, (ts - this.lastTime) / 1000 || 0.016);
    this.lastTime = ts;

    this.update(dt);
    this.render();

    requestAnimationFrame((nextTs) => this.frame(nextTs));
  }

  update(dt) {
    if (this.paused) return;

    const worldW = this.world.width * this.world.tileSize;
    const worldH = this.world.height * this.world.tileSize;

    const wheelDelta = this.input.mouse.wheel;
    if (Math.abs(wheelDelta) > 0.01) {
      this.camera.targetZoom = Math.max(0.9, Math.min(1.8, this.camera.targetZoom + wheelDelta * -0.0015));
      this.input.mouse.wheel = 0;
    }

    this.camera.update(dt, this.player, this.world);
    this.player.update(dt, this.input, this.world, this);
    this.core.update(dt, this.particles);
    this.resourceSystem.update(dt, this.player);
    this.hud.update(dt);

    this.world.viewWidth = this.canvas.width;
    this.world.viewHeight = this.canvas.height;

    this.player.x = Math.max(18, Math.min(worldW - 18, this.player.x));
    this.player.y = Math.max(18, Math.min(worldH - 18, this.player.y));

    if (this._saveAccumulator === undefined) this._saveAccumulator = 0;
    this._saveAccumulator += dt;
    if (this._saveAccumulator > 15) {
      this.saveGame();
      this._saveAccumulator = 0;
    }
  }

  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#07151b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.world.drawTileMap(ctx, this.camera);

    const renderables = [];
    for (const deco of this.world.decorations) {
      renderables.push({ type: 'deco', y: deco.y, object: deco });
    }
    for (const node of this.world.resourceNodes) {
      if (!node.depleted) {
        renderables.push({ type: 'node', y: node.y, object: node });
      }
    }
    renderables.sort((a, b) => a.y - b.y);

    for (const item of renderables) {
      if (item.type === 'deco') {
        const deco = item.object;
        const sx = (deco.x - this.camera.x) * this.camera.zoom;
        const sy = (deco.y - this.camera.y) * this.camera.zoom;
        ctx.fillStyle = deco.type === 'rock' ? '#4f5661' : '#3c8f6b';
        ctx.beginPath();
        ctx.ellipse(sx, sy, deco.radius * this.camera.zoom * 0.8, deco.radius * this.camera.zoom * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        if (deco.type === 'plant') {
          ctx.strokeStyle = '#7ef0b5';
          ctx.lineWidth = 2 * this.camera.zoom;
          ctx.beginPath();
          ctx.moveTo(sx, sy - deco.radius * this.camera.zoom);
          ctx.lineTo(sx + 4 * this.camera.zoom, sy - 10 * this.camera.zoom);
          ctx.moveTo(sx, sy - deco.radius * this.camera.zoom);
          ctx.lineTo(sx - 4 * this.camera.zoom, sy - 10 * this.camera.zoom);
          ctx.stroke();
        }
      }

      if (item.type === 'node') {
        const node = item.object;
        const sx = (node.x - this.camera.x) * this.camera.zoom;
        const sy = (node.y - this.camera.y) * this.camera.zoom;

        const pulse = 1 + Math.sin((performance.now() * 0.006) + node.x) * 0.1;

        ctx.fillStyle = node.resource === 'ORE' ? '#ffb95d' : '#7bf0ff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(sx, sy, (node.radius * 0.8 + 4) * this.camera.zoom * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(0,0,0,0.30)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + 10 * this.camera.zoom, node.radius * this.camera.zoom, 6 * this.camera.zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#c9e7f5';
        ctx.fillRect(sx - 18 * this.camera.zoom, sy - 26 * this.camera.zoom, 36 * this.camera.zoom, 4 * this.camera.zoom);
        ctx.fillStyle = node.resource === 'ORE' ? '#ffb95d' : '#7bf0ff';
        ctx.fillRect(sx - 18 * this.camera.zoom, sy - 26 * this.camera.zoom, (36 * (node.health / node.maxHealth)) * this.camera.zoom, 4 * this.camera.zoom);
      }
    }

    this.core.draw(this.ctx, this.camera);
    this.player.draw(this.ctx, this.camera);
    this.particles.draw(this.ctx, this.camera);
    this.resourceSystem.draw(this.ctx, this.camera);
    this.hud.draw(this.ctx, this.camera);

    const mouse = this.input.mouse;
    if (mouse.x && mouse.y) {
      const pos = this.camera.screenToWorld(mouse.x, mouse.y);
      this.input.setMouseWorld = (x, y) => {
        this.input.mouse.worldX = x;
        this.input.mouse.worldY = y;
      };
      this.input.setMouseWorld(pos.x, pos.y);
    }
  }
}
