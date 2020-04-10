import { DialogController } from './../components/controllers/dialog-controller';
import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { MapNames, Attributes, SceneObjects, down, PersonState } from '../entities/constants';
import { KeyInputComponent, Keys } from '../../libs/pixi-component/components/key-input-component';
import { VirtualGamepadComponent } from '../../libs/pixi-component/components/virtual-gamepad-component';
import { isMobileDevice } from '../../libs/pixi-component/utils/functions';
import { GameController } from '../components/controllers/game-controller';
import sceneBuilder from './scene-builder';
import { playerControllerSelector, viewPortSelector, gameControllerSelector } from '../services/selectors';

const setupRootElements = (scene: ECSA.Scene, resources: ResourceStorage) => {
    scene.clearScene();

    if (isMobileDevice()) {
        scene.addGlobalComponentAndRun(new VirtualGamepadComponent({
            KEY_UP: Keys.KEY_UP,
            KEY_DOWN: Keys.KEY_DOWN,
            KEY_LEFT: Keys.KEY_LEFT,
            KEY_RIGHT: Keys.KEY_RIGHT,
            KEY_A: Keys.KEY_SPACE,
            KEY_X: Keys.KEY_ENTER
        }));
    } else {
        scene.addGlobalComponentAndRun(new KeyInputComponent());
    }

    scene.assignGlobalAttribute(Attributes.RESOURCES, resources);
    scene.stage.addChild(new ECSA.Container(SceneObjects.LAYER_HUD));

    const viewPort = new ECSA.Container(SceneObjects.LAYER_VIEWPORT);
    scene.stage.addChild(viewPort);

    const gameController = new GameController(resources.gameConfig);
    scene.addGlobalComponentAndRun(gameController);
};

const build = (props: {
    name: MapNames; scene: ECSA.Scene; resources: ResourceStorage;
}) => {
    const { name, scene, resources } = props;

    setupRootElements(scene, resources);
    sceneBuilder.build({ name, scene, resources, playerDirection: down });

    const playerCtrl = playerControllerSelector(scene);

    // first dialogue
    viewPortSelector(scene).visible = false;
    const fontName = gameControllerSelector(scene).currentFont;
    const text = resources.getText(resources.gameConfig.defaultLanguage, isMobileDevice() ? 'intro_mobile' : 'intro_pc');
    const dlg = new DialogController({ fontName, text });
    scene.stage.addComponent(new ECSA.ChainComponent()
        .execute(() => playerCtrl.setState(PersonState.INTERACTING))
        .addComponentAndWait(dlg)
        .execute(() => playerCtrl.setState(PersonState.STANDING))
        .execute(() => viewPortSelector(scene).visible = true));
};

export default {
    build
};