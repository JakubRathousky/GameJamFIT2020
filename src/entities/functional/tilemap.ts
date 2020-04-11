import * as ECSA from '../../../libs/pixi-component';
import { TriggerCondition, TriggerDirection } from '../../components/triggers/base-trigger';
import { PersonNames } from '../constants';

export interface Trigger {
    name: string;
    mapPosition: ECSA.Vector;
    condition: TriggerCondition;
    direction: TriggerDirection;
    props: any;
}

export interface NPC {
    name: PersonNames;
    behavior: string;
    initPosition: ECSA.Vector;
    trigger: string;
}

// Waning! this is mutable entity
export interface Tile {
    pos: ECSA.Vector; // position on the map
    walkableCode: number; // walkable index (0 = walkable, 1 = non-walkable)
    occupied: boolean; // whether it is occupied at the moment
    tileSetIndex: number; // default texture index
}

export interface TileMapProps {
    name: string;
    rows: number;
    columns: number;
    cells: Map<number, Tile>;
    tileSetName: string;
    playerDefaultPos: ECSA.Vector;
    staticTriggers: Trigger[];
    npcs: NPC[];
}

export class TileMap {
    private props: TileMapProps;

    constructor(props: TileMapProps) {
        this.props = props;
    }

    get rows() {
        return this.props.rows;
    }

    get columns() {
        return this.props.columns;
    }

    get playerDefaultPos() {
        return this.props.playerDefaultPos;
    }

    get totalCells() {
        return this.props.rows * this.props.columns;
    }

    get tileSetName() {
        return this.props.tileSetName;
    }

    get triggers() {
        return this.props.staticTriggers;
    }

    get npcs() {
        return this.props.npcs;
    }

    getCellByIndex(index: number) {
        return this.props.cells.get(index);
    }

    getCellByPosition(pos: ECSA.Vector) {
        return this.props.cells.get(this.vectorToMapCell(pos));
    }

    clone(): TileMap {
        const output = new TileMap({
            ...this.props,
        });

        output.props.cells = new Map();
        for(let [key, val] of this.props.cells) {
            const tileCopy: Tile = { ...val};
            output.props.cells.set(key, tileCopy);
        }

        output.props.staticTriggers = this.props.staticTriggers.map(p => {return {...p, props: {...p.props} };});
        output.props.npcs = this.props.npcs.map(p => { return {...p}; } );
        return output;
    }

    private vectorToMapCell(vec: ECSA.Vector) {
        return this.columns * vec.y + vec.x;
    };
}