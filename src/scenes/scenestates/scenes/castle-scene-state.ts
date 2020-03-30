import { IntroSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import IntroSceneState from './intro-scene-state';
import CastleScene from '../../castle-scene';

export class CastleSceneState extends BaseSceneState {
    createScene(): void {
        this.scene = new CastleScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case IntroSceneName:
                return new IntroSceneState();
        }
    }
}

export default CastleSceneState;