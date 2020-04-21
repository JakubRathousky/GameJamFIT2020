import { BaseComponent } from '../base-component';
import * as ECSA from '../../../libs/pixi-component';
import { Items } from '../../entities/constants';
import { Ease } from '../animations/ease';

export interface BubbleViewProps {
    delay: number;
    target: ECSA.Container;
}

export class BubbleView extends BaseComponent<BubbleViewProps> {

    private bubbleSprite: ECSA.Container;
    private easeAnim: Ease;
    private startTime = 0;

    onInit() {
        super.onInit();
        this.addLabel();
    }

    onFinish() {
        this.bubbleSprite.detachAndDestroy();
    }

    onUpdate(delta: number, absolute: number) {
        if(this.startTime === 0) {
            this.startTime = absolute;
        }
        const widthDiff = this.props.target.width - this.bubbleSprite.width;

        this.bubbleSprite.position.x = Math.floor(this.props.target.position.x + widthDiff / 2);
        const offsetY = this.easeAnim.value < 0.5 ? this.easeAnim.value * 2 : (1 - this.easeAnim.value) * 2;
        this.bubbleSprite.position.y = Math.floor(this.props.target.position.y - this.bubbleSprite.height - 8) - offsetY * 5;

        if(absolute - this.startTime > this.props.delay) {
            this.finish();
        }
    }

    addLabel() {
        const texture = this.resourceStorage.createItemTexture(Items.BUBBLE);
        this.bubbleSprite = new ECSA.Sprite('bubble', texture.clone());
        this.owner.addChild(this.bubbleSprite);

        this.easeAnim = new Ease({duration: 1000});
        this.bubbleSprite.addComponent(this.easeAnim);
    }
}