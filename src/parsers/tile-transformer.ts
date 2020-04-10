import { RawSheetsData } from '../entities/parsed/sheets-rawdata';
import { TileSet } from '../entities/functional/tileset';

export class TileTransformer {

    buildTileSets(sheetsData: RawSheetsData): Map<string, TileSet> {
        const output = new Map<string, TileSet>();

        sheetsData.tileSets.map(tileSet => {
            const texture = PIXI.BaseTexture.from(tileSet.name);
            const tilesPerRow = texture.width / tileSet.tileSize;

            const tileMap = new TileSet({
                name: tileSet.name,
                tilesPerRow: tilesPerRow,
                walkable: tileSet.walkable,
                tileSize: tileSet.tileSize,
                animatedTiles: tileSet.animated ? new Map(tileSet.animated.map(anim => {
                    const animTile = {...anim};
                    return [anim.index, animTile];
                })) : new Map(),
            });

            output.set(tileSet.name, tileMap);
        });

        return output;
    }
}