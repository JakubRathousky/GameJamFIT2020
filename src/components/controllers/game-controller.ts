import { RawGameConfig } from '../../entities/parsed/game-config';
import { BaseComponent } from '../base-component';
import { MapNames, Messages } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { sceneSwitchAction } from '../../actions/scene-switch';
import { mapLayerSelector, npcsLayerSelector, triggersLayerSelector, mapControllerSelector } from '../../services/selectors';

export interface GameSceneCache {
    map: ECSA.Container;
    npcs: ECSA.Container;
    triggers: ECSA.Container;
}

/**
 * General controller of the game
 */
export class GameController extends BaseComponent<RawGameConfig> {
    private _currentFont: string;
    private _currentLanguage: string;
    private gameScenes: Map<MapNames, GameSceneCache> = new Map();

    constructor(props: RawGameConfig) {
        super(props);
        this._currentFont = this.props.defaultFont;
        this._currentLanguage = this.props.defaultLanguage;
    }

    onInit() {
        super.onInit();
        this.sendMessage(Messages.GAME_STARTED);
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
        if(this.gameScenes.has(name)) {
            // switch to previous scene
            const cachedScene = this.gameScenes.get(name);
            sceneSwitchAction({name, scene: this.scene, resources: this.resourceStorage, playerPosition, playerDirection, cachedScene});
        } else {
            // build a new scene
            if(mapLayerSelector(this.scene)) {
                const currentMap = mapControllerSelector(this.scene).mapName;
                this.gameScenes.set(currentMap, {
                    map: mapLayerSelector(this.scene),
                    npcs: npcsLayerSelector(this.scene),
                    triggers: triggersLayerSelector(this.scene)
                });
            }
            sceneSwitchAction({name, scene: this.scene, resources: this.resourceStorage, playerPosition, playerDirection});
        }
    }
}