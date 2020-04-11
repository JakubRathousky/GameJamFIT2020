import * as ECSA from '../../libs/pixi-component';
import { MoveAnim } from '../components/animations/move-anim';
import { PersonController } from '../components/controllers/person-controller';

export const walkingAction = (person: PersonController, position: ECSA.Vector, direction: ECSA.Vector, tileSize: number, walkSpeed: number) => {
    const moveAnim = new MoveAnim({ mapPosition: position, direction, tileSize, speed: walkSpeed });
    const cmp = new ECSA.ChainComponent()
        .execute(() => person.startWalking(direction))
        .addComponentAndWait(moveAnim)
        .execute(() => person.finishWalking());
    person.owner.addComponentAndRun(cmp);

    return cmp;
};