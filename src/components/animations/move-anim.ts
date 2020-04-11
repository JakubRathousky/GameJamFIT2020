
import * as ECSA from '../../../libs/pixi-component';
import { BaseComponent } from '../base-component';

export interface MoveAnimProps {
    mapPosition: ECSA.Vector;
    direction: ECSA.Vector;
    tileSize: number;
    speed: number;
}

/**
 * A simple animation that moves objects between tiles
 */
export class MoveAnim extends BaseComponent<MoveAnimProps> {

    private targetPosition: ECSA.Vector;
    private targetMapPosition: ECSA.Vector;
    private initialPosition: ECSA.Vector;
    private _progress: number;

    onInit() {
        super.onInit();
        this.targetMapPosition = this.props.mapPosition.add(this.props.direction);
        this.initialPosition = new ECSA.Vector(this.owner.position.x, this.owner.position.y);
        this.targetPosition = this.targetMapPosition.multiply(this.props.tileSize);
        this._progress = 0;
    }

    get progress() {
        return this._progress;
    }

    onUpdate(delta: number) {
        this._progress += delta * 0.001 * this.props.speed;

        if(this._progress >= 1) {
            this._progress = 1;
        }

        const newPos = this.initialPosition.add(this.targetPosition.subtract(this.initialPosition).multiply(this._progress));
        this.owner.position.set(newPos.x, newPos.y);

        if(this._progress === 1) {
            this.finish();
        }
    }
}