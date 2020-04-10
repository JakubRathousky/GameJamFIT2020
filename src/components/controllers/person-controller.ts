
import * as ECSA from '../../../libs/pixi-component';
import { PersonState, Messages } from '../../entities/constants';
import { BaseComponent } from '../base-component';
import { WalkAnim } from '../animations/walk-anim';
import AsyncComponent from '../../../libs/pixi-component/components/async-component';
import { MapController } from './map-controller';
import { mapControllerSelector } from '../../services/selectors';

export interface PersonControllerProps {
    initPosition: ECSA.Vector;
    initDirection: ECSA.Vector;
}

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
    }

    onAttach() {
        this.mapController = mapControllerSelector(this.scene);
        this.setState(PersonState.STANDING);
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

    performWalk(direction: ECSA.Vector, skipCheck = false): AsyncComponent<any> {
        this.prepareForWalking(direction);

        if(skipCheck || this.state === PersonState.TRYING_TO_WALK) {
            const cmp = new AsyncComponent(function*(cmp) {
                const { thiz } = cmp.props;
                thiz.startWalking(direction);
                yield cmp.addComponentAndWait(new WalkAnim({mapPosition: thiz.mapPosition, direction, tileSize: thiz.mapController.tileSize}));
                thiz.finishWalking();
            }, {thiz: this});

            this.owner.addComponentAndRun(cmp);
            return cmp;
        }
        return null;
    }

    private prepareForWalking(direction: ECSA.Vector) {
        if(this.state === PersonState.STANDING) {
            this._nextPosition = this.mapPosition.add(direction);
            this.direction = direction;
            this.setState(PersonState.TRYING_TO_WALK); // this should invoke trigger
            if((this.state as any) === PersonState.TRYING_TO_WALK) {
                const canWalk = this.isWalkable(direction);
                if(!canWalk) {
                    this.owner.stateId = PersonState.STANDING;
                }
            }
        }
    }

    private startWalking(direction: ECSA.Vector) {
        this._nextPosition = this.mapPosition.add(direction);
        this.direction = direction;
        this.owner.stateId = PersonState.WALKING;
        this.mapController.setCellOccupied(this._nextPosition, true);
    }

    private finishWalking() {
        if(!this._nextPosition) {
            throw new Error('Next position is not defined');
        }
        // deallocate visited mapcell
        this.mapController.setCellOccupied(this.mapPosition, false);
        this.mapPosition = this._nextPosition.clone();
        this._nextPosition = null;
        this.setState(PersonState.STANDING);
    }
}