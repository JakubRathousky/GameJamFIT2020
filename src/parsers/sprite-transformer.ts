import { RawSpriteSetData, RawSpriteCoord } from '../entities/parsed/sprites-rawdata';
import { SpriteSheet, SpriteSet, SpriteAnimation, SpriteCoord } from '../entities/functional/spritesheet';

export class SpriteTransformer {

    buildSprites(data: RawSpriteSetData[]): Map<string, SpriteSheet> {
        const output = new Map<string, SpriteSheet>();

        data.map(spriteSet => {
            const spriteSetEntity = new SpriteSheet();
            spriteSetEntity.name = spriteSet.name;
            spriteSetEntity.spriteSheet = spriteSet.spriteset;
            spriteSetEntity.spriteSets = new Map(spriteSet.sprites.map(sprite => {
                const spriteEntity = new SpriteSet();
                spriteEntity.name = sprite.name ? sprite.name : 'default';
                spriteEntity.offsetX = sprite.offsetX;
                spriteEntity.offsetY = sprite.offsetY;
                spriteEntity.width = sprite.width;
                spriteEntity.height = sprite.height;
                spriteEntity.animations = new Map(sprite.animations ? sprite.animations.map(anim => {
                    const sequence = new SpriteAnimation();
                    sequence.side = anim.sequence.side.map(seq => this.createSpriteCoord(seq, sprite.width, sprite.height));
                    sequence.back = anim.sequence.back.map(seq => this.createSpriteCoord(seq, sprite.width, sprite.height));
                    sequence.front = anim.sequence.front.map(seq => this.createSpriteCoord(seq, sprite.width, sprite.height));
                    return [anim.name ? anim.name : 'default', sequence];
                }) : []);
                return [spriteEntity.name, spriteEntity];
            }));

            output.set(spriteSet.name, spriteSetEntity);
        });

        return output;
    }

    private createSpriteCoord(coord: RawSpriteCoord, globalWidth: number, globalHeight: number): SpriteCoord {
        return {
            width: globalWidth,
            height: globalHeight,
            ...coord,
        };
    }
}