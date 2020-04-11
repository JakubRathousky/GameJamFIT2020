import * as ECSA from '../../../libs/pixi-component';
import { PlayerController } from './player-controller';
import { KeyInputComponent } from '../../../libs/pixi-component/components/key-input-component';
import { left, right, up, down, keyboadMapping, InputActions } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import { PersonState } from './person-controller';

/**
 * Input controller for the player, checks pressed keys
 */
export class PlayerInputController extends BaseComponent<void> {

    private playerCtrl: PlayerController;
    private keyController: KeyInputComponent;

    onInit() {
        super.onInit();
        this.playerCtrl = this.owner.findComponentByName(PlayerController.name);
        this.keyController = this.scene.findGlobalComponentByName(KeyInputComponent.name);
        // don't check too often
        this.fixedFrequency = 10;
    }


    onFixedUpdate() {
        if(this.playerCtrl.canReceiveInput) {
            if(this.keyController.isKeyPressed(keyboadMapping[InputActions.ACTION_LEFT])) {
                this.handleWalkAction(left);
            } else if(this.keyController.isKeyPressed(keyboadMapping[InputActions.ACTION_RIGHT])) {
                this.handleWalkAction(right);
            } else if(this.keyController.isKeyPressed(keyboadMapping[InputActions.ACTION_DOWN])) {
                this.handleWalkAction(down);
            } else if(this.keyController.isKeyPressed(keyboadMapping[InputActions.ACTION_UP])) {
                this.handleWalkAction(up);
            } else if(this.keyController.isKeyPressed(keyboadMapping[InputActions.ACTION_INTERACT])) {
                this.keyController.handleKey(keyboadMapping[InputActions.ACTION_INTERACT]);
                this.playerCtrl.tryToInteract();
            }
        }
    }

    private handleWalkAction(direction: ECSA.Vector) {
        if(this.playerCtrl.state === PersonState.STANDING) {
            if(this.playerCtrl.direction.equals(direction)) {
                // change direction and walk towards new tile
                const performer = this.playerCtrl.performWalk(direction);
                if(performer) {
                    // wait until it has finished and check the input again so we will
                    // have a smooth movement if we keep the arrows pressed
                    performer.execute(() => {
                        this.onFixedUpdate();
                    });
                }
            } else {
                // just change direction
                this.playerCtrl.direction = direction;
            }
        }
    }
}