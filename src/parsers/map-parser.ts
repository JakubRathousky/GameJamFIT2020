import Vec from '../utils/vec';
import * as helpers from '../utils/helpers';

enum ParserMode {
  UNDEFINED = '', // not yet defined parser node (usually before it gets the very first token)
  PATHS = ':paths',
  TEXTURES = ':textures',
  SPECIAL_FUNCTIONS = ':special_functions'
}

export class RawMapTile {
  pos: Vec;
  walkableCode: number; // walkable index (0 = walkable, 1 = non-walkable)
  defaultTexture: number; // default texture index
  specialFunction: number;

  get isWalkable() {
    return this.walkableCode === 0;
  }

  copy(): RawMapTile {
    let cell = new RawMapTile();
    cell.walkableCode = this.walkableCode;
    cell.defaultTexture = this.defaultTexture;
    cell.specialFunction = this.specialFunction;
    cell.pos = this.pos;
    return cell;
  }
}

export class RawMap {
  get blocks() {
    return this.rows * this.columns;
  }

  rows: number;
  columns: number;
  cells: Map<number, RawMapTile> = new Map();

  getCell(pos: Vec) {
    return this.cells.get(helpers.vectorToMapCell(pos, this.columns));
  }

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

  public finalize(output: RawMap) {
    // check the size
    if ((output.columns && output.columns !== this.columns)
      || (output.rows && output.rows !== this.rows)) {
      throw new Error(`Error while parsing paths, unexpected size of the map: expected ${this.columns}x${this.rows}, found ${output.columns}x${output.rows}`);
    }

    output.columns = this.columns;
    output.rows = this.rows;

    // init maptiles
    let allBlocks = this.columns * this.rows;
    for (let i = 0; i < allBlocks; i++) {
      if (!output.cells.has(i)) {
        output.cells.set(i, new RawMapTile());
        output.cells.get(i).pos = new Vec(i % this.columns, Math.floor(i / this.columns));
      }
    }
  }

  protected abstract parseWord(letter: string): boolean;
}

/**
 * Parser for walkable paths
 */
class PathParser extends Parser {

  public parseWord(letter: string): boolean {
    if (/^[0-9a-zA-Z]+$/.test(letter)) {
      this.tokens.push(letter.toLowerCase());
      return true;
    }
    return false;
  }

  public finalize(output: RawMap) {
    super.finalize(output);

    let mapBlocks = this.columns * this.rows;

    for (let i = 0; i < mapBlocks; i++) {
      switch (this.tokens[i]) {
        case '00':
          output.cells.get(i).walkableCode = 0;
          break;
        case 'xx':
          output.cells.get(i).walkableCode = 1;
          break;
        default:
          throw new Error('Unknown token: ' + this.tokens[i]);
      }
    }
  }
}

/**
 * Parser for texture indices
 */
class TexturesParser extends Parser {

  public parseWord(letter: string): boolean {
    if (/^[0-9]+$/.test(letter)) {
      this.tokens.push(parseInt(letter));
      return true;
    }
    return false;
  }

  public finalize(output: RawMap) {
    super.finalize(output);

    let mapBlocks = this.columns * this.rows;
    let lastZeroCounter = 0;
    for (let i = 0; i < mapBlocks; i++) {
      if(this.tokens[i] === 0) {
        output.cells.get(i).defaultTexture = lastZeroCounter++;
      } else {
        lastZeroCounter = 0;
        output.cells.get(i).defaultTexture = this.tokens[i];
      }
    }
  }
}

/**
 * Parser for special functions
 */
class FunctionsParser extends Parser {

  public parseWord(letter: string): boolean {
    if (/^[0-9]+$/.test(letter)) {
      this.tokens.push(parseInt(letter));
      return true;
    }
    return false;
  }

  public finalize(output: RawMap) {
    super.finalize(output);

    let mapBlocks = this.columns * this.rows;

    for (let i = 0; i < mapBlocks; i++) {
      output.cells.get(i).specialFunction = this.tokens[i];
    }
  }
}

/**
 * TXT Map file loader
 */
export class MapParser {

  private parsers = {};
  private currentParser: Parser;

  constructor() {
    // init
    this.parsers[ParserMode.PATHS] = new PathParser();
    this.parsers[ParserMode.TEXTURES] = new TexturesParser();
    this.parsers[ParserMode.SPECIAL_FUNCTIONS] = new FunctionsParser();
  }

  public loadMap(content: string): RawMap {
    let output = new RawMap();

    // start with undefined mode (until we get the first :xxx token)
    let currentMode = ParserMode.UNDEFINED;
    let lineCounter = 0;

    // split the file into lines
    content.split('\n').forEach(line => {
      lineCounter++;
      const linetr = line.trim().toLowerCase();

      // skip comments and empty lines
      if (linetr.startsWith('//') || linetr.length === 0) {
        return;
      }

      let mode = this.checkModeLabel(linetr, currentMode);

      if (mode !== currentMode) {
        // new label detected -> switch to appropriate parser
        currentMode = mode;
        let newParser = this.parsers[currentMode];
        if (this.currentParser) {
          // finalize the previous parser before we move to the next one
          this.currentParser.finalize(output);
        }
        this.currentParser = newParser;
        return; // go to the next line
      }

      if (mode !== ParserMode.UNDEFINED) {
        this.currentParser.parseLine(linetr, lineCounter);
      }
    });

    if (!this.currentParser) {
      throw new Error('Error while parsing the map. No valid data found.');
    }

    // finalize last parser
    this.currentParser.finalize(output);
    return output;
  }

  private checkModeLabel(line: string, currentMode: ParserMode): ParserMode {
    // mode switch. And yeah, it's very sleek
    if (line.startsWith(':')) {
      switch (line) {
        case ParserMode.PATHS:
        case ParserMode.TEXTURES:
        case ParserMode.SPECIAL_FUNCTIONS:
          return line as ParserMode;
        default:
          throw new Error('Unknown error mode switch');
      }
    }
    return currentMode;
  }
}