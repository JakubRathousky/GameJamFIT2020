import { BaseTrigger, BaseTriggerProps, TriggerCondition, TriggerDirection } from './base-trigger';
import * as ECSA from '../../../libs/pixi-component';
import { PersonController } from '../controllers/person-controller';
import { talkAction } from '../../actions/talk';

enum DudeDialogState {
    NONE = 0,
    ANSWER_1 = 1,
    ANSWER_2 = 2,
    ANSWER_3 = 3,
    ANSWER_4 = 4,
    ANSWER_5 = 5,
}

/**
 * Experimental trigger for interaction with dude
 */
export class DudeTrigger extends BaseTrigger<BaseTriggerProps> {

    private dudeCtrl: PersonController;
    private state: DudeDialogState = DudeDialogState.NONE;

    constructor() {
        super({
            mapPosition: new ECSA.Vector(0),
            condition: TriggerCondition.TRY_TO_INTERACT,
            direction: TriggerDirection.ANY
        });
    }

    onAttach() {
        super.onAttach();
        this.dudeCtrl = this.owner.findComponentByName(PersonController.name);
    }


    get mapPosition() {
        return this.dudeCtrl.mapPosition;
    }

    execute() {
        switch (this.state) {
            case DudeDialogState.NONE:
                this.state = DudeDialogState.ANSWER_1;
                this.displayDialog('dude_text_idle');
                break;
            case DudeDialogState.ANSWER_1:
                this.state = DudeDialogState.ANSWER_2;
                this.displayDialog('dude_text_1');
                break;
            case DudeDialogState.ANSWER_2:
                this.state = DudeDialogState.ANSWER_3;
                this.displayDialog('dude_text_2');
                break;
            case DudeDialogState.ANSWER_3:
                this.state = DudeDialogState.ANSWER_4;
                this.displayDialog('dude_text_3');
                break;
            case DudeDialogState.ANSWER_4:
                this.state = DudeDialogState.ANSWER_5;
                this.displayDialog('dude_text_4');
                break;
            case DudeDialogState.ANSWER_5:
                this.displayDialog('dude_text_5');
                break;
        }
    }

    protected displayDialog(textKey: string) {
        const fontName = this.gameCtrl.currentFont;
        const text = this.resourceStorage.getText(this.resourceStorage.gameConfig.defaultLanguage, textKey);
        talkAction(this.scene, this.resourceStorage, fontName, text, this.playerCtrl, this.dudeCtrl).execute(() => this.executing = false);
    }
}