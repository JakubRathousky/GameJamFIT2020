import { FirstSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import { CardMasterScene } from '../../card-master-scene';
import FirstSceneState from './first-scene-state';

class CardMasterSceneState extends BaseSceneState {
    createScene() : void {
        this.scene = new CardMasterScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case FirstSceneName:
                return new FirstSceneState();
        }
    }
}

export default CardMasterSceneState;