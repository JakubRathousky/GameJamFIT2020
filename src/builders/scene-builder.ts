import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { MapNames, SceneObjects } from '../entities/constants';
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
        // restore stored scene
        viewPort.addChild(savedScene.map);
        // player will be created again
        playerBuilder(scene, this.resourceStorage, playerPosition ?? map.playerDefaultPos, playerDirection);
        viewPort.addChild(savedScene.npcs);
        viewPort.addChild(savedScene.triggers);
    } else {
        const map = resources.getMap(name);
        const tileSet = resources.getTileSet(map.tileSetName);

        // container for the map
        viewPort.addChild(new ECSA.Container(SceneObjects.MAP));
        // container for static triggers
        viewPort.addChild(new ECSA.Container(SceneObjects.TRIGGERS));

        const mapController = new MapController({
            map: map.clone(), // always create a copy of the map
            tileSet: tileSet,
            mapName: name
        });

        mapLayerSelector(scene).addComponentAndRun(mapController);

        // create map tiles
        MapBuilder.build(mapController, resources, scene);

        // create player
        playerBuilder(scene, resources, playerPosition ?? map.playerDefaultPos, playerDirection);

        // container for NPCs
        viewPort.addChild(new ECSA.Container(SceneObjects.NPCS));

        // register triggers
        map.triggers.forEach(trigger => TriggerBuilder.build(scene, trigger));

        // register NPCs
        map.npcs.forEach(npc => NPCBuilder.build(npc, scene, resources));
    }
};

export default {
    build
};