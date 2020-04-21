
import * as ECSA from '../../../libs/pixi-component';


export interface EaseProps {
    duration: number;
}

/**
 * A simple animation that moves objects between tiles
 */
export class Ease extends ECSA.Component<EaseProps> {

    private _value: number;
    private firstUpdate = 0;

    static linear: any = (current: number, start: number, length: number) => Math.min(1, Math.max(0, (current - start) / length));

    static easeinout: any = (current: number, start: number, length: number) => {
        let pos = Ease.linear(current, start, length);
        let posInt = pos < 0.5 ? 2 * pos * pos : -1 + (4 - 2 * pos) * pos;
        return Math.min(1, Math.max(0, posInt));
    }

    onInit() {
        super.onInit();
        this._value = this.firstUpdate = 0;
    }

    get value() {
        return this._value;
    }

    onUpdate(delta: number, absolute: number) {
        if(this.firstUpdate === 0) {
            this.firstUpdate = absolute;
        }

        this._value = Ease.easeinout(absolute, this.firstUpdate, this.props.duration);

        if (this._value >= 1) {
            this.finish();
        }
    }
}