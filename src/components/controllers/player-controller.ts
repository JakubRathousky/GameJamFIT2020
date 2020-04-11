
import { PersonController, PersonState } from './person-controller';

/**
 * Controller for player with additional functions
 */
export class PlayerController extends PersonController {

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