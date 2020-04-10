import * as ECSA from '../../libs/pixi-component';
import { PlayerController } from '../components/controllers/player-controller';
import { PlayerViewModel } from '../components/view/player-view';
import { PlayerInputController } from '../components/controllers/player-input-controller';
import { PersonNames, SceneObjects } from '../entities/constants';
import { ResourceStorage } from '../services/resource-storage';
import { Camera } from '../components/animations/camera';
import { viewPortSelector } from '../services/selectors';

export default (scene: ECSA.Scene, resources: ResourceStorage, position: ECSA.Vector, direction: ECSA.Vector) => {
    const playerTexture = resources.getPersonSpriteTexture(PersonNames.PLAYER);
    const viewPortContainer = viewPortSelector(scene);

    return new ECSA.Builder(scene)
        .withParent(viewPortContainer)
        .anchor(0, 0.3)
        .withName(SceneObjects.PLAYER)
        .asSprite(new PIXI.Texture(playerTexture))
        .withComponent(new PlayerController({initPosition: position, initDirection: direction }))
        .withComponent(new PlayerViewModel())
        .withComponent(new PlayerInputController())
        .withComponent(new Camera({ container: viewPortContainer }))
        .build();
};