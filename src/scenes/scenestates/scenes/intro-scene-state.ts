import { FirstSceneName, CardSceneName, MortuarySceneName } from "../scene-names";
import BaseSceneState from "./scene-state-base";
import IntroScene from "../../intro-scene";
import GameModel from '../../../models/game-model';
import CardSceneState from './card-scene-state';
import { GameController } from "../../../controllers/game-controller";
import MortuarySceneState from "./mortuary-scene-state";

class IntroSceneState extends BaseSceneState {
    init(app: PIXI.Application, gameModel: GameModel, gameController: GameController, afterTransitionCallback: (nextScene: string) => void) : void {
        super.init(app, gameModel, gameController, afterTransitionCallback);
        this.scene = new IntroScene(app, gameModel, gameController, afterTransitionCallback);
    }
    transition(sceneName: string): BaseSceneState {
        switch (sceneName) {
            case MortuarySceneName:
                return new MortuarySceneState();
        }
    }
}

export default IntroSceneState;