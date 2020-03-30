import { MortuarySceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import IntroScene from '../../intro-scene';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import MortuarySceneState from './mortuary-scene-state';

class IntroSceneState extends BaseSceneState {
    createScene() : void {
        this.scene = new IntroScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch (sceneName) {
            case MortuarySceneName:
                return new MortuarySceneState();
        }
    }
}

export default IntroSceneState;