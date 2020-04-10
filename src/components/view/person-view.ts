
import * as ECSA from '../../../libs/pixi-component';
import { left, right, up, down, PersonNames, PersonState } from '../../entities/constants';
import { Messages } from '../../../libs/pixi-component/engine/constants';
import Message from '../../../libs/pixi-component/engine/message';
import { BaseComponent } from '../base-component';
import { WalkAnim } from '../animations/walk-anim';
import { SpriteSet, SpriteCoord, SpriteAnimation } from '../../entities/functional/spritesheet';
import { mapControllerSelector } from '../../services/selectors';
import { PersonController } from '../controllers/person-controller';

export class PersonViewModelProps {
    name: PersonNames;
    controller?: string;
}

export class PersonViewModel extends BaseComponent<PersonViewModelProps> {

    private personCtrl: PersonController;
    private personData: SpriteSet;
    private walkAnim: WalkAnim;
    private defaultAnchor: ECSA.Vector;
    private tileSize: number;

    onInit() {
        super.onInit();
        this.subscribe(Messages.STATE_CHANGED);
        this.personCtrl = this.owner.findComponentByName(this.props.controller ?? PersonController.name);
        this.personData = this.resourceStorage.getPersonSpriteSheet(this.props.name).spriteSets.get('default');
    }

    onAttach() {
        this.defaultAnchor = new ECSA.Vector(this.owner.asSprite().anchor.x, this.owner.asSprite().anchor.y);
        this.tileSize = mapControllerSelector(this.scene).tileSize;
        this.owner.position.set(this.personCtrl.mapPosition.x * this.tileSize, this.personCtrl.mapPosition.y * this.tileSize);
    }

    onMessage(msg: Message) {
        if (msg.action === Messages.STATE_CHANGED && msg.gameObject === this.owner) {
            this.walkAnim = null;
        }
    }

    onUpdate() {
        this.renderFrame();
    }

    protected renderFrame() {
        this.owner.asSprite().pivot.set(0, 0);
        this.owner.asSprite().anchor.set(this.defaultAnchor.x, this.defaultAnchor.y);

        switch (this.personCtrl.state) {
            case PersonState.STANDING:
            case PersonState.INTERACTING:
                this.renderStanding();
                break;
            case PersonState.WALKING:
                this.renderWalking();
                break;
        }

        if (this.personCtrl.direction.equals(right)) {
            // invert
            this.owner.scale.x = - Math.abs(this.owner.scale.x);
            this.owner.asSprite().anchor.x = 1 - this.defaultAnchor.x;
        } else {
            this.owner.scale.x = Math.abs(this.owner.scale.x);
            this.owner.asSprite().anchor.x = this.defaultAnchor.x;
        }
    }

    protected renderWalking() {
        const coords = this.getSequence(PersonState.WALKING, this.personCtrl.direction);
        if (!this.walkAnim) {
            this.walkAnim = this.owner.findComponentByName(WalkAnim.name);
        }

        if (Math.abs(this.walkAnim.progress - 0.4) <= 0.3) {
            // roughly 50% of transition -> render walkAnim
            const progNum = Math.floor((this.walkAnim.progress) * 10); // 0,1,2,3,4,...
            const walkAnimIndex = Math.floor((progNum) / 5) % coords.length;
            const seq = coords[walkAnimIndex];
            this.renderSeq(seq);
        } else {
            this.renderStanding();
        }
    }

    protected renderStanding() {
        this.renderSeq(this.getSequence(PersonState.STANDING, this.personCtrl.direction)[0]);
    }

    protected renderSeq(seq: SpriteCoord) {
        this.owner.asSprite().texture.frame = new PIXI.Rectangle(this.personData.offsetX + seq.posX, this.personData.offsetY + seq.posY, this.personData.width, this.personData.height);
        if (seq.scaleX) {
            this.owner.asSprite().scale.x = seq.scaleX;
        }
        if (seq.shiftX) {
            this.owner.asSprite().pivot.x += seq.shiftX;
        }
        if (seq.shiftY) {
            this.owner.asSprite().pivot.y += seq.shiftY;
        }
    }

    protected getSequence(state: PersonState, direction: ECSA.Vector): SpriteCoord[] {
        let set: SpriteAnimation;
        switch (state) {
            case PersonState.STANDING:
                set = this.personData.animations.get('stand');
                break;
            case PersonState.WALKING:
                set = this.personData.animations.get('walk');
                break;
            default:
                throw Error('Unknown player state to animate');
        }

        let seq: SpriteCoord[];

        if (direction.equals(left)) {
            seq = set.side;
        } else if (direction.equals(right)) {
            seq = set.side;
        } else if (direction.equals(up)) {
            seq = set.back;
        } else if (direction.equals(down)) {
            seq = set.front;
        }

        return seq;
    }
}