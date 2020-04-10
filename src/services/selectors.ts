import * as ECSA from '../../libs/pixi-component';
import { SceneObjects } from '../entities/constants';
import { PlayerController } from '../components/controllers/player-controller';
import { MapController } from '../components/controllers/map-controller';
import { GameController } from '../components/controllers/game-controller';

export const playerSelector = (scene: ECSA.Scene): ECSA.Container => scene.findObjectByName(SceneObjects.PLAYER);

export const playerControllerSelector = (scene: ECSA.Scene): PlayerController => playerSelector(scene).findComponentByName(PlayerController.name);

export const viewPortSelector = (scene: ECSA.Scene): ECSA.Container => scene.findObjectByName(SceneObjects.LAYER_VIEWPORT);

export const mapLayerSelector = (scene: ECSA.Scene): ECSA.Container => scene.findObjectByName(SceneObjects.MAP);
export const npcsLayerSelector = (scene: ECSA.Scene): ECSA.Container => scene.findObjectByName(SceneObjects.NPCS);
export const triggersLayerSelector = (scene: ECSA.Scene): ECSA.Container => scene.findObjectByName(SceneObjects.TRIGGERS);

export const mapControllerSelector = (scene: ECSA.Scene): MapController => mapLayerSelector(scene).findComponentByName(MapController.name);

export const gameControllerSelector = (scene: ECSA.Scene): GameController => scene.findGlobalComponentByName('GameController');