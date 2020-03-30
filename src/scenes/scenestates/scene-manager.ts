import BaseSceneState from './scenes/scene-state-base';
import BaseScene from '../scene-base';
import GameModel from '../../models/game-model';
import IntroSceneState from './scenes/intro-scene-state';
import { GameController } from '../../controllers/game-controller';

class SceneManager {
    state: BaseSceneState;
    gameModel: GameModel;
    gameController: GameController;
    app: PIXI.Application

    constructor(gameModel: GameModel, app: PIXI.Application,) {
        this.gameModel = gameModel;
        this.gameController = gameModel.gameController;
        this.app = app;
    }

    initFirst(afterTransitionCallback: (nextScene: string) => void) {
        this.state = new IntroSceneState();

        let scene = this.state.getCurrentScene();
        scene.init(this.app, this.gameModel, afterTransitionCallback);
    }
    nextScene(sceneName: string, afterTransitionCallback: (nextScene: string) => void): BaseScene {
        this.state = this.state.transition(sceneName);
        let scene = this.state.getCurrentScene();
        scene.init(this.app, this.gameModel, afterTransitionCallback);
        return this.state.scene;
    }

    update(delta: number, absolute: number) {
        this.state.getCurrentScene().update(delta, absolute);
    }
}

export default SceneManager;