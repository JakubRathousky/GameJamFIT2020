import { BaseTrigger, BaseTriggerProps } from './base-trigger';
import { MapNames, PersonState, up, down, left, right } from '../../entities/constants';
import { TileAnimator } from '../animations/tile-animator';
import * as ECSA from '../../../libs/pixi-component';

interface DoorProps extends BaseTriggerProps {
    targetMap: MapNames;
    targetPosition: [number, number];
    animate: boolean;
    targetDirection?: string;
}

export class Door extends BaseTrigger<DoorProps> {

    execute() {
        let finalDirection = this.playerCtrl.direction;

        if (this.props.targetDirection === 'up') {
            finalDirection = up;
        } else if (this.props.targetDirection === 'down') {
            finalDirection = down;
        } else if (this.props.targetDirection === 'left') {
            finalDirection = left;
        } else if (this.props.targetDirection === 'right') {
            finalDirection = right;
        }

        const fadingAnimation = new ECSA.ChainComponent().beginWhile(() => this.scene.stage.alpha !== 0).execute(() => {
            this.scene.stage.alpha = Math.max(this.scene.stage.alpha - 0.1, 0);
        }).waitFrames(1).endWhile();


        if (!this.props.animate) {
            this.owner.addComponent(
                new ECSA.ChainComponent()
                    .execute(() => this.playerCtrl.owner.visible = false)
                    .waitFrames(15)
                    .addComponentAndWait(fadingAnimation)
                    .execute(() => this.gameCtrl.switchMap(this.props.targetMap, new ECSA.Vector(this.props.targetPosition), finalDirection)));
            return;
        }

        this.playerCtrl.setState(PersonState.CUTSCENE);

        const firstTilePos = this.playerCtrl.nextPosition;
        const secondTilePos = firstTilePos.add(this.playerCtrl.direction);

        const cell1 = this.mapCtrl.getCell(firstTilePos);
        const cell2 = this.mapCtrl.getCell(secondTilePos);

        const tile1 = this.scene.findObjectByName(`TILE_${cell1.pos.x}_${cell1.pos.y}`);
        const tile2 = this.scene.findObjectByName(`TILE_${cell2.pos.x}_${cell2.pos.y}`);

        const anim1 = new TileAnimator({
            tile: this.mapCtrl.getAnimatedTileByTileIndex(cell1.tileSetIndex),
            tileSet: this.mapCtrl.tileSet,
        });
        const anim2 = new TileAnimator({
            tile: this.mapCtrl.getAnimatedTileByTileIndex(cell2.tileSetIndex),
            tileSet: this.mapCtrl.tileSet,
        });

        /*
    // This is an alternative of how it looks with ChainComponent()
    this.owner.addComponent(
        new ChainComponent()
        .execute(() => {    // attach  door animation to the object
            tile1.addComponent(anim1);
            tile2.addComponent(anim2);
        })
        .waitForFinish([anim1, anim2]) // wait until both animations have finished
        .waitForFinish(() => this.playerCtrl.performWalk(this.playerCtrl.direction, true)) // walk to the door and wait for it
        .execute(() => this.playerCtrl.owner.visible = false)  // hide the player
        .execute(() => {
            anim1.props.reverse = anim2.props.reverse = true;   // reverse the door animation and close the door
            tile1.addComponentAndRun(anim1);
            tile2.addComponentAndRun(anim2);
        })
        .waitForFinish([anim1, anim2])  // wait for the door animation to finish
        .waitFrames(15) // wait for 15 frames
        .addComponentAndWait(fadingAnimation) // fade into black
        .execute(buildScene) // switch to another scene
    );*/

        this.owner.addComponent(
            new ECSA.AsyncComponent(function* (cmp) {
                const { tile1, tile2, anim1, anim2, playerCtrl, fadingAnimation, gameCtrl, targetMap, targetPosition, finalDirection } = cmp.props;
                tile1.addComponent(anim1);  // attach door animation to the object
                tile2.addComponent(anim2);
                yield cmp.waitForFinish([anim1, anim2]); // wait until both animations have finished
                const newCmp = playerCtrl.performWalk(playerCtrl.direction, true);  // walk to the door and wait for it
                yield cmp.waitForFinish(newCmp);
                playerCtrl.owner.visible = false; // hide the player
                playerCtrl.teleport(playerCtrl.mapPosition.add(finalDirection)); // remove from the map
                anim1.props.reverse = anim2.props.reverse = true;   // reverse the door animation and close the door
                tile1.addComponentAndRun(anim1);
                tile2.addComponentAndRun(anim2);
                yield cmp.waitForFinish([anim1, anim2]);  // wait for the door animation to finish
                yield cmp.waitFrames(15); // wait for 15 frames
                yield cmp.addComponentAndWait(fadingAnimation); // fade into black
                gameCtrl.switchMap(targetMap, new ECSA.Vector(targetPosition), finalDirection); // switch to another scene
            }, { tile1, tile2, anim1, anim2, fadingAnimation, gameCtrl: this.gameCtrl, playerCtrl: this.playerCtrl, targetMap: this.props.targetMap, targetPosition: this.props.targetPosition, finalDirection })
        );
    }
}
