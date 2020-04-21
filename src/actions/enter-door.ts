import * as ECSA from '../../libs/pixi-component';
import { PersonController } from '../components/controllers/person-controller';
import { mapControllerSelector, tileSelector } from '../services/selectors';
import { TileAnimator } from '../components/animations/tile-animator';
import { Messages } from '../entities/constants';

/**
 * Action for entering a door
 */
export const enterDoorAction = (props: {
    scene: ECSA.Scene;
    person: PersonController;
    doorTilePos: ECSA.Vector[];
}): ECSA.ChainComponent => {
    const { scene, person, doorTilePos } = props;
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

    return new ECSA.ChainComponent('EnterDoor')
        .call(() => person.blockInput())   // switch player state
        .call(() => animations.forEach(anim => anim.tile.addComponentAndRun(anim.animator))) // wait for animation of the door
        .waitFor(animations.map(a => a.animator))
        .sendMessageDelayed(Messages.DOOR_OPENED)
        .waitFor(() => person.performWalk(person.direction, true)) // walk towards the door
        .call(() => person.hide())
        .call(() => person.teleport(person.mapPosition.add(person.direction))) // clean up occupied tiles
        .call(() => animations.forEach(anim => (anim.animator.props.reverse = true) && (anim.tile.addComponentAndRun(anim.animator)))) // close the door
        .waitFor(animations.map(a => a.animator))
        .sendMessageDelayed(Messages.DOOR_CLOSED);
};