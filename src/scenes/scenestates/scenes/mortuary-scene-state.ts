import { CardSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import GameModel from '../../../models/game-model';
import MortuaryScene from '../../mortuary-scene';
import CardSceneState from './card-scene-state';
import { GameController } from '../../../controllers/game-controller';

class MortuarySceneState extends BaseSceneState {
    createScene(): void {
        this.scene = new MortuaryScene();
    }

    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case CardSceneName:
                return new CardSceneState();
        }
    }
}

export default MortuarySceneState;