import { RawGameConfig } from '../entities/parsed/game-config';
import { Font } from '../entities/functional/font';
import { TileMap } from '../entities/functional/tilemap';
import { SpriteSheet } from '../entities/functional/spritesheet';
import { TileSet } from '../entities/functional/tileset';

export interface ResourceProps {
    fonts: Map<string, Font>; // mapped by font name
    gameConfig: RawGameConfig;
    maps: Map<string, TileMap>;
    tileSets: Map<string, TileSet>;
    personsSprites: Map<string, SpriteSheet>;
    itemsSprites: Map<string, SpriteSheet>;
    texts: Map<string, Map<string, string>>; // mapped by language code and then by key
    textures: Map<string, PIXI.BaseTexture>;
}

/**
 * Storage for all resources and game assets
 */
export class ResourceStorage {
    private props: ResourceProps;

    constructor(props: ResourceProps) {
        this.props = props;
    }

    get gameConfig() {
        return this.props.gameConfig;
    }

    getText(lang: string, key: string) {
        return this.props.texts.get(lang).get(key);
    }

    getFont(name: string) {
        return this.props.fonts.get(name);
    }

    getTexture(name: string) {
        return this.props.textures.get(name);
    }

    getMapTexture(name: string) {
        const tilesetName = this.props.maps.get(name).tileSetName;
        return this.props.textures.get(tilesetName);
    }

    getPersonSpriteTexture(name: string) {
        const textureName = this.props.personsSprites.get(name).spriteSheet;
        return this.props.textures.get(textureName);
    }

    getPersonSpriteSheet(name: string) {
        return this.props.personsSprites.get(name);
    }

    getFontTexture(name: string) {
        return this.getTexture(name);
    }

    createItemTexture(name: string) {
        // we are destroying items when switching the scenes. Thus we need to clone the textures for every case
        // don't worry.. the data resides in BaseTexture which gets loaded only once
        const item = this.props.itemsSprites.get(name);
        const baseTexture = this.getTexture(item.spriteSheet);
        const sprite = item.spriteSets.get('default'); // item should always have only one sprite
        return new PIXI.Texture(baseTexture, new PIXI.Rectangle(sprite.offsetX, sprite.offsetY, sprite.width, sprite.height));
    }

    getMap(name: string): TileMap {
        return this.props.maps.get(name);
    }

    getTileSet(name: string): TileSet {
        return this.props.tileSets.get(name);
    }
}