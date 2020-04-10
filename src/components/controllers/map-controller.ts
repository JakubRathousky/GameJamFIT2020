import * as ECSA from '../../../libs/pixi-component';
import { left, right, down, up, MapNames } from '../../entities/constants';
import { TileMap } from '../../entities/functional/tilemap';
import { TileSet } from '../../entities/functional/tileset';
import { BaseComponent } from '../base-component';

export interface MapControllerProps {
    mapName: MapNames;
    map: TileMap;
    tileSet: TileSet;
}

export class MapController extends BaseComponent<MapControllerProps> {

    get mapName() {
        return this.props.mapName;
    }

    get columns() {
        return this.props.map.columns;
    }

    get rows() {
        return this.props.map.rows;
    }

    get tileSize() {
        return this.tileSet.tileSize;
    }

    get tileSet() {
        return this.props.tileSet;
    }

    get playerDefaultPos() {
        return this.props.map.playerDefaultPos;
    }

    getAnimatedTileByTileIndex(texIndex: number) {
        return this.tileSet.getAnimatedTileByTileIndex(texIndex);
    }

    getCell(position: number | ECSA.Vector) {
        if(typeof(position) === 'number') {
            return this.props.map.getCellByIndex(position);
        } else {
            return this.props.map.getCellByPosition(position);
        }
    }

    isCellOccupied(position: number | ECSA.Vector) {
        return this.getCell(position).occupied;
    }

    setCellOccupied(position: number | ECSA.Vector, occupied: boolean) {
        if(position != null) {
            this.getCell(position).occupied = occupied;
        }
    }

    isOutOfBounds(mapPos: ECSA.Vector) {
        return mapPos.x < 0 || mapPos.y < 0 || mapPos.x >= this.columns || mapPos.y >= this.rows;
    }

    canGoLeft(mapPos: ECSA.Vector) {
        const pos2 = mapPos.add(left);
        return  !this.isOutOfBounds(pos2) && !this.isCellOccupied(pos2) && ((this.props.map.getCellByPosition(pos2).walkableCode & 0b1000) === 0b1000);
    }

    canGoRight(mapPos: ECSA.Vector) {
        const pos2 = mapPos.add(right);
        return !this.isOutOfBounds(pos2) && !this.isCellOccupied(pos2) && ((this.props.map.getCellByPosition(pos2).walkableCode & 0b0100) === 0b0100);
    }

    canGoUp(mapPos: ECSA.Vector) {
        const pos2 = mapPos.add(up);
        return !this.isOutOfBounds(pos2) && !this.isCellOccupied(pos2) && ((this.props.map.getCellByPosition(pos2).walkableCode & 0b0010) === 0b0010);
    }

    canGoDown(mapPos: ECSA.Vector) {
        const pos2 = mapPos.add(down);
        return !this.isOutOfBounds(pos2) && !this.isCellOccupied(pos2) && ((this.props.map.getCellByPosition(pos2).walkableCode & 0b0001) === 0b0001);
    }
}