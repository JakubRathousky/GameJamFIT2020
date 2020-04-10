import * as ECSA from '../../../libs/pixi-component';
import { PlayerController } from './player-controller';
import { KeyInputComponent, Keys } from '../../../libs/pixi-component/components/key-input-component';
import { left, right, up, down, PersonState } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import ChainComponent from '../../../libs/pixi-component/components/chain-component';


export class PlayerInputController extends BaseComponent<void> {

    private playerCtrl: PlayerController;
    private keyController: KeyInputComponent;

    onInit() {
        super.onInit();
        this.playerCtrl = this.owner.findComponentByName(PlayerController.name);
        this.keyController = this.scene.findGlobalComponentByName(KeyInputComponent.name);
        this.fixedFrequency = 10;
    }


    onFixedUpdate() {
        if(this.playerCtrl.canReceiveInput) {
            if(this.keyController.isKeyPressed(Keys.KEY_LEFT)) {
                this.handleWalkAction(left);
            } else if(this.keyController.isKeyPressed(Keys.KEY_RIGHT)) {
                this.handleWalkAction(right);
            } else if(this.keyController.isKeyPressed(Keys.KEY_DOWN)) {
                this.handleWalkAction(down);
            } else if(this.keyController.isKeyPressed(Keys.KEY_UP)) {
                this.handleWalkAction(up);
            } else if(this.keyController.isKeyPressed(Keys.KEY_SPACE)) {
                this.keyController.handleKey(Keys.KEY_SPACE);
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
                    this.owner.addComponentAndRun(new ChainComponent()
                        .waitForFinish(performer)
                        .execute(() => this.onFixedUpdate()));
                }
            } else {
                // just change direction
                this.playerCtrl.direction = direction;
            }
        }
    }
}