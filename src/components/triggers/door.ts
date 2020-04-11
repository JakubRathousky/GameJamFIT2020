import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { MapNames, up, down, left, right } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { enterDoorAction } from '../../actions/enter-door';
import { sceneExitAction } from '../../actions/scene-exit';

interface DoorProps extends BaseTriggerProps {
    targetMap: MapNames;
    targetPosition: [number, number];
    animate: boolean;
    targetDirection?: string;
}

/**
 * Trigger for doors
 */
export class Door extends BaseTrigger<DoorProps> {

    execute() {
        // direction of the player when entering a new scene
        let finalDirection = this.playerCtrl.direction;

        if (this.props.targetDirection === 'up') {
            finalDirection = up;
        } else if (this.props.targetDirection === 'down') {
            finalDirection = down;
        } else if (this.props.targetDirection === 'left') {
            finalDirection = left;
        } else if (this.props.targetDirection === 'right') {
            finalDirection = right;
        }

        if (!this.props.animate) {
            sceneExitAction(this.scene, this.playerCtrl)
                .execute(() => this.gameCtrl.switchMap(this.props.targetMap, new ECSA.Vector(this.props.targetPosition), finalDirection));
            return;
        } else {
            const doorPosition = [this.playerCtrl.nextPosition, this.playerCtrl.nextPosition.add(this.playerCtrl.direction)];

            enterDoorAction(this.scene, this.resourceStorage, this.playerCtrl, doorPosition)
                .waitForFinish(() => sceneExitAction(this.scene, this.playerCtrl))
                .execute(() => this.gameCtrl.switchMap(this.props.targetMap, new ECSA.Vector(this.props.targetPosition), finalDirection));
        }
    }
}
