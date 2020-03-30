import BaseScene from '../../scene-base';
import GameModel from '../../../models/game-model';
import { GameController } from '../../../controllers/game-controller';

abstract class BaseSceneState {
    scene: BaseScene;

    constructor() {
        this.createScene();
    }
    public getCurrentScene() {
        return this.scene;
    }
    abstract createScene(): void;
    abstract transition(sceneName: string): BaseSceneState;
}

export default BaseSceneState;