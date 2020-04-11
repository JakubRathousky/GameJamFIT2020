import { ResourceStorage } from '../services/resource-storage';
import * as ECSA from '../../libs/pixi-component';
import { TileAnimator } from '../components/animations/tile-animator';
import { MapController } from '../components/controllers/map-controller';
import { SceneObjects } from '../entities/constants';

const build = (mapCtrl: MapController, resources: ResourceStorage, scene: ECSA.Scene) => {
    const tileSize = mapCtrl.tileSize;
    const mapContainer = scene.findObjectByName(SceneObjects.MAP);
    const tilesPerRow = mapCtrl.tileSet.tilesPerRow;
    const tilesetTexture = resources.getMapTexture(mapCtrl.mapName);

    for (let i = 0; i < mapCtrl.columns; i++) {
        for (let j = 0; j < mapCtrl.rows; j++) {
            const cell = mapCtrl.getCell(new ECSA.Vector(i, j));

            const tile = new ECSA.Builder(scene)
                .withName(`TILE_${i}_${j}`)
                .localPos(i * tileSize, j * tileSize)
                .withParent(mapContainer)
                .asSprite(new PIXI.Texture(tilesetTexture, new PIXI.Rectangle((cell.tileSetIndex % tilesPerRow) * tileSize,
                Math.floor(cell.tileSetIndex / tilesPerRow) * tileSize, tileSize, tileSize)))
                .build();

            if (scene.config.debugEnabled) {
                // write debug info
                new ECSA.Builder(scene)
                    .asText(`${cell.tileSetIndex}\n[${i},${j}]`, new PIXI.TextStyle({ fontSize: 4, fill: '#000' }))
                    .withParent(tile)
                    .build();
                tile.asSprite().tint = cell.walkableCode !== 0 ? 0xCCFFCC : 0xFFCCCC;
            }

            // inject animation
            const anim = mapCtrl.getAnimatedTileByTileIndex(cell.tileSetIndex);
            if (anim && anim.automatic) {
                tile.addComponent(new TileAnimator({ tile: anim, tileSet: mapCtrl.tileSet }));
            }
        }
    }
};

export default { build };