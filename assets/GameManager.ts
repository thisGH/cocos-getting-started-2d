import { _decorator, Component, instantiate, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  boxPrefab: Prefab | null = null;

  _step = 40;
  _roadLength = 10;
  _road: BlockType[] = [];
  start() {
    this.generateRoad();
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
}

enum BlockType {
  NONE,
  STONE,
}
