import { RawGameConfig } from '../../entities/parsed/game-config';
import { BaseComponent } from '../base-component';
import { MapNames, Messages } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { mapLayerSelector, triggersLayerSelector, mapControllerSelector, peopleLayerSelector } from '../../services/selectors';
import { SceneSwitchMessage } from '../../entities/messages/scene-switch-message';

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
        this.subscribe(Messages.SCENE_BEFORE_SWITCH);
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

    get currentMap() {
        return mapControllerSelector(this.scene).mapName;
    }

    onMessage(msg: ECSA.Message) {
        if(msg.action === Messages.SCENE_BEFORE_SWITCH) {
            // side effect: cache the scene
            const scene = msg.data as SceneSwitchMessage;
            if((scene.previousScene && !this.gameScenes.has(scene.previousScene))) {
                // cache previous scene
                const currentMap = scene.previousScene;
                this.gameScenes.set(currentMap, {
                    map: mapLayerSelector(this.scene),
                    npcs: peopleLayerSelector(this.scene),
                    triggers: triggersLayerSelector(this.scene)
                });
            }

            if(this.gameScenes.has(scene.nextScene)) {
                // get from cache
                return this.gameScenes.get(name);
            }
        }
    }
}