import { RawMap, RawMapTile } from '../parsers/map-parser';
import Vec from '../utils/vec';

export class MapModel {
  rawMap: RawMap;

  constructor(rawMap: RawMap) {
    this.rawMap = rawMap;
  }

  getTile(pos: Vec): RawMapTile {
    return this.rawMap.getCell(pos);
  }

  controlMapBound(pos: Vec) {
    if (pos.x >= 0 && pos.y >= 0 && pos.x < this.rawMap.columns && pos.y < this.rawMap.rows) {
      return true;
    }
    return false;
  }

  canGoLeft(pos: Vec) {
    console.log(pos);
    let cell = this.rawMap.getCell(new Vec(pos.x - 1, pos.y));
    console.log(cell);
    if (this.controlMapBound(new Vec(pos.x - 1, pos.y)) && cell) {
      return cell.isWalkable;
    }
    return false;
  }

  canGoRight(pos: Vec) {
    let cell = this.rawMap.getCell(new Vec(pos.x + 1, pos.y));
    if (this.controlMapBound(new Vec(pos.x + 1, pos.y)) && cell) {
      return cell.isWalkable;
    }
    return false;
  }

  canGoUp(pos: Vec) {
    let cell = this.rawMap.getCell(new Vec(pos.x, pos.y - 1));
    if (this.controlMapBound(new Vec(pos.x, pos.y - 1)) && cell) {
      return cell.isWalkable;
    }
    return false;
  }

  canGoDown(pos: Vec) {
    let cell = this.rawMap.getCell(new Vec(pos.x, pos.y + 1));
    if (this.controlMapBound(new Vec(pos.x, pos.y + 1)) && cell) {
      return cell.isWalkable;
    }
    return false;
  }

  isItemTile(pos: Vec) {
    return this.rawMap.getCell(new Vec(pos.x, pos.y)).specialFunction >= 80;
  }
  getItem(pos: Vec) {
    let item = this.rawMap.getCell(new Vec(pos.x, pos.y)).specialFunction;
    this.rawMap.getCell(new Vec(pos.x, pos.y)).specialFunction = 0;
    return item;
  }
}