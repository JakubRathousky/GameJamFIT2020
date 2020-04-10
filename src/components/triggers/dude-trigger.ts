import { DialogController } from '../controllers/dialog-controller';
import { BaseTrigger, BaseTriggerProps, TriggerCondition, TriggerDirection } from './base-trigger';
import { PersonState, Messages } from '../../entities/constants';
import * as ECSA from '../../../libs/pixi-component';
import { PersonController } from '../controllers/person-controller';

enum DudeDialogState {
    NONE = 0,
    ANSWER_1 = 1,
    ANSWER_2 = 2,
    ANSWER_3 = 3,
    ANSWER_4 = 4,
    ANSWER_5 = 5,
}

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
        this.props.mapPosition = this.dudeCtrl.mapPosition;
        this.subscribe(Messages.PERSON_STATE_CHANGED);
    }

    onMessage(msg: ECSA.Message) {
        super.onMessage(msg);
        if (msg.action === Messages.PERSON_STATE_CHANGED && msg.gameObject === this.owner) {
            // update position
            this.props.mapPosition = this.dudeCtrl.mapPosition;
        }
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
        const dlg = new DialogController({ fontName, text });
        this.scene.stage.addComponent(new ECSA.ChainComponent()
            .execute(() => this.dudeCtrl.direction = this.playerCtrl.direction.multiply(-1)) // opposite direction
            .execute(() => this.dudeCtrl.setState(PersonState.INTERACTING))
            .execute(() => this.playerCtrl.setState(PersonState.INTERACTING))
            .addComponentAndWait(dlg)
            .execute(() => this.playerCtrl.setState(PersonState.STANDING))
            .execute(() => this.dudeCtrl.setState(PersonState.STANDING))
            .execute(() => this.executing = false)
        );
    }
}