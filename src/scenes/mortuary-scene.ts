import * as PIXI from 'pixi.js';
import BaseScene from './scene-base';
import GameModel from '../models/game-model';
import { ComplexDialog } from '../models/complex-dialog';
import { Assets } from '../constants';
import { DialogManager } from '../models/dialog-manager';
import { CardSceneName } from './scenestates/scene-names';
import { KeyController } from '../controllers/key-controller';

class MortuaryScene extends BaseScene {
  keyController: KeyController;

  init(app: PIXI.Application, gameModel: GameModel, afterTransitionCallback: (nextScene: string) => void) {
    console.log(afterTransitionCallback);
    super.init(app, gameModel, afterTransitionCallback);
    let dialogJSON = PIXI.Loader.shared.resources[Assets.MORTUARYSCENEDIALOG].data;
    let complexDialog = new ComplexDialog(dialogJSON.marnice_intro);

    this.gameModel.dialogManager.displayComplexDialog(complexDialog, () => {
      this.afterTransitionCallback(CardSceneName);
    });
  }

  update(delta: number, absolute: number) {
    this.gameModel.dialogManager.update(delta, absolute);
  }
}

export default MortuaryScene;