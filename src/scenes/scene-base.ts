import * as PIXI from 'pixi.js';
import { MapParser } from '../parsers/map-parser';
import GameModel from '../models/game-model';
import { GameController } from '../controllers/game-controller';

abstract class BaseScene {
    public sceneObjects: PIXI.DisplayObject[] = [];
    gameController: GameController;
    gameModel: GameModel;
    app: PIXI.Application;
    resources = PIXI.Loader.shared.resources;
    mapParser = new MapParser();
    afterTransitionCallback: (nextScene: string) => void;

    public init(app: PIXI.Application, gameModel: GameModel, afterTransitionCallback: (nextScene: string) => void) {
        this.initProperty(app, gameModel, afterTransitionCallback);
    }
    abstract update(delta: number, absolute: number);

    private initProperty(app: PIXI.Application, gameModel: GameModel, afterTransitionCallback: (nextScene: string) => void) {
        this.app = app;
        this.afterTransitionCallback = afterTransitionCallback;
        this.gameController = gameModel.gameController;
        this.gameModel = gameModel;
    }
}

export default BaseScene;