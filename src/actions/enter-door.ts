import { PersonState } from '../components/controllers/person-controller';
import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { ResourceStorage } from '../services/resource-storage';
import { mapControllerSelector, tileSelector } from '../services/selectors';
import { TileAnimator } from '../components/animations/tile-animator';
import { Messages } from '../entities/constants';

/**
 * Action for entering a door
 */
export const enterDoorAction = (scene: ECSA.Scene, resource: ResourceStorage, person: PersonController, doorTilePos: ECSA.Vector[]) => {

    const mapCtrl = mapControllerSelector(scene);

    // set tile animations
    const animations = doorTilePos.map(pos => {
        const cell = mapCtrl.getCell(pos);
        const tile = tileSelector(scene, cell.pos);
        return {
            tile, animator: new TileAnimator({
                tile: mapCtrl.getAnimatedTileByTileIndex(cell.tileSetIndex),
                tileSet: mapCtrl.tileSet,
            })
        };
    });

    const cmp = new ECSA.ChainComponent()
        .execute(() => person.setState(PersonState.CUTSCENE))   // switch player state
        .execute(() => animations.forEach(anim => anim.tile.addComponent(anim.animator))) // wait for animation of the door
        .waitForFinish(animations.map(a => a.animator))
        .execute((cmp) => cmp.sendMessage(Messages.DOOR_OPENED))
        .waitForFinish(() => person.performWalk(person.direction, true)) // walk towards the door
        .execute(() => person.owner.visible = false)
        .execute(() => person.teleport(person.mapPosition.add(person.direction))) // clean up occupied tiles
        .execute(() => animations.forEach(anim => (anim.animator.props.reverse = true) && (anim.tile.addComponentAndRun(anim.animator)))) // close the door
        .waitForFinish(animations.map(a => a.animator))
        .execute((cmp) => cmp.sendMessage(Messages.DOOR_CLOSED));

    scene.stage.addComponentAndRun(cmp);
    return cmp;
};