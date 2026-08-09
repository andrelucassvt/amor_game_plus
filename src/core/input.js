const GAME_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyA', 'KeyD', 'KeyW',
]);

export class InputController {
  constructor(canvas, onPause) {
    this.keys = new Set();
    this.jumpRequested = false;
    this.canvas = canvas;
    this.onPause = onPause;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
  }

  get horizontalAxis() {
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA');
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD');
    return Number(right) - Number(left);
  }

  consumeJump() {
    const requested = this.jumpRequested;
    this.jumpRequested = false;
    return requested;
  }

  handleKeyDown(event) {
    if (GAME_KEYS.has(event.code)) event.preventDefault();
    this.keys.add(event.code);

    if (!event.repeat && ['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
      this.jumpRequested = true;
    }

    if (!event.repeat && event.code === 'Escape') this.onPause();
  }

  handleKeyUp(event) {
    this.keys.delete(event.code);
  }

  handlePointerDown() {
    this.jumpRequested = true;
  }
}
