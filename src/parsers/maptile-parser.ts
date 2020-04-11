import * as ECSA from '../../libs/pixi-component';
import { RawMapTilesData, RawMapTileData } from '../entities/parsed/maptiles-rawdata';

enum ParserMode {
    UNDEFINED = '',
    STATIC = 'static',
}

abstract class Parser {
    protected rows = 0;
    protected columns = 0;
    protected tokens = [];

    public parseLine(line: string, linenum: number) {
        let parsedWords = 0;
        let words = line.split(' ');

        // parse each letter of each line
        for (let word of words) {
            if (this.parseWord(word)) {
                parsedWords++;
            } else if (word !== ' ' && word !== '') { // ignore whitespaces
                throw new Error(`Unexpected token ${word} on line ${linenum}:${parsedWords + 1}`);
            }
        }

        if (parsedWords !== 0) {
            if (this.columns === 0) {
                this.columns = parsedWords; // get number of columns
            } else if (this.columns !== parsedWords) {
                throw new Error(`Wrong number of tokens on line ${linenum}; expected ${this.columns} columns, found ${parsedWords}`);
            }

            this.rows++;
        }
    }

    public finalize(map: RawMapTilesData) {
        // check the size
        if ((map.columns && map.columns !== this.columns)
            || (map.rows && map.rows !== this.rows)) {
            throw new Error(`Error while parsing paths, unexpected size of the map: expected ${this.columns}x${this.rows}, found ${map.columns}x${map.rows}`);
        }

        map.columns = this.columns;
        map.rows = this.rows;

        // init maptiles
        let allBlocks = this.columns * this.rows;
        for (let i = 0; i < allBlocks; i++) {
            if (!map.cells.has(i)) {
                const tile: RawMapTileData = {
                    pos: new ECSA.Vector(i % this.columns, Math.floor(i / this.columns)),
                    walkableCode: 0,
                    tileSetIndex: 0
                };
                map.cells.set(i, tile);
            }
        }
    }

    protected abstract parseWord(letter: string): boolean;
}

/**
 * Parser for texture indices
 */
class StaticObjectsParser extends Parser {

    public parseWord(letter: string): boolean {
        if (/^[0-9]+$/.test(letter)) {
            this.tokens.push(parseInt(letter));
            return true;
        }
        return false;
    }

    public finalize(map: RawMapTilesData) {
        super.finalize(map);

        let mapBlocks = this.columns * this.rows;
        for (let i = 0; i < mapBlocks; i++) {
            map.cells.get(i).tileSetIndex = this.tokens[i];
        }
    }
}

/**
 * TXT Map file loader
 */
class MapTileParser {

    private parsers = {};

    constructor() {
        // init
        this.parsers[ParserMode.STATIC] = () => new StaticObjectsParser();
    }

    public loadMap(content: string): RawMapTilesData[] {
        const output: RawMapTilesData[] = [];

        // start with undefined mode (until we get the first :xxx token)
        let currentMode = ParserMode.UNDEFINED;
        let currentParser: Parser;
        let currentMap: RawMapTilesData;
        let lineCounter = 0;

        // split the file into lines
        content.split('\n').forEach(line => {
            lineCounter++;
            const linetr = line.trim();

            // skip comments and empty lines
            if (linetr.startsWith('//') || linetr.length === 0) {
                return;
            }

            if (linetr.startsWith(':')) {
                let newMode = this.parseModeLabel(linetr);
                let name = linetr.split(':')[2];

                // another map to process
                currentMode = newMode;
                let newParser = this.parsers[currentMode]();
                if (currentParser) {
                    // finalize the previous parser before we move to the next one
                    currentParser.finalize(currentMap);
                    output.push(currentMap);
                }
                currentMap = { name: name, cells: new Map() };
                currentParser = newParser;
                return; // go to the next line
            }

            if (currentMode !== ParserMode.UNDEFINED) {
                currentParser.parseLine(linetr, lineCounter);
            }
        });

        if (!currentParser) {
            throw new Error('Error while parsing the map. No valid data found.');
        }

        // finalize last parser
        currentParser.finalize(currentMap);
        output.push(currentMap);
        return output;
    }

    private parseModeLabel(line: string): ParserMode {
        const lineType = line.split(':')[1];
        switch (lineType) {
            case ParserMode.STATIC:
                return lineType as ParserMode;
            default:
                throw new Error('Unknown error mode switch');
        }
    }
}

export default MapTileParser;