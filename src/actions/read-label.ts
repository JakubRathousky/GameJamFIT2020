import { PersonState } from './../components/controllers/person-controller';
import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { DialogController } from '../components/controllers/dialog-controller';
import { ResourceStorage } from '../services/resource-storage';

/**
 * Player reads a label/info/whatever
 */
export const readLabelAction = (scene: ECSA.Scene, resource: ResourceStorage, fontName: string, text: string,
    interactingPerson: PersonController) => {

    const dlg = new DialogController({ fontName, text, gameConfig: resource.gameConfig });

    const cmp = new ECSA.ChainComponent()
        .execute(() => interactingPerson.setState(PersonState.INTERACTING))
        .addComponentAndWait(dlg)
        .execute(() => interactingPerson.setState(PersonState.STANDING));

    scene.stage.addComponentAndRun(cmp);
    return cmp;
};