import * as ECSA from '../../../libs/pixi-component';
import { left, down, up, right, PersonState, Messages } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import { PlayerController } from '../controllers/player-controller';
import { MapController } from '../controllers/map-controller';
import { GameController } from '../controllers/game-controller';
import { playerControllerSelector, mapControllerSelector, gameControllerSelector } from '../../services/selectors';

export enum TriggerCondition {
    TRY_TO_LEAVE_AREA = 'try_to_leave_area',
    TRY_TO_ENTER_AREA = 'try_to_enter_area',
    ENTER_AREA = 'enter_area',
    ENTER_NEAREST_AREA = 'enter_nearest_area',
    TRY_TO_INTERACT = 'try_to_interact',
}

export enum TriggerDirection {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
    ANY = 'any'
}

export interface BaseTriggerProps {
    mapPosition: ECSA.Vector;
    condition: TriggerCondition;
    direction: TriggerDirection;
}

export abstract class BaseTrigger<T extends BaseTriggerProps> extends BaseComponent<T> {

    protected executing: boolean;
    protected playerCtrl: PlayerController;
    protected mapCtrl: MapController;
    protected gameCtrl: GameController;

    onAttach() {
        this.subscribe(Messages.PLAYER_STATE_CHANGED);
        this.playerCtrl = playerControllerSelector(this.scene);
        this.mapCtrl = mapControllerSelector(this.scene);
        this.gameCtrl = gameControllerSelector(this.scene);
        this.executing = false;
    }

    onMessage(msg: ECSA.Message) {
        if (msg.action === Messages.PLAYER_STATE_CHANGED) {
            if (!this.executing && this.triggered()) {
                this.executing = true;
                this.execute();
            }
        }
    }

    /**
     * Returns true if the trigger is triggered,
     * usable for more complex conditions
     */
    triggered(): boolean {
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
                if (playerPos.equals(this.props.mapPosition)) {
                    return true;
                }
                break;
            case TriggerCondition.ENTER_NEAREST_AREA:
                if (playerPos.manhattanDistance(this.props.mapPosition) === 1) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_INTERACT:
                if (playerPos.add(direction).equals(this.props.mapPosition) && this.playerCtrl.state === PersonState.TRYING_TO_INTERACT) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_ENTER_AREA:
                if (nextPos && nextPos.equals(this.props.mapPosition) && this.playerCtrl.state === PersonState.TRYING_TO_WALK) {
                    return true;
                }
                break;
            case TriggerCondition.TRY_TO_LEAVE_AREA:
                if (playerPos.equals(this.props.mapPosition) && this.playerCtrl.state === PersonState.TRYING_TO_WALK) {
                    return true;
                }
                break;
        }
        return false;
    }

    /**
     * Executes the trigger and applies all side effects
     */
    abstract execute(): void;
}
