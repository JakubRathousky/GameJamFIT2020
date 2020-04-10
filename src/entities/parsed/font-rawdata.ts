export interface RawCharData {
    index: number;
    offsetX: number;
    offsetY: number;
    width: number;
}

export interface RawFontData {
    name: string;
    path: string;
    defaultWidth: number;
    defaultHeight: number;
    chars: {
        [key: string]: RawCharData;
    };
}