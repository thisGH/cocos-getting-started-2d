import {
  _decorator,
  Animation,
  Component,
  EventMouse,
  Input,
  input,
  Node,
  Vec2,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(Animation)
  BodyAnim: Animation = null;

  _isJumping = false;
  _jumpStep = 40;
  _jumpTime = 1;
  _jumpSpeed = 0;
  _curJumpTime = 0;
  _endPos = new Vec3();

  _totalStep = 0;

  reset() {
    this._endPos.set(0, 0, 0);
    this._totalStep = 0;
  }

  start() {}

  setMouseActive(active: boolean) {
    if (active) {
      input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    } else {
      input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
  }

  update(deltaTime: number) {
    this._curJumpTime += deltaTime;

    if (this._curJumpTime > this._jumpTime) {
      this._isJumping = false;
      this.node.setPosition(this._endPos);
      this.onJumpEnd();
      return;
    }

    const curPosition = this.node.getPosition(new Vec3());
    curPosition.x += this._jumpSpeed * deltaTime;
    this.node.setPosition(curPosition);
  }
  onMouseUp(event: EventMouse) {
    if (this._isJumping) return;

    if (event.getButton() === 0) {
      this.jumpByStep(1);
      this.BodyAnim.play("oneStep");
    }
    if (event.getButton() === 2) {
      this.jumpByStep(2);
      this.BodyAnim.play("twoStep");
    }
  }

  jumpByStep(step: number) {
    const curPosition = this.node.getPosition(new Vec3());
    curPosition.x += this._jumpStep * step;
    this._endPos = curPosition;
    this._isJumping = true;
    this._curJumpTime = 0;
    this._jumpSpeed = (this._jumpStep * step) / this._jumpTime;

    this._totalStep += step;
  }
  onJumpEnd() {
    this.node.emit("jumpEnd", this._totalStep);
  }
}
