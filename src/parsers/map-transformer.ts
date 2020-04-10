import * as ECSA from '../../libs/pixi-component';
import { TileMap, Tile } from '../entities/functional/tilemap';
import { RawMapsData } from '../entities/parsed/maps-rawdata';
import { RawMapTilesData } from '../entities/parsed/maptiles-rawdata';
import { RawSheetsData } from '../entities/parsed/sheets-rawdata';
import { PersonNames } from '../entities/constants';

export class MapTransformer {

    buildMaps(mapsData: RawMapsData[], tilesData: RawMapTilesData[], sheetsData: RawSheetsData): Map<string, TileMap> {
        const output = new Map<string, TileMap>();

        mapsData.map(map => {
            const tiles = tilesData.find(tile => tile.name === map.name);
            const tileSet = sheetsData.tileSets.find(set => set.name === map.tileset);

            const cells = new Map<number, Tile>();

            for(let [key, val] of tiles.cells) {
                const tileCopy: Tile = {...val, occupied: false};
                if (tileSet.walkable.indexOf(tileCopy.tileSetIndex) !== -1) {
                    tileCopy.walkableCode = 0xF; // all 4 directions (for now)
                }
                cells.set(key, tileCopy);
            }

            const tileMap = new TileMap({
                name: map.name,
                rows: tiles.rows,
                columns: tiles.columns,
                cells: cells,
                tileSetName: tileSet.name,
                playerDefaultPos: new ECSA.Vector(map.playerPos),
                npcs: map.npcs ? map.npcs.map(npc =>{
                    return {
                        name: npc.name as PersonNames,
                        initPosition: new ECSA.Vector(npc.position),
                        behavior: npc.behavior,
                        trigger: npc.trigger,
                    };
                }) : [],
                staticTriggers: map.staticTriggers ? map.staticTriggers.map(p => {
                    return {
                        name: p.name,
                        mapPosition: new ECSA.Vector(p.position),
                        condition: p.condition,
                        direction: p.direction,
                        props: { ...p.props },
                    };
                }) : []
            });

            output.set(map.name, tileMap);
        });


        return output;
    }
}