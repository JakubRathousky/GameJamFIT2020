import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { DialogController } from '../components/controllers/dialog-controller';
import { ResourceStorage } from '../services/resource-storage';

/**
 * Player reads a label/info/whatever
 */
export const readLabelAction = (props: {
    resource: ResourceStorage;
    fontName: string;
    text: string;
    interactingPerson: PersonController;
}): ECSA.ChainComponent => {
    const { resource, fontName, text, interactingPerson } = props;

    const dlg = new DialogController({ fontName, text, gameConfig: resource.gameConfig, isPlayer: true });

    return new ECSA.ChainComponent('ReadLabel')
        .call(() => interactingPerson.blockInput())
        .addComponentAndWait(dlg)
        .call(() => interactingPerson.unblockInput());
};