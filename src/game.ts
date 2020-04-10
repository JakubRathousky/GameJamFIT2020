import * as ECSA from '../libs/pixi-component';
import { MapNames } from './entities/constants';
import { GameLoader } from './services/game-loader';
import { ResourceStorage } from './services/resource-storage';
import GameBuilder from './builders/game-builder';

class Game {
    engine: ECSA.GameLoop;

    constructor() {
        this.engine = new ECSA.GameLoop();
        let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

        // init the game loop
        this.engine.init(canvas,
        {
            width: 1000,
            height: 600,
            resolution: 3,
            resizeToScreen: true,
            flagsSearchEnabled: false, // searching by flags feature
            statesSearchEnabled: false, // searching by states feature
            tagsSearchEnabled: false, // searching by tags feature
            namesSearchEnabled: true, // searching by names feature
            notifyAttributeChanges: false, // will send message if attributes change
            notifyStateChanges: true, // will send message if states change
            notifyFlagChanges: false, // will send message if flags change
            notifyTagChanges: false, // will send message if tags change
            debugEnabled: false // debugging window
        });

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ANISOTROPIC_LEVEL = 0;
        PIXI.settings.ROUND_PIXELS = true;

        new GameLoader().loadGame(this.engine.app.loader, () => { }).then(service => this.onGameLoaded(service));
    }

    onGameLoaded(resources: ResourceStorage) {
        GameBuilder.build({
            resources,
            scene: this.engine.scene,
            name: MapNames.TOWN,
        });
    }
}

export default new Game();