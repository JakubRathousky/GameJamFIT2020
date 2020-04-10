

export interface SpriteCoord {
    posX: number;
    posY: number;
    shiftX: number;
    shiftY: number;
    width: number;
    height: number;
    scaleX: number;
}

export class SpriteAnimation {
    front: SpriteCoord[];
    back: SpriteCoord[];
    side: SpriteCoord[];
}

export class SpriteSet {
    name: string;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    animations: Map<string, SpriteAnimation>;
}

export class SpriteSheet {
    name: string;
    spriteSheet: string;
    spriteSets: Map<string, SpriteSet>;
}