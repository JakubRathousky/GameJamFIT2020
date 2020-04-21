import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { DialogController } from '../components/controllers/dialog-controller';
import { ResourceStorage } from '../services/resource-storage';
import { Messages } from '../entities/constants';

/**
 * Talk between two people
 */
export const talkAction = (props: {
    resource: ResourceStorage;
    fontName: string;
    text: string;
    interactingPerson: PersonController;
    listeningPerson: PersonController;
    blockInput: boolean;
}): ECSA.ChainComponent => {
    const { resource, fontName, text, interactingPerson, listeningPerson, blockInput } = props;

    const dlg = new DialogController({ fontName, text, gameConfig: resource.gameConfig, isPlayer: true });

    return new ECSA.ChainComponent('Talk')
        .call(() => listeningPerson.direction = interactingPerson.direction.multiply(-1)) // face the opposite direction
        .call(() => blockInput ? listeningPerson.blockInput() : {})
        .call(() => blockInput ? interactingPerson.blockInput() : {})
        .call((cmp) => cmp.sendMessage(Messages.TALK_STARTED))
        .addComponentAndWait(dlg)
        .call((cmp) => cmp.sendMessage(Messages.TALK_ENDED))
        .call(() => blockInput ? interactingPerson.unblockInput() : {})
        .call(() => blockInput ? listeningPerson.unblockInput(): {});
};