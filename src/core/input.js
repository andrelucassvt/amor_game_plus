const GAME_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyA', 'KeyD', 'KeyW',
]);

export class InputController {
  constructor(canvas, onPause, touchControls = {}) {
    this.keys = new Set();
    this.jumpRequested = false;
    this.touchAxis = 0;
    this.canvas = canvas;
    this.onPause = onPause;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    canvas.addEventListener('pointerdown', this.handlePointerDown);

    this.bindTouchControls(touchControls);
  }

  bindTouchControls({ left, right, jump } = {}) {
    if (left) {
      this.bindHoldButton(
        left,
        () => { this.touchAxis = -1; },
        () => { if (this.touchAxis === -1) this.touchAxis = 0; },
      );
    }
    if (right) {
      this.bindHoldButton(
        right,
        () => { this.touchAxis = 1; },
        () => { if (this.touchAxis === 1) this.touchAxis = 0; },
      );
    }
    if (jump) {
      jump.addEventListener('pointerdown', event => {
        event.preventDefault();
        this.jumpRequested = true;
      });
    }
  }

  bindHoldButton(element, onPress, onRelease) {
    element.addEventListener('pointerdown', event => {
      event.preventDefault();
      element.setPointerCapture?.(event.pointerId);
      onPress();
    });
    element.addEventListener('pointerup', onRelease);
    element.addEventListener('pointercancel', onRelease);
    element.addEventListener('pointerleave', onRelease);
  }

  get horizontalAxis() {
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA');
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD');
    const keyboardAxis = Number(right) - Number(left);
    return keyboardAxis !== 0 ? keyboardAxis : this.touchAxis;
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
