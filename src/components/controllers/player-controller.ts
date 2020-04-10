
import { PersonState, Messages } from '../../entities/constants';
import { PersonController } from './person-controller';

export class PlayerController extends PersonController {

    setState(state: PersonState) {
        this.owner.stateId = state;
        this.sendMessage(Messages.PLAYER_STATE_CHANGED);
    }

    get canReceiveInput() {
        return this.state === PersonState.STANDING;
    }

    tryToInteract() {
        this.setState(PersonState.TRYING_TO_INTERACT);
        if(this.state === PersonState.TRYING_TO_INTERACT) {
            this.setState(PersonState.STANDING);
        }
    }
}