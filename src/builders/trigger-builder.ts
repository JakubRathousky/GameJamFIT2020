import { Trigger } from '../entities/functional/tilemap';
import { Door } from '../components/triggers/door';
import { Info } from '../components/triggers/info';
import * as ECSA from '../../libs/pixi-component';
import { triggersLayerSelector } from '../services/selectors';
import { Triggers } from '../entities/constants';

const build = (scene: ECSA.Scene, trigger: Trigger) => {
    const container = triggersLayerSelector(scene);
    switch(trigger.name) {
        case Triggers.DOOR:
            container.addComponent(new Door({
                ...trigger.props,
                mapPosition: trigger.mapPosition,
                direction: trigger.direction,
                condition: trigger.condition,
            }));
            break;
        case Triggers.INFO:
            container.addComponent(new Info({
                ...trigger.props,
                mapPosition: trigger.mapPosition,
                direction: trigger.direction,
                condition: trigger.condition,
            }));
            break;
        default:
            throw Error(`Unknown static trigger: ${trigger.name}`);
    }
};

export default { build };