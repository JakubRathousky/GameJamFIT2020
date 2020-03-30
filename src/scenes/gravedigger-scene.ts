import { GameController } from './../controllers/game-controller';
import * as PIXI from 'pixi.js';
import BaseScene from "./scene-base";
import GameModel, { MapType } from '../models/game-model';
import Vec from '../utils/vec';

class GravediggerScene extends BaseScene {
    public sceneObjects: PIXI.DisplayObject[];

    init(app: PIXI.Application, gameModel: GameModel, afterTransitionCallback: (nextScene: string) => void) {
        super.init(app, gameModel, afterTransitionCallback);
        this.gameModel.loadMap(MapType.DREAM_MAP, this.mapParser.loadMap(this.resources['MAP'].data), true, new Vec(2,2));
    }

    update(delta: number, absolute: number) {
        this.gameModel.update(delta, absolute);
        this.gameController.update(delta, absolute);
    }
}

export default GravediggerScene;