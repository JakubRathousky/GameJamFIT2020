import * as ECSA from '../../libs/pixi-component';
import { MapNames } from '../entities/constants';
import { sceneFadeAction } from './scene-fade';
import { ResourceStorage } from '../services/resource-storage';
import { sceneSwitchAction } from './scene-switch';

export const sceneSwitchWithFadeAction = (props: {
    name: MapNames;
    scene: ECSA.Scene;
    resources: ResourceStorage;
    playerPosition: ECSA.Vector;
    playerDirection: ECSA.Vector;
    unblockPlayer: boolean;
}): ECSA.ChainComponent => {
    const { name, scene, resources, playerPosition, playerDirection, unblockPlayer } = props;

    return sceneFadeAction({scene, fadeIn: false})
        .mergeWith(sceneSwitchAction({name, scene, resources, playerPosition, playerDirection, unblockPlayer}))
        .mergeWith(sceneFadeAction({scene, fadeIn: true}));
};