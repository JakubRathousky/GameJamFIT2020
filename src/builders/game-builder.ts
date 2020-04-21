import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { MapNames, Attributes, SceneObjects, down, keyboadMapping, InputActions, Messages } from '../entities/constants';
import { KeyInputComponent } from '../../libs/pixi-component/components/key-input-component';
import { VirtualGamepadComponent } from '../../libs/pixi-component/components/virtual-gamepad-component';
import { isMobileDevice } from '../../libs/pixi-component/utils/functions';
import { GameController } from '../components/controllers/game-controller';
import { introAction } from '../actions/intro';
import DebugComponent from '../../libs/pixi-component/components/debug-component';
import { sceneSwitchAction } from '../actions/scene-switch';
import { sceneFadeAction } from '../actions/scene-fade';

const build = (props: {
    name: MapNames; scene: ECSA.Scene; resources: ResourceStorage;
}) => {
    const { name, scene, resources } = props;

    scene.clearScene();

    // inject virtual gamepad for mobile devices
    if (isMobileDevice()) {
        scene.addGlobalComponentAndRun(new VirtualGamepadComponent({
            KEY_UP: keyboadMapping[InputActions.ACTION_UP],
            KEY_DOWN: keyboadMapping[InputActions.ACTION_DOWN],
            KEY_LEFT: keyboadMapping[InputActions.ACTION_LEFT],
            KEY_RIGHT: keyboadMapping[InputActions.ACTION_RIGHT],
            KEY_A: keyboadMapping[InputActions.ACTION_INTERACT],
            KEY_X: keyboadMapping[InputActions.ACTION_OPEN]
        }));
    } else {
        scene.addGlobalComponentAndRun(new KeyInputComponent());
    }

    scene.assignGlobalAttribute(Attributes.RESOURCES, resources);

    if(scene.config.debugEnabled) {
        const debugComponent = scene.findGlobalComponentByName<DebugComponent>(DebugComponent.name);
        if(debugComponent) {
            debugComponent.discaredMessages.push(Messages.PERSON_STATE_CHANGED, Messages.WALK_STEP_FINISHED);
        }
        debugComponent.displayProps = false;
    }


    scene.stage.addChild(new ECSA.Container(SceneObjects.LAYER_HUD));
    const viewPort = new ECSA.Container(SceneObjects.LAYER_VIEWPORT);
    scene.stage.addChild(viewPort);

    // build main game controller
    const gameController = new GameController(resources.gameConfig);
    scene.addGlobalComponentAndRun(gameController);

    // build scene
    const playerDefaultPos = resources.getMap(name).playerDefaultPos;
    // first dialogue
    introAction({scene, resources})
        .mergeWith(sceneSwitchAction({name, scene, resources, playerPosition: playerDefaultPos, playerDirection: down, unblockPlayer: true}))
        .mergeWith(sceneFadeAction({scene, fadeIn: true}))
        .executeUpon(scene.stage);
};

export default {
    build
};