import { FirstSceneName } from '../scene-names';
import BaseSceneState from './scene-state-base';
import FirstSceneState from './first-scene-state';

class OracleSceneState extends BaseSceneState {
    createScene() : void {
        // this.scene = new OracleScene();
    }

    transition(sceneName: string): BaseSceneState {
        switch(sceneName) {
            case FirstSceneName:
                return new FirstSceneState();
        }
    }
}

export default OracleSceneState;