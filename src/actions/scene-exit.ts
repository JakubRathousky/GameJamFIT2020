import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { sceneFadeAction } from './scene-fade';

export const sceneExitAction = (scene: ECSA.Scene, person: PersonController) => {
    const cmp = new ECSA.ChainComponent()
        .execute(() => person.owner.visible = false)
        .waitFrames(15)
        .waitForFinish(() => sceneFadeAction(scene, false));

    scene.stage.addComponentAndRun(cmp);
    return cmp;
};