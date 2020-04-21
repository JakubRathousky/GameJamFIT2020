import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { Messages, MapNames } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { MapChangeMessage } from '../../entities/messages/map-change-message';
import { gilTalkAction } from '../../actions/gil-talk';
import { playerSelector } from '../../services/selectors';

/**
 * Trigger for gil
 */
export class Gil extends BaseTrigger<BaseTriggerProps> {

    onAttach() {
        super.onAttach();
        this.subscribe(Messages.PLAYER_CHANGED_MAP);
    }

    onMessage(msg: ECSA.Message) {
        super.onMessage(msg);
        // once player goes from the lab back to the town, execute this trigger
        if(msg.action === Messages.PLAYER_CHANGED_MAP) {
            const info = msg.data as MapChangeMessage;
            if(info.sourceMap === MapNames.LAB && info.targetMap === MapNames.TOWN) {
                this.forceTrigger();
                this.finish(); // finish this component -> don't execute this trigger anymore
            }
        }
    }

    execute() {
        // execute action
        gilTalkAction({
            scene: this.scene,
            resource: this.resourceStorage,
        }).executeUpon(playerSelector(this.scene).parentGameObject);
    }
}