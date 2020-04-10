export interface RawSheetsData {
    tileSets: {
        name: string;
        path: string;
        walkable: number[];
        tileSize: number;
        animated: {
            name: string;
            index: number;
            sequence: number[];
            automatic: boolean;
        }[];
    }[];
    spriteAtlases: {
        name: string;
        path: string;
    }[];
}