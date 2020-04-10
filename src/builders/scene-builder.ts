import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { MapNames, SceneObjects } from '../entities/constants';
import AsyncComponent from '../../libs/pixi-component/components/async-component';
import TriggerBuilder from './trigger-builder';
import NPCBuilder from './npc-builder';
import MapBuilder from './map-builder';
import { MapController } from '../components/controllers/map-controller';
import { mapLayerSelector, viewPortSelector } from '../services/selectors';
import playerBuilder from './player-builder';
import { GameSceneCache } from '../components/controllers/game-controller';

const build = (props: {
    name: MapNames; scene: ECSA.Scene; resources: ResourceStorage; playerPosition?: ECSA.Vector; playerDirection: ECSA.Vector;
    savedScene?: GameSceneCache;
}) => {
    const { name, scene, resources, playerPosition, playerDirection, savedScene } = props;
    const map = resources.getMap(name);
    const viewPort = viewPortSelector(scene);

    if (savedScene) {
        viewPort.addChild(savedScene.map);
        playerBuilder(scene, this.resourceStorage, playerPosition ?? map.playerDefaultPos, playerDirection);
        viewPort.addChild(savedScene.npcs);
        viewPort.addChild(savedScene.triggers);
    } else {
        const map = resources.getMap(name);
        const tileSet = resources.getTileSet(map.tileSetName);

        viewPort.addChild(new ECSA.Container(SceneObjects.MAP));
        viewPort.addChild(new ECSA.Container(SceneObjects.TRIGGERS));

        const mapController = new MapController({
            map: map.clone(),
            tileSet: tileSet,
            mapName: name
        });

        mapLayerSelector(scene).addComponentAndRun(mapController);

        // create map tiles
        MapBuilder.build(mapController, resources, scene);

        playerBuilder(scene, resources, playerPosition ?? map.playerDefaultPos, playerDirection);
        viewPort.addChild(new ECSA.Container(SceneObjects.NPCS));
        // register triggers
        map.triggers.forEach(trigger => {
            TriggerBuilder.build(scene, trigger);
        });

        // register NPCs
        map.npcs.forEach(npc => {
            NPCBuilder.build(npc, scene, resources);
        });
    }

    // handle fading animation
    scene.stage.addComponentAndRun(new AsyncComponent<void>(function* (cmp: AsyncComponent<void>) {
        scene.stage.alpha = 0;
        while (cmp.scene.stage.alpha !== 1) {
            cmp.scene.stage.alpha = Math.min(cmp.scene.stage.alpha + 0.1, 1);
            yield cmp.waitFrames(1);
        }
    }));
};

export default {
    build
};