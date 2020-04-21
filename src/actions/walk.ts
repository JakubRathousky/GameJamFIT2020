import * as ECSA from '../../libs/pixi-component';
import { MoveAnim } from '../components/animations/move-anim';
import { PersonController } from '../components/controllers/person-controller';

export const walkingAction = (props: {
    person: PersonController;
    position: ECSA.Vector;
    direction: ECSA.Vector;
    tileSize: number;
    walkSpeed: number;
}): ECSA.ChainComponent => {
    const { person, position, direction, tileSize, walkSpeed } = props;

    const moveAnim = new MoveAnim({ mapPosition: position, direction, tileSize, speed: walkSpeed });

    return new ECSA.ChainComponent('Walking')
        .call(() => person.startWalking(direction))
        .addComponentAndWait(moveAnim)
        .call(() => person.finishWalking());
};