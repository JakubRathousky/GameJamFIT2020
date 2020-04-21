import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { MapNames, SceneObjects } from '../entities/constants';
import TriggerBuilder from './trigger-builder';
import NPCBuilder from './npc-builder';
import MapBuilder from './map-builder';
import { MapController } from '../components/controllers/map-controller';
import { mapLayerSelector, viewPortSelector } from '../services/selectors';
import playerBuilder from './player-builder';

const build = (props: {
    name: MapNames; scene: ECSA.Scene; resources: ResourceStorage; playerPosition?: ECSA.Vector; playerDirection: ECSA.Vector;
}) => {
    const { name, scene, resources, playerPosition, playerDirection } = props;

    const map = resources.getMap(name);
    const viewPort = viewPortSelector(scene);

    const tileSet = resources.getTileSet(map.tileSetName);

    // container for the map
    viewPort.addChildAt(new ECSA.Container(SceneObjects.MAP), 0); // map will always be at the first index
    // container for static triggers
    viewPort.addChild(new ECSA.Container(SceneObjects.TRIGGERS));

    const peopleContainer = new ECSA.Container(SceneObjects.LAYER_PEOPLE);
    viewPort.addChild(peopleContainer);
    // use z-index for people layer
    peopleContainer.sortableChildren = true;

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

    // register triggers
    map.triggers.forEach(trigger => TriggerBuilder.build(scene, trigger));

    // register NPCs
    map.npcs.forEach(npc => NPCBuilder.build(npc, scene, resources));
};

export default {
    build
};