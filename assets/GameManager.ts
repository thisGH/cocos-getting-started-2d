import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  boxPrefab: Prefab | null = null;

  @property({ type: Node })
  StartMenu: Node | null = null;

  @property({ type: PlayerController })
  PlayerController: PlayerController | null = null;

  @property({ type: Label })
  StepsLabel: Label | null = null;

  _step = 40;
  _roadLength = 10;
  _road: BlockType[] = [];
  start() {
    this.PlayerController.node.on("jumpEnd", this.onPlayerJumpEnd, this);
    this.setGameState(GameState.INIT);
  }

  update(deltaTime: number) {}

  generateRoad() {
    this.node.removeAllChildren();
    this._road = [];

    for (let i = 0; i < this._roadLength; i++) {
      if (i === 0) {
        this._road.push(BlockType.STONE);
      } else if (this._road[i - 1] === BlockType.NONE) {
        this._road.push(BlockType.STONE);
      } else {
        const ram = Math.round(Math.random());
        this._road.push(ram ? BlockType.STONE : BlockType.NONE);
      }
    }

    console.log(this._road);

    this._road.forEach((item, index) => {
      const block = this.spawnBlockByType(item);
      if (block) {
        block.setPosition(this._step * index, 0, 0);
        this.node.addChild(block);
      }
    });
  }
  spawnBlockByType(type) {
    if (!this.boxPrefab) {
      return null;
    }
    if (type === BlockType.STONE) {
      return instantiate(this.boxPrefab);
    }
    return null;
  }

  setGameState(state: GameState) {
    switch (state) {
      case GameState.INIT:
        this.init();
        break;
      case GameState.PLAYING:
        this.playing();
        break;
      case GameState.END:
        this.end();
        break;
    }
  }
  init() {
    this.StartMenu.active = true;
    this.PlayerController.setMouseActive(false);
    this.generateRoad();
    this.PlayerController.reset();
  }
  playing() {
    setTimeout(() => {
      this.PlayerController.setMouseActive(true);
    });
  }
  end() {
    this.setGameState(GameState.INIT);
  }

  onPlayButtonClick() {
    this.StartMenu.active = false;
    this.setGameState(GameState.PLAYING);
  }

  onPlayerJumpEnd(step: number) {
    this.StepsLabel.string = `${step}`;
    if (this._road[step] === BlockType.NONE) {
      this.setGameState(GameState.END);
    }
  }
}

enum BlockType {
  NONE,
  STONE,
}

enum GameState {
  INIT,
  PLAYING,
  END,
}
