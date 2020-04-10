import * as ECSA from '../../../libs/pixi-component';

export interface RawMapTileData {
    pos: ECSA.Vector;
    walkableCode: number; // walkable index (0 = walkable, 1 = non-walkable)
    tileSetIndex: number; // default texture index
}

export interface RawMapTilesData {
    name: string;
    rows?: number;
    columns?: number;
    cells?: Map<number, RawMapTileData>;
}