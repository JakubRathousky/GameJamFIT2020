
import { BaseComponent } from '../base-component';
import { AnimatedTile, TileSet } from '../../entities/functional/tileset';

export interface TileAnimatorProps {
    tile: AnimatedTile;
    tileSet: TileSet;
    reverse?: boolean;
}

/**
 * Simple tile animation that goes over a collection of sprites and renders them
 */
export class TileAnimator extends BaseComponent<TileAnimatorProps> {

    private currentTileIndex: number;

    onInit() {
        super.onInit();
        this.currentTileIndex = 0;
        this.fixedFrequency = 8;
    }

    onFixedUpdate() {
        const tileSize = this.props.tileSet.tileSize;
        const currentTileIndex = this.props.tile.sequence[this.props.reverse ? (this.props.tile.sequence.length - this.currentTileIndex - 1) : this.currentTileIndex];
        this.owner.asSprite().texture.frame = new PIXI.Rectangle((currentTileIndex % this.props.tileSet.tilesPerRow) * tileSize,
        Math.floor(currentTileIndex / this.props.tileSet.tilesPerRow) * tileSize, tileSize, tileSize);
        this.currentTileIndex = (this.currentTileIndex + 1) % this.props.tile.sequence.length;

        if(this.currentTileIndex === 0 && !this.props.tile.automatic) {
            this.finish();
        }
    }
}