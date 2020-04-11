import { viewPortSelector, gameControllerSelector } from '../services/selectors';
import * as ECSA from '../../libs/pixi-component';
import { ResourceStorage } from '../services/resource-storage';
import { isMobileDevice } from '../../libs/pixi-component/utils/functions';
import { DialogController } from '../components/controllers/dialog-controller';

export const introAction = (scene: ECSA.Scene, resources: ResourceStorage) => {
    const viewPort = viewPortSelector(scene);
    const fontName = gameControllerSelector(scene).currentFont;
    const text = resources.getText(resources.gameConfig.defaultLanguage, isMobileDevice() ? 'intro_mobile' : 'intro_pc');
    const dlg = new DialogController({ fontName, text, gameConfig: resources.gameConfig });

    const action = new ECSA.ChainComponent()
        .execute(() => viewPort.visible = false)
        .addComponentAndWait(dlg)
        .execute(() => viewPort.visible = true);

    scene.stage.addComponent(action);
    return action;
};