import * as ECSA from '../../../libs/pixi-component';
import { left, down, up, right, Messages, PersonNames, TriggerCondition, TriggerDirection } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import { PlayerController } from '../controllers/player-controller';
import { MapController } from '../controllers/map-controller';
import { GameController } from '../controllers/game-controller';
import { playerControllerSelector, mapControllerSelector, gameControllerSelector } from '../../services/selectors';
import { PersonState } from '../controllers/person-controller';


export interface BaseTriggerProps {
    mapPosition: ECSA.Vector;
    condition: TriggerCondition;
    direction: TriggerDirection;
}

/**
 * Base class for all triggers
 * Checks if conditions are met and leaves the rest up to derived triggers
 * Every special trigger should override or extend its triggered function !
 */
export abstract class BaseTrigger<T extends BaseTriggerProps> extends BaseComponent<T> {

    protected executing: boolean;
    protected mapCtrl: MapController;
    protected gameCtrl: GameController;
    private playerCtrl: PlayerController;

    onAttach() {
        this.subscribe(Messages.PERSON_STATE_CHANGED);
        this.playerCtrl = null; // has to be set with the first invocation
        this.mapCtrl = mapControllerSelector(this.scene);
        this.gameCtrl = gameControllerSelector(this.scene);
        this.executing = false;
    }

    onMessage(msg: ECSA.Message) {
        // re-check the triggers only when the player changes its state
        if (msg.action === Messages.PERSON_STATE_CHANGED && msg.gameObject.name === PersonNames.PLAYER) {
            this.executeInternal();
        }
    }

    get mapPosition() {
        // override for dynamic triggers
        return this.props.mapPosition;
    }
    /**
     * Returns true if the trigger is triggered,
     * usable for more complex conditions
     */
    triggered(): boolean {
        if(this.playerCtrl === null) {
            this.playerCtrl = playerControllerSelector(this.scene);
        }
        const playerPos = this.playerCtrl.mapPosition;
        const nextPos = this.playerCtrl.nextPosition;
        const direction = this.playerCtrl.direction;
        switch (this.props.direction) {
            case TriggerDirection.ANY:
                // doesn't matter
                break;
            case TriggerDirection.BOTTOM:
                if (!direction.equals(down)) {
                    return false;
                }
                break;
            case TriggerDirection.TOP:
                if (!direction.equals(up)) {
                    return false;
                }
                break;
            case TriggerDirection.LEFT:
                if (!direction.equals(left)) {
                    return false;
                }
                break;
            case TriggerDirection.RIGHT:
                if (!direction.equals(right)) {
                    return false;
                }
                break;
            case TriggerDirection.HORIZONTAL:
                if (!direction.equals(left) || !direction.equals(right)) {
                    return false;
                }
                break;
            case TriggerDirection.VERTICAL:
                if (!direction.equals(up) || !direction.equals(down)) {
                    return false;
                }
                break;
        }

        switch (this.props.condition) {
            case TriggerCondition.ENTER_AREA:
                if (playerPos.equals(this.mapPosition)) {
                    return true;
                }
                break;
            case TriggerCondition.ENTER_NEAREST_AREA:
                if (playerPos.manhattanDistance(this.mapPosition) === 1) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_INTERACT:
                if (this.playerCtrl.state === PersonState.TRYING_TO_INTERACT && playerPos.add(direction).equals(this.mapPosition)) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_ENTER_AREA:
                if (this.playerCtrl.state === PersonState.TRYING_TO_WALK && nextPos && nextPos.equals(this.mapPosition)) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_LEAVE_AREA:
                if (this.playerCtrl.state === PersonState.TRYING_TO_WALK && playerPos.equals(this.mapPosition)) {
                    return true;
                }
                break;
        }
        return false;
    }

    protected forceTrigger() {
        if(!this.executing) {
            this.executing = true;
            this.execute();
        }
    }

    protected executeInternal() {
        if (!this.executing && this.triggered()) {
            this.executing = true;
            this.execute();
        }
    }

    /**
     * Executes the trigger and applies all side effects
     */
    abstract execute(): void;

}
