import { CardMasterSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import CardScene from '../../card-scene';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import CardMasterSceneState from './cardmaster-scene-state';

class CardSceneState extends BaseSceneState {
    createScene(): void {
        this.scene = new CardScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch (sceneName) {
            case CardMasterSceneName:
                return new CardMasterSceneState();
        }
    }
}

export default CardSceneState;