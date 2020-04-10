
export interface AnimatedTile {
    index: number;
    name: string;
    sequence: number[];
    automatic: boolean;
}

export interface TileSetProps {
    name: string;
    walkable: number[];
    tileSize: number;
    tilesPerRow: number;
    animatedTiles: Map<number, AnimatedTile>;
}

export class TileSet {
    private props: TileSetProps;

    constructor(props: TileSetProps) {
        this.props = props;
    }

    get name() {
        return this.props.name;
    }

    get tileSize() {
        return this.props.tileSize;
    }

    get tilesPerRow() {
        return this.props.tilesPerRow;
    }

    getAnimatedTileByTileIndex(texIndex: number) {
        return this.props.animatedTiles.get(texIndex);
    }
}