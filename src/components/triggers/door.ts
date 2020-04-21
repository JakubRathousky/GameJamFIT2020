import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { MapNames, up, down, left, right, Messages } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { enterDoorAction } from '../../actions/enter-door';
import { playerControllerSelector } from '../../services/selectors';
import { MapChangeMessage } from '../../entities/messages/map-change-message';
import { sceneSwitchWithFadeAction } from '../../actions/scene-switch-with-fade';

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
        const playerCtrl = playerControllerSelector(this.scene);
        // direction of the player when entering a new scene
        let finalDirection = playerCtrl.direction;

        if (this.props.targetDirection === 'up') {
            finalDirection = up;
        } else if (this.props.targetDirection === 'down') {
            finalDirection = down;
        } else if (this.props.targetDirection === 'left') {
            finalDirection = left;
        } else if (this.props.targetDirection === 'right') {
            finalDirection = right;
        }

        const doorEnterInfo: MapChangeMessage = {
            sourceMap: this.gameCtrl.currentMap,
            targetMap: this.props.targetMap
        };

        const sceneSwitchProps = {name: this.props.targetMap, scene: this.scene, resources: this.resourceStorage,
            playerPosition: new ECSA.Vector(this.props.targetPosition), playerDirection: finalDirection, unblockPlayer: false};

        if (!this.props.animate) {
            sceneSwitchWithFadeAction(sceneSwitchProps)
                .call(() => playerControllerSelector(this.scene).unblockInput())
                .sendMessageDelayed(Messages.PLAYER_CHANGED_MAP, doorEnterInfo)
                .executeUpon(this.scene.stage);
        } else {
            const doorPosition = [playerCtrl.nextPosition, playerCtrl.nextPosition.add(playerCtrl.direction)];

            enterDoorAction({scene: this.scene, person: playerCtrl, doorTilePos: doorPosition})
                .mergeWith(sceneSwitchWithFadeAction(sceneSwitchProps))
                .call(() => playerControllerSelector(this.scene).unblockInput())
                .sendMessageDelayed(Messages.PLAYER_CHANGED_MAP, doorEnterInfo)
                .executeUpon(this.scene.stage);
        }
    }
}
