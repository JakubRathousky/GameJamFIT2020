import * as PIXI from 'pixi.js';
import BaseScene from "./scene-base";
import IntroModel from '../models/intro-model';
import { IntroController } from '../controllers/intro-controller';
import { GameController } from '../controllers/game-controller';
import GameModel from '../models/game-model';

class IntroScene extends BaseScene {
  introModel: IntroModel;
  introController: IntroController;

  init(app: PIXI.Application, gameModel: GameModel, afterTransitionCallback: (nextScene: string) => void) {
    super.init(app, gameModel, afterTransitionCallback);
    this.introController = new IntroController();
    this.introModel = new IntroModel(this.app, this.introController, this.afterTransitionCallback);
    this.introController.init(this.introModel);
    this.introModel.init();

  }

  update(delta: number, absolute: number) {
    this.introModel.update(delta, absolute);
    this.introController.update(delta, absolute);
  }
}

export default IntroScene;