import * as ECSA from '../../libs/pixi-component';
import { ResourceStorage } from '../services/resource-storage';
import { Messages, PersonNames, right, left, up } from '../entities/constants';
import NPCBuilder from '../builders/npc-builder';
import { playerControllerSelector, gameControllerSelector } from '../services/selectors';
import { PersonController } from '../components/controllers/person-controller';
import { BubbleView } from '../components/view/bubble-view';
import { talkAction } from './talk';

/**
 * Talk between Gil and the player
 */
export const gilTalkAction = (props: {
    scene: ECSA.Scene;
    resource: ResourceStorage;
}): ECSA.ChainComponent => {
    const { scene, resource } = props;

    const playerCtrl = playerControllerSelector(scene);
    let gil: ECSA.Sprite = null;
    let gilCtrl: PersonController = null;

    const fontName = gameControllerSelector(scene).currentFont;

    return new ECSA.ChainComponent('GilTalk')
        .call(() => playerCtrl.blockInput())
        .call(() => {
            // spawn gil
            gil = NPCBuilder.build({
                name: PersonNames.GIL,
                initPosition: new ECSA.Vector(playerCtrl.mapPosition.x + 5, // hardcoded, 5 tiles right from the player
                    playerCtrl.mapPosition.y)
            }, scene, resource).asSprite();

            // get some attributes
            gilCtrl = gil.findComponentByName(PersonController.name);
            playerCtrl.direction = right;
            gilCtrl.direction = left;
        })
        .call(() => gilCtrl.blockInput())
        .sendMessageDelayed(Messages.TALK_STARTED)
        .addComponentAndWait(() => new BubbleView({ // display bubble label
            delay: 1000,
            target: gil
        }))
        .waitFor(() => gilCtrl.performMultiWalk([left, left, left, left])) // go to the player and talk
        .addComponentAndWait(() => talkAction({ resource, fontName, text: resource.getText(resource.gameConfig.defaultLanguage,
            'gil_text_1'), interactingPerson: gilCtrl, listeningPerson: playerCtrl, blockInput: false}))
        .addComponentAndWait(() => talkAction({ resource, fontName, text: resource.getText(resource.gameConfig.defaultLanguage,
            'gil_text_2'), interactingPerson: gilCtrl, listeningPerson: playerCtrl, blockInput: false}))
        .addComponentAndWait(() => talkAction({ resource, fontName, text: resource.getText(resource.gameConfig.defaultLanguage,
            'gil_text_3'), interactingPerson: gilCtrl, listeningPerson: playerCtrl, blockInput: false}))
        .waitFor(() => gilCtrl.performMultiWalk([right, right, up, up, up, up, up, up, up, up])) // walk out from the screen
        .sendMessageDelayed(Messages.TALK_ENDED)
        .call(() => gilCtrl.removeFromScene()) // destroy GIL
        .call(() => playerCtrl.unblockInput()); // unblock the player
};