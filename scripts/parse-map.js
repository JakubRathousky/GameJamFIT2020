var Jimp = require('jimp');
var fs = require('fs');

const BLOCK_SIZE = 16;
const MAP_SHIFT_X = 0;
const MAP_SHIFT_Y = 0;

const pad = function(num, size) {
  var s = String(num);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

const blocksEqual = function(map, tileset, mapIndex, mapWidth, tileIndex, tilesWidth) {

  const mapOffsetX = MAP_SHIFT_X + Math.floor(mapIndex % mapWidth) * BLOCK_SIZE;
  const mapOffsetY = MAP_SHIFT_Y + Math.floor(mapIndex / mapWidth) * BLOCK_SIZE;
  const tileOffsetX = Math.floor(tileIndex % tilesWidth) * BLOCK_SIZE;
  const tileOffsetY = Math.floor(tileIndex / tilesWidth) * BLOCK_SIZE;

  for(let i = 0; i < BLOCK_SIZE; i++) {
    for(let j = 0; j < BLOCK_SIZE; j++) {
      if(map.getPixelColor(mapOffsetX + i, mapOffsetY + j) !== tileset.getPixelColor(tileOffsetX + i, tileOffsetY + j)) {
        return false;
      }
    }
  }
  return true;
}

const colorImage = (img, color, block, blocksPerRow) => {
    const x = block % blocksPerRow;
    const y = Math.floor(block / blocksPerRow);

    for(let i = 0; i < BLOCK_SIZE; i++) {
        for(let j = 0; j <BLOCK_SIZE; j++) {
            img.setPixelColor(color, x + i, y + j);
        }
    }
}

const parseMap = (tilesetPath, mapPath, outputFile) => {
    Jimp.read(tilesetPath).then(tileset => {
        const tileWidth = tileset.getWidth() / BLOCK_SIZE;
        const tileHeight = tileset.getHeight() / BLOCK_SIZE;
      
        if(tileWidth !== ~~tileWidth || tileHeight != ~~tileHeight) {
          throw new Error(`Map size is not dividable by ${BLOCK_SIZE}; actual size: ${tileset.getWidth()}x${tileset.getHeight()}`);
        }
        const tileBlocks = tileWidth * tileHeight;
      
        Jimp.read(mapPath).then(map => {
          console.log('Parsing...');
          const mapWidth = (map.getWidth() - 2 * MAP_SHIFT_X)/BLOCK_SIZE;
          const mapHeight = (map.getHeight() - 2 * MAP_SHIFT_Y)/BLOCK_SIZE;
          if(mapWidth !== ~~mapWidth || mapHeight != ~~mapHeight) {
            throw new Error(`Map size is not dividable by ${BLOCK_SIZE}; actual size: ${map.getWidth()}x${map.getHeight()}`);
          }
          console.log(`Blocks: ${mapWidth}x${mapHeight}`);
          console.log(`Tiles: ${tileWidth}x${tileHeight}`);
      
          const mapBlocks = mapWidth * mapHeight;
          const orders = Math.ceil(Math.log10(tileBlocks));
          let mapBuilder = '';
          let notFound = 0;
      
          for(let i = 0; i < mapBlocks; i++) {
            // parse block
            let blFound = false;
      
            for(let j = 0; j < tileBlocks; j++) {
              blFound = blocksEqual(map, tileset, i, mapWidth, j, tileWidth);
              if(blFound) {
                mapBuilder += pad(j, orders) + ' ';
                if(((i+1) % mapWidth) === 0) {
                  mapBuilder += '\n';
                }
                break;
              }
            }
            if(!blFound) {
                console.log(`Block at [${i%mapWidth},${Math.floor(i/mapWidth)}] not found in the tileset!`);
                notFound++;
            } else {
                colorImage(map, 0x000000FF, i, mapWidth);
            }
          }
      
          if(notFound > 0) {
              map.write(mapPath + '_parsed.png');
          }

          console.log(`Found ${mapBlocks - notFound}/${mapBlocks} tiles`)
          console.log(`Writing into ${outputFile}`)
          fs.writeFileSync(outputFile, mapBuilder);
        });
      });
};

if (process.argv.length !== 5) {
    console.error('Expected three arguments!');
    process.exit(1);
}

// first 2 arguments always skipped
parseMap(process.argv[2], process.argv[3], process.argv[4]);