import { viewPortSelector, gameControllerSelector } from '../services/selectors';
import * as ECSA from '../../libs/pixi-component';
import { ResourceStorage } from '../services/resource-storage';
import { isMobileDevice } from '../../libs/pixi-component/utils/functions';
import { DialogController } from '../components/controllers/dialog-controller';

export const introAction = (props: {
    scene: ECSA.Scene;
    resources: ResourceStorage;
}): ECSA.ChainComponent => {
    const { scene, resources } = props;

    const viewPort = viewPortSelector(scene);
    const fontName = gameControllerSelector(scene).currentFont;
    const text = resources.getText(resources.gameConfig.defaultLanguage, isMobileDevice() ? 'intro_mobile' : 'intro_pc');
    const dlg = new DialogController({ fontName, text, gameConfig: resources.gameConfig, isPlayer: false });

    return new ECSA.ChainComponent('IntroAction')
        .call(() => viewPort.visible = false)
        .addComponentAndWait(dlg)
        .call(() => viewPort.visible = true);
};