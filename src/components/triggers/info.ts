import { DialogController } from '../controllers/dialog-controller';
import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { PersonState } from '../../entities/constants';
import ChainComponent from '../../../libs/pixi-component/components/chain-component';

interface InfoProps extends BaseTriggerProps {
    textKey: string;
}

export class Info extends BaseTrigger<InfoProps> {

    execute() {
        const fontName = this.gameCtrl.currentFont;
        const text = this.resourceStorage.getText(this.resourceStorage.gameConfig.defaultLanguage, this.props.textKey);
        const dlg = new DialogController({fontName, text});
        this.scene.stage.addComponent(new ChainComponent()
            .execute(() => this.playerCtrl.setState(PersonState.INTERACTING))
            .addComponentAndWait(dlg)
            .execute(() => this.playerCtrl.setState(PersonState.STANDING))
            .execute(() => this.executing = false)
        );
    }
}