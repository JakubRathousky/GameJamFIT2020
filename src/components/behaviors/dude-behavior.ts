import { BaseComponent } from '../base-component';
import { PersonController } from '../controllers/person-controller';
import { down, left, right, up } from '../../entities/constants';

export class DudeBehavior extends BaseComponent<void> {
    ctrl: PersonController;

    onInit() {
        super.onInit();
        this.ctrl = this.owner.findComponentByName(PersonController.name);
        this.setRandomFrequency();
    }

    setRandomFrequency() {
        this.fixedFrequency = 1 / (2 + Math.random() * 8);
    }

    onFixedUpdate() {
        // walk at random direction and repeat at random time
        this.ctrl.performWalk([down, left, up, right][Math.floor(Math.random() * 4)]);
        this.setRandomFrequency();
    }
}