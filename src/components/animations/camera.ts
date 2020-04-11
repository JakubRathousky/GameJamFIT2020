
import * as ECSA from '../../../libs/pixi-component';

export interface CameraProps {
    container: ECSA.GameObject;
}

/**
 * A simple that is moving with the parent container so that the target object is always in the middle
 */
export class Camera extends ECSA.Component<CameraProps> {

    private scrWidth: number;
    private scrHeight: number;

    onInit() {
        this.scrWidth = this.scene.app.screen.width;
        this.scrHeight = this.scene.app.screen.height;
    }

    onUpdate() {
        const box = this.owner.asSprite().getBounds();
        let playerPos = this.owner.pixiObj.position;

        let newX = ((-1)*(playerPos.x + box.width / 2) * this.props.container.asContainer().scale.x) + (this.scrWidth / 2);
        let newY = ((-1)*(playerPos.y + box.height / 2) * this.props.container.asContainer().scale.y) + (this.scrHeight / 2);
        this.props.container.asContainer().position.set(newX, newY);
    }
}