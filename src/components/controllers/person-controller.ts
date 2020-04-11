
import * as ECSA from '../../../libs/pixi-component';
import { Messages } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import { MapController } from './map-controller';
import { mapControllerSelector } from '../../services/selectors';
import { walkingAction } from '../../actions/walk';
import ChainComponent from '../../../libs/pixi-component/components/chain-component';

export enum PersonState {
    STANDING = 1,
    TRYING_TO_WALK = 2,
    WALKING = 3,
    TRYING_TO_INTERACT = 4,
    INTERACTING = 5,
    CUTSCENE = 6,
}

export interface PersonControllerProps {
    initPosition: ECSA.Vector;
    initDirection: ECSA.Vector;
}

/**
 * Base controller of moving objects, mainly the player and NPCs
 */
export class PersonController extends BaseComponent<PersonControllerProps> {
    protected _nextPosition: ECSA.Vector;
    protected _direction: ECSA.Vector;
    protected _mapPosition: ECSA.Vector;
    protected mapController: MapController;

    onInit() {
        super.onInit();
        this.mapController = mapControllerSelector(this.scene);
        this.mapPosition = this.props.initPosition;
        this.direction = this.props.initDirection;
        this.setState(PersonState.STANDING);
    }

    onAttach() {
        this.mapController = mapControllerSelector(this.scene);
    }

    get direction() {
        return this._direction;
    }

    set direction(dir: ECSA.Vector) {
        this._direction = dir;
    }

    get mapPosition() {
        return this._mapPosition;
    }

    set mapPosition(pos: ECSA.Vector) {
        this.mapController.setCellOccupied(this._mapPosition, false);
        this._mapPosition = pos;
        this.mapController.setCellOccupied(this._mapPosition, true);
    }

    get nextPosition() {
        return this._nextPosition;
    }

    get state(): PersonState {
        return this.owner.stateId as PersonState;
    }

    setState(state: PersonState) {
        this.owner.stateId = state;
        this.sendMessage(Messages.PERSON_STATE_CHANGED);
    }


    isWalkable(direction: ECSA.Vector) {
        if(Math.abs(direction.x + direction.y) !== 1) {
            throw Error(`Wrong direction. Expected [0, 1], [0, -1], [-1, 0], [1, 0]. Found [${direction.x}, ${direction.y}]`);
        }

        if(this.state === PersonState.WALKING) {
            return false;
        }

        if(direction.x === 1) {
            return this.mapController.canGoRight(this.mapPosition);
        } else if (direction.x === -1) {
            return this.mapController.canGoLeft(this.mapPosition);
        } else if (direction.y === 1) {
            return this.mapController.canGoDown(this.mapPosition);
        } else if (direction.y === -1) {
            return this.mapController.canGoUp(this.mapPosition);
        }
    }


    teleport(newPos: ECSA.Vector) {
        this.mapController.setCellOccupied(this.mapPosition, false);
        this.mapPosition = newPos;
        this.mapController.setCellOccupied(this.mapPosition, true);
    }

    performWalk(direction: ECSA.Vector, force = false): ChainComponent {
        this.prepareForWalking(direction);

        if(force || this.state === PersonState.TRYING_TO_WALK) {
            return walkingAction(this, this.mapPosition, this.direction, this.mapController.tileSize, this.resourceStorage.gameConfig.playerWalkSpeed);
        }
        return null;
    }

    startWalking(direction: ECSA.Vector) {
        // we need to occupy two cells at once
        this._nextPosition = this.mapPosition.add(direction);
        this.direction = direction;
        this.owner.stateId = PersonState.WALKING;
        this.mapController.setCellOccupied(this._nextPosition, true);
    }

    finishWalking() {
        // clean up occupied cells and set the new state
        if(!this._nextPosition) {
            throw new Error('Next position is not defined');
        }
        // deallocate visited mapcell
        this.mapController.setCellOccupied(this.mapPosition, false);
        this.teleport(this._nextPosition);
        this._nextPosition = null;
        this.owner.stateId = PersonState.STANDING;
        this.sendMessage(Messages.WALK_STEP_FINISHED);
    }

    private prepareForWalking(direction: ECSA.Vector) {
        if(this.state === PersonState.STANDING) {
            this._nextPosition = this.mapPosition.add(direction);
            this.direction = direction;
            this.setState(PersonState.TRYING_TO_WALK); // this should invoke trigger
            if((this.state as any) === PersonState.TRYING_TO_WALK) { // nobody has changed our state -> we are good to go
                const canWalk = this.isWalkable(direction);
                if(!canWalk) {
                    this.owner.stateId = PersonState.STANDING;
                }
            }
        }
    }
}