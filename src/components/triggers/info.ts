import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { readLabelAction } from '../../actions/read-label';

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

        readLabelAction(this.scene, this.resourceStorage, fontName, text, this.playerCtrl).execute(() => this.executing = false);
    }
}