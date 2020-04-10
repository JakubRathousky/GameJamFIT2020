import { RawGameConfig } from '../../entities/parsed/game-config';
import { BaseComponent } from '../base-component';
import { MapNames, Messages } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { mapLayerSelector, npcsLayerSelector, triggersLayerSelector, viewPortSelector, playerSelector, mapControllerSelector } from '../../services/selectors';
import sceneBuilder from '../../builders/scene-builder';
import playerBuilder from '../../builders/player-builder';

export interface GameSceneCache {
    map: ECSA.Container;
    npcs: ECSA.Container;
    triggers: ECSA.Container;
}

export class GameController extends BaseComponent<RawGameConfig> {
    private _currentFont: string;
    private _currentLanguage: string;
    private gameScenes: Map<MapNames, GameSceneCache> = new Map();

    constructor(props: RawGameConfig) {
        super(props);
        this._name = 'GameController';
        this._currentFont = this.props.defaultFont;
        this._currentLanguage = this.props.defaultLanguage;
    }

    get currentFont() {
        return this._currentFont;
    }

    set currentFont(font: string) {
        this._currentFont = font;
    }

    get currentLanguage() {
        return this._currentLanguage;
    }

    set currentLanguage(lng: string) {
        this._currentLanguage = lng;
    }

    switchMapAsync(name: MapNames, playerPosition: ECSA.Vector, playerDirection: ECSA.Vector) {
        this.scene.invokeWithDelay(0, () => {
            this.switchMap(name, playerPosition, playerDirection);
        });
    }

    switchMap(name: MapNames, playerPosition: ECSA.Vector, playerDirection: ECSA.Vector) {
        const map = mapLayerSelector(this.scene);
        const npcs = npcsLayerSelector(this.scene);
        const triggers = triggersLayerSelector(this.scene);
        const mapCtrl = mapControllerSelector(this.scene);

        map.detach();
        npcs.detach();
        triggers.detach();
        const viewPort = viewPortSelector(this.scene);
        playerSelector(this.scene).detachAndDestroy();

        if(this.gameScenes.has(name)) {
            // switch to previous scene
            const scene = this.gameScenes.get(name);
            viewPort.addChild(scene.map);
            playerBuilder(this.scene, this.resourceStorage, playerPosition, playerDirection);
            viewPort.addChild(scene.npcs);
            viewPort.addChild(scene.triggers);
            this.scene.stage.addComponentAndRun(new ECSA.AsyncComponent<void>(function* (cmp: ECSA.AsyncComponent<void>) {
                cmp.scene.stage.alpha = 0;
                while (cmp.scene.stage.alpha !== 1) {
                    cmp.scene.stage.alpha = Math.min(cmp.scene.stage.alpha + 0.1, 1);
                    yield cmp.waitFrames(1);
                }
            }));
        } else {
            // build a new scene
            this.gameScenes.set(mapCtrl.mapName, {
                map, npcs, triggers
            });
            sceneBuilder.build({name, scene: this.scene, resources: this.resourceStorage, playerPosition, playerDirection});
        }

        this.sendMessage(Messages.SCENE_SWITCHED);
    }
}