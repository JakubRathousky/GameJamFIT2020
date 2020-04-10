
import * as ECSA from '../../../libs/pixi-component';
import { BaseComponent } from '../base-component';

export interface WalkAnimProps {
    mapPosition: ECSA.Vector;
    direction: ECSA.Vector;
    tileSize: number;
}

export class WalkAnim extends BaseComponent<WalkAnimProps> {

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
        this._progress += delta * 0.003;

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