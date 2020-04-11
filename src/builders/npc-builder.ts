import { PersonViewModel } from './../components/view/person-view';
import { NPC } from '../entities/functional/tilemap';
import * as ECSA from '../../libs/pixi-component';
import { DudeBehavior } from '../components/behaviors/dude-behavior';
import { ResourceStorage } from '../services/resource-storage';
import { down, Triggers } from '../entities/constants';
import { npcsLayerSelector } from '../services/selectors';
import { PersonController } from '../components/controllers/person-controller';
import { DudeTrigger } from '../components/triggers/dude-trigger';

const buildBehavior = (name: string) => {
    switch (name) {
        case 'DudeBehavior':
            return new DudeBehavior();
        default:
            throw Error(`Unknown behavior: ${name}`);
    }
};

const buildTrigger = (name: string) => {
    switch (name) {
        case Triggers.DUDE:
            return new DudeTrigger();
        default:
            throw Error(`Unknown dynamic trigger: ${name}`);
    }
};

const build = (npc: NPC, scene: ECSA.Scene, resources: ResourceStorage) => {

    const behavior = buildBehavior(npc.behavior);
    const trigger = buildTrigger(npc.trigger);

    const texture = resources.getPersonSpriteTexture(npc.name);
    const container = npcsLayerSelector(scene);

    new ECSA.Builder(scene)
        .withParent(container)
        .anchor(0, 0.3)
        .withName(npc.name)
        .asSprite(new PIXI.Texture(texture))
        .withComponent(new PersonController({ initPosition: npc.initPosition, initDirection: down }))
        .withComponent(new PersonViewModel({name: npc.name}))
        .withComponent(behavior)
        .withComponent(trigger)
        .build();
};

export default {
    build
};