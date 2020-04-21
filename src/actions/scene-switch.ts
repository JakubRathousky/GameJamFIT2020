import { mapLayerSelector, triggersLayerSelector, viewPortSelector, playerSelector, playerControllerSelector, peopleLayerSelector, mapControllerSelector } from '../services/selectors';
import * as ECSA from '../../libs/pixi-component';
import { GameSceneCache } from '../components/controllers/game-controller';
import playerBuilder from '../builders/player-builder';
import { Messages, MapNames } from '../entities/constants';
import sceneBuilder from '../builders/scene-builder';
import { ResourceStorage } from '../services/resource-storage';
import { SceneSwitchMessage } from '../entities/messages/scene-switch-message';

export const sceneSwitchAction = (props: {
    name: MapNames;
    scene: ECSA.Scene;
    resources: ResourceStorage;
    playerPosition: ECSA.Vector;
    playerDirection: ECSA.Vector;
    unblockPlayer: boolean;
}): ECSA.ChainComponent => {
    const { name, scene, resources, playerPosition, playerDirection, unblockPlayer } = props;
    const map = mapLayerSelector(scene);
    const npcs = peopleLayerSelector(scene);
    const triggers = triggersLayerSelector(scene);
    const viewPort = viewPortSelector(scene);
    const currentMap = map ? mapControllerSelector(scene).mapName : null;

    let cachedScene: GameSceneCache = null;

    return new ECSA.ChainComponent('SceneSwitch')
        .call((cmp) => cachedScene = cmp.sendMessage(Messages.SCENE_BEFORE_SWITCH, {previousScene: currentMap, nextScene: name} as SceneSwitchMessage).responses.getResponse<GameSceneCache>())
        .call(() => {
            if (map && npcs && triggers) {
                // detach current subtrees
                map.detach();
                playerSelector(scene).detachAndDestroy();
                npcs.detach();
                triggers.detach();
            }

            if (cachedScene) {
                // attach cached subtrees
                viewPort.addChild(cachedScene.map);
                viewPort.addChild(cachedScene.npcs);
                playerBuilder(scene, resources, playerPosition, playerDirection);
                viewPort.addChild(cachedScene.triggers);
            } else {
                scene.stage.visible = false;
                sceneBuilder.build({ name, scene, resources, playerPosition, playerDirection });
                scene.stage.visible = true;
            }
            // prevent the player from moving until the switch has finished
            playerControllerSelector(scene).blockInput();

        })
        .call((cmp) => cmp.sendMessage(Messages.SCENE_AFTER_SWITCH, {previousScene: currentMap, nextScene: name} as SceneSwitchMessage))
        .call(() => unblockPlayer ? playerControllerSelector(scene).unblockInput() : {});
};