import { OracleSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';
import GravediggerScene from '../../gravedigger-scene';
import OracleSceneState from './oracle-scene-state';

class GraveDiggerSceneState extends BaseSceneState {
    createScene(): void {
        this.scene = new GravediggerScene();
    }
    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case OracleSceneName:
                return new OracleSceneState();
        }
    }
}

export default GraveDiggerSceneState;