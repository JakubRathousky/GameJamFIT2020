import { RawCharData } from '../parsed/font-rawdata';


export interface FontProps {
    name: string;
    defaultWidth: number;
    defaultHeight: number;
    chars: Map<string, RawCharData>;
    lettersPerRow: number;
}

export class Font {

    private props: FontProps;

    constructor(props: FontProps) {
        this.props = props;
    }

    get name() {
        return this.props.name;
    }

    get charDefaultWidth() {
        return this.props.defaultWidth;
    }

    get charDefaultHeight() {
        return this.props.defaultHeight;
    }

    getChar(letterCode: string): RawCharData {
        let letter = this.props.chars.get(letterCode);
        if (!letter) {
            // default for unknown letter
            letter = this.props.chars.get('?');
        }
        return letter;
    }

    getCharRectangle(letterCode: string): PIXI.Rectangle {
        const letter = this.getChar(letterCode);
        const width = letter.width;

        return new PIXI.Rectangle((letter.index % this.props.lettersPerRow) * this.charDefaultWidth,
            Math.floor(letter.index / this.props.lettersPerRow) * this.charDefaultHeight, width, this.charDefaultHeight);
    }

    calcWordLength(word: string, letterSpacing: number = 0) {
        let total = 0;
        for(let char of word) {
            total += (this.getChar(char).width + letterSpacing);
        }
        return total;
    }
}