import { Assets } from './../entities/constants';
import { RawFontData } from '../entities/parsed/font-rawdata';
import { RawMapsData } from '../entities/parsed/maps-rawdata';
import { RawMapTilesData } from '../entities/parsed/maptiles-rawdata';
import { ResourceStorage } from './resource-storage';
import MapParser from '../parsers/maptile-parser';
import { RawGameConfig } from '../entities/parsed/game-config';
import { RawSpritesData } from '../entities/parsed/sprites-rawdata';
import { RawTextsData } from '../entities/parsed/texts-rawdata';
import { FontTransformer } from '../parsers/font-transformer';
import { MapTransformer } from '../parsers/map-transformer';
import { SpriteTransformer } from '../parsers/sprite-transformer';
import { RawSheetsData } from '../entities/parsed/sheets-rawdata';
import { TileTransformer } from '../parsers/tile-transformer';

type Progress = (amount: number) => void;

export class GameLoader {

    async loadGame(loader: PIXI.Loader, progressCallBack: Progress): Promise<ResourceStorage> {
        try {
            const allTextureNames: string[] = [];

            progressCallBack(0);
            await this.loadBaseData(loader);
            progressCallBack(25);
            const fontsData = loader.resources[Assets.FONTS_DATA].data as RawFontData[];
            const gameConfig = loader.resources[Assets.GAME_CONFIG_DATA].data as RawGameConfig;
            const mapsData = loader.resources[Assets.MAPS_METADATA].data as RawMapsData[];
            const sheetsData = loader.resources[Assets.SHEETS_DATA].data as RawSheetsData;
            const mapsTiles = loader.resources[Assets.MAPS_TILES].data;
            const spritesData = loader.resources[Assets.SPRITES_DATA].data as RawSpritesData;
            const textsData = loader.resources[Assets.TEXTS_DATA].data as RawTextsData[];
            await this.loadFonts(loader, fontsData, allTextureNames);
            progressCallBack(30);
            const mapsTileData = await this.loadMaps(loader, mapsTiles);
            progressCallBack(60);
            await this.loadAtlases(loader, sheetsData, allTextureNames);
            progressCallBack(70);

            // check if texture names are unique
            if(allTextureNames.length !== [...new Set(allTextureNames)].length) {
                throw Error('Texture names are not unique');
            }
            const fonts = new FontTransformer().buildFonts(fontsData);
            const maps = new MapTransformer().buildMaps(mapsData, mapsTileData, sheetsData);
            const tileSets = new TileTransformer().buildTileSets(sheetsData);
            const texts = new Map(textsData.map(texts => [texts.language, new Map(texts.texts.map(text => [text.key, text.text]))]));
            const personsSprites = new SpriteTransformer().buildSprites(spritesData.persons);
            const itemsSprites = new SpriteTransformer().buildSprites(spritesData.items);

            progressCallBack(80);
            // load textures
            const textures = new Map<string, PIXI.BaseTexture>();
            allTextureNames.forEach(name => {
                textures.set(name, PIXI.BaseTexture.from(name));
            });

            const storage = new ResourceStorage({ fonts, gameConfig, maps, personsSprites, tileSets, itemsSprites, texts, textures });
            progressCallBack(100);
            return storage;
        } catch (err) {
            console.error('Can\'t load game data', err);
        }
    }

    protected async loadBaseData(loader: PIXI.Loader) {
        loader
            .add(Assets.FONTS_DATA, './assets/data/fonts.json')
            .add(Assets.GAME_CONFIG_DATA, './assets/data/game_config.json')
            .add(Assets.MAPS_METADATA, './assets/data/maps_metadata.json')
            .add(Assets.SHEETS_DATA, './assets/data/sheets.json')
            .add(Assets.MAPS_TILES, './assets/data/maps_tiles.txt')
            .add(Assets.SPRITES_DATA, './assets/data/sprites.json')
            .add(Assets.TEXTS_DATA, './assets/data/texts.json');

        return this.buildPromise(loader);
    }

    protected async loadFonts(loader: PIXI.Loader, data: RawFontData[], allTextures: string[]) {
        for (let font of data) {
            loader.add(font.name, font.path);
            allTextures.push(font.name);
        }

        return this.buildPromise(loader);
    }

    protected async loadMaps(loader: PIXI.Loader, tilesData: string) {
        const maps = new MapParser().loadMap(tilesData);
        return this.buildPromise<RawMapTilesData[]>(loader, maps);
    }

    protected async loadAtlases(loader: PIXI.Loader, data: RawSheetsData, allTextures: string[]) {

        for (let atlas of data.spriteAtlases) {
            loader.add(atlas.name, atlas.path);
            allTextures.push(atlas.name);
        }

        for(let tileset of data.tileSets) {
            loader.add(tileset.name, tileset.path);
            allTextures.push(tileset.name);
        }

        return this.buildPromise(loader);
    }


    private async buildPromise<T>(loader: PIXI.Loader, data?: any): Promise<T> {
        return new Promise<T>((resolve) => {
            loader.load(() => resolve(data));
        });
    }
}