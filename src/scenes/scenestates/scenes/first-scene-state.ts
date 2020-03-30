import { CastleSceneName, IntroSceneName } from '../scene-names';
import FirstScene from '../../first-scene';
import BaseSceneState from './scene-state-base';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import { CastleSceneState } from './castle-scene-state';
import IntroSceneState from './intro-scene-state';

class FirstSceneState extends BaseSceneState {
    createScene() : void {
        this.scene = new FirstScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case CastleSceneName:
                return new CastleSceneState();
            case IntroSceneName:
                return new IntroSceneState();
        }
    }
}

export default FirstSceneState;