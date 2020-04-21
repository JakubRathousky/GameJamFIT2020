import { PersonViewModel } from './../components/view/person-view';
import { NPC } from '../entities/functional/tilemap';
import * as ECSA from '../../libs/pixi-component';
import { DudeBehavior } from '../components/behaviors/dude-behavior';
import { ResourceStorage } from '../services/resource-storage';
import { down, Triggers } from '../entities/constants';
import { PersonController } from '../components/controllers/person-controller';
import { DudeTrigger } from '../components/triggers/dude-trigger';
import { peopleLayerSelector } from '../services/selectors';

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

    const texture = resources.getPersonSpriteTexture(npc.name);
    const container = peopleLayerSelector(scene);

    const builder = new ECSA.Builder(scene)
        .withParent(container)
        .anchor(0, 0.3)
        .withName(npc.name)
        .asSprite(new PIXI.Texture(texture))
        .withComponent(new PersonController({ initPosition: npc.initPosition, initDirection: down }))
        .withComponent(new PersonViewModel({ name: npc.name }));

    if (npc.behavior) {
        builder.withComponent(buildBehavior(npc.behavior));
    }

    if (npc.trigger) {
        builder.withComponent(buildTrigger(npc.trigger));
    }
    return builder.build();

};

export default {
    build
};