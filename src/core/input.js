export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0, left: false, right: false, wheel: 0 };
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('game:toggle-pause'));
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.mouse.left = true;
      if (e.button === 2) this.mouse.right = true;
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.left = false;
      if (e.button === 2) this.mouse.right = false;
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.mouse.wheel += e.deltaY;
    }, { passive: false });
  }

  isDown(key) {
    return this.keys.has(key.toLowerCase());
  }

  getMoveVector() {
    let vx = 0, vy = 0;
    if (this.isDown('w') || this.isDown('arrowup')) vy -= 1;
    if (this.isDown('s') || this.isDown('arrowdown')) vy += 1;
    if (this.isDown('a') || this.isDown('arrowleft')) vx -= 1;
    if (this.isDown('d') || this.isDown('arrowright')) vx += 1;

    const mag = Math.hypot(vx, vy);
    if (mag > 0) {
      return { x: vx / mag, y: vy / mag };
    }
    return { x: 0, y: 0 };
  }
}
