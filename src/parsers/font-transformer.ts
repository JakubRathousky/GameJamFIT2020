import { RawFontData, RawCharData } from '../entities/parsed/font-rawdata';
import { Font } from '../entities/functional/font';

export class FontTransformer {

    buildFonts(fontData: RawFontData[]): Map<string, Font> {
        const fonts = new Map<string, Font>();

        for(let font of fontData) {
            const texture = PIXI.BaseTexture.from(font.name);
            const lettersPerRow = Math.floor(texture.width / font.defaultWidth);
            const chars = new Map<string, RawCharData>();

            for(let key of Object.keys(font.chars)) {
                const charData = font.chars[key];
                chars.set(key, {
                    offsetX: 0,
                    offsetY: 0,
                    width: font.defaultWidth,
                    ...charData
                });
            }
            const fontObj = new Font({lettersPerRow, chars, name: font.name, defaultWidth: font.defaultWidth, defaultHeight: font.defaultHeight });
            fonts.set(font.name, fontObj);
        }

        return fonts;
    }
}