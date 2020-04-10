import { PersonViewModel } from './../components/view/person-view';
import { NPC } from '../entities/functional/tilemap';
import * as ECSA from '../../libs/pixi-component';
import { DudeBehavior } from '../components/behaviors/dude-behavior';
import { ResourceStorage } from '../services/resource-storage';
import { down, PersonNames, Triggers } from '../entities/constants';
import { npcsLayerSelector } from '../services/selectors';
import { PersonController } from '../components/controllers/person-controller';
import { BaseTrigger } from '../components/triggers/base-trigger';
import { DudeTrigger } from '../components/triggers/dude-trigger';

const build = (npc: NPC, scene: ECSA.Scene, resources: ResourceStorage) => {
    const container = npcsLayerSelector(scene);

    let behavior: ECSA.Component<any> = null;

    switch (npc.name) {
        case PersonNames.DUDE:
            behavior = new DudeBehavior();
            break;
        default:
            throw Error(`Unknown behavior: ${npc.behavior}`);
    }

    let trigger: BaseTrigger<any> = null;

    switch (npc.trigger) {
        case Triggers.DUDE:
            trigger = new DudeTrigger();
            break;
        default:
            throw Error(`Unknown dynamic trigger: ${npc.trigger}`);
    }

    const texture = resources.getPersonSpriteTexture(npc.name);

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