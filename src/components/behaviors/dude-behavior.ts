import { BaseComponent } from '../base-component';
import { PersonController } from '../controllers/person-controller';
import * as ECSA from '../../../libs/pixi-component';
import { PersonState, down, left, right, up, Messages } from '../../entities/constants';

export class DudeBehavior extends BaseComponent<void> {
    ctrl: PersonController;

    onInit() {
        super.onInit();
        this.ctrl = this.owner.findComponentByName(PersonController.name);
        this.subscribe(Messages.PLAYER_STATE_CHANGED);
        this.setRandomFrequency();
    }

    setRandomFrequency() {
        this.fixedFrequency = 1 / (2 + Math.random() * 8);
    }

    onFixedUpdate() {
        this.handleWalkAction([down, left, up, right][Math.floor(Math.random() * 4)]);
        this.setRandomFrequency();
    }

    private handleWalkAction(direction: ECSA.Vector) {
        if (this.ctrl.state === PersonState.STANDING) {
            const performer = this.ctrl.performWalk(direction);
            if (performer) {
                this.owner.addComponentAndRun(new ECSA.ChainComponent()
                    .waitForFinish(performer));
            }
            return true;
        }
        return false;
    }
}