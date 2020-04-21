import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { readLabelAction } from '../../actions/read-label';
import { playerControllerSelector } from '../../services/selectors';

interface InfoProps extends BaseTriggerProps {
    textKey: string;
}

/**
 * Info dialog trigger
 */
export class Info extends BaseTrigger<InfoProps> {

    execute() {
        const fontName = this.gameCtrl.currentFont;
        const text = this.resourceStorage.getText(this.resourceStorage.gameConfig.defaultLanguage, this.props.textKey);

        readLabelAction({resource: this.resourceStorage, fontName, text, interactingPerson: playerControllerSelector(this.scene)})
            .call(() => this.executing = false)
            .executeUpon(this.scene.stage);
    }
}