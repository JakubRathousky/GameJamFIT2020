import { HeroController } from './hero-controller';
import { KeyController } from './key-controller';
import GameModel from '../models/game-model';
import { CameraController } from './camera-controller';

export class GameController {

  private heroController: HeroController;
  private cameraController: CameraController;
  private _gameModel: GameModel;
  keyController: KeyController;

  constructor() {
    this.keyController = new KeyController();
  }

  init(gameModel: GameModel) {
    this._gameModel = gameModel;
    this.heroController = new HeroController(this);
    this.cameraController = new CameraController(this);
    this.keyController.init();
  }

  destroy() {
    this.keyController.destroy();
  }

  isKeyPressed(keyCode: number) {
    return this.keyController.isKeyPressed(keyCode);
  }

  get pressedKeys() {
    return this.keyController.pressedKeys;
  }

  get gameModel() {
    return this._gameModel;
  }

  update(delta: number, absolute: number) {
    this.cameraController.update(delta, absolute);
    this.heroController.update(delta, absolute);
  }
}