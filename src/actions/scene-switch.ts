import { mapLayerSelector, npcsLayerSelector, triggersLayerSelector, viewPortSelector, playerSelector, playerControllerSelector } from '../services/selectors';
import * as ECSA from '../../libs/pixi-component';
import { GameSceneCache } from '../components/controllers/game-controller';
import playerBuilder from '../builders/player-builder';
import { Messages, MapNames } from '../entities/constants';
import { sceneFadeAction } from './scene-fade';
import sceneBuilder from '../builders/scene-builder';
import { ResourceStorage } from '../services/resource-storage';
import { PersonState } from '../components/controllers/person-controller';

export const sceneSwitchAction = (props: {
    name: MapNames;
    scene: ECSA.Scene;
    resources: ResourceStorage;
    playerPosition: ECSA.Vector;
    playerDirection: ECSA.Vector;
    cachedScene?: GameSceneCache;
}) => {
    const { name, scene, resources, playerPosition, playerDirection, cachedScene } = props;
    const map = mapLayerSelector(scene);
    const npcs = npcsLayerSelector(scene);
    const triggers = triggersLayerSelector(scene);

    const viewPort = viewPortSelector(scene);

    if (map && npcs && triggers) {
        // detach current subtrees
        map.detach();
        npcs.detach();
        triggers.detach();
        playerSelector(scene).detachAndDestroy();
    }

    if (cachedScene) {
        // attach cached subtrees
        viewPort.addChild(cachedScene.map);
        playerBuilder(scene, resources, playerPosition, playerDirection);
        viewPort.addChild(cachedScene.npcs);
        viewPort.addChild(cachedScene.triggers);
    } else {
        scene.stage.visible = false;
        sceneBuilder.build({ name, scene, resources, playerPosition, playerDirection });
        scene.stage.visible = true;
    }

    // prevent the player from moving until the switch has finished
    playerControllerSelector(scene).setState(PersonState.CUTSCENE);
    // fade in animation
    const cmp = sceneFadeAction(scene);
    cmp.execute(() => scene.sendMessage(new ECSA.Message(Messages.SCENE_SWITCHED)))
        .execute(() => playerControllerSelector(scene).setState(PersonState.STANDING));
    return cmp;
};