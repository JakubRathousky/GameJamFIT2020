import { PersonState } from './../components/controllers/person-controller';
import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { DialogController } from '../components/controllers/dialog-controller';
import { ResourceStorage } from '../services/resource-storage';
import { Messages } from '../entities/constants';

/**
 * Talk between two people
 */
export const talkAction = (scene: ECSA.Scene, resource: ResourceStorage, fontName: string, text: string,
    interactingPerson: PersonController, listeningPerson: PersonController) => {

    const dlg = new DialogController({ fontName, text, gameConfig: resource.gameConfig });

    const cmp = new ECSA.ChainComponent()
        .execute(() => listeningPerson.direction = interactingPerson.direction.multiply(-1)) // face the opposite direction
        .execute(() => listeningPerson.setState(PersonState.INTERACTING))
        .execute(() => interactingPerson.setState(PersonState.INTERACTING))
        .execute((cmp) => cmp.sendMessage(Messages.TALK_STARTED))
        .addComponentAndWait(dlg)
        .execute((cmp) => cmp.sendMessage(Messages.TALK_ENDED))
        .execute(() => interactingPerson.setState(PersonState.STANDING))
        .execute(() => listeningPerson.setState(PersonState.STANDING));

    scene.stage.addComponentAndRun(cmp);
    return cmp;
};