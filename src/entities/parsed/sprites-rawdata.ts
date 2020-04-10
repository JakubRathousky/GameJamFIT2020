

export interface RawSpriteCoord {
    posX: number;
    posY: number;
    shiftX: number;
    shiftY: number;
    width: number;
    height: number;
    scaleX: number;
}


export interface RawSpriteSetData {
    name: string;
    spriteset: string;
    sprites: {
        name: string;
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
        animations: {
            name: string;
            sequence: {
                front: RawSpriteCoord[];
                back: RawSpriteCoord[];
                side: RawSpriteCoord[];
            };
        }[];
    }[];
}

export interface RawSpritesData {
    persons: RawSpriteSetData[];
    items: RawSpriteSetData[];
}