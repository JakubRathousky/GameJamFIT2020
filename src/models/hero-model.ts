import { GameObjectModel } from './game-object-model';
import { BLOCK_SIZE } from '../constants';
import GameModel, { HeroType } from './game-model';
import * as PIXI from 'pixi.js';
import Vec from '../utils/vec';
import { MoveAnim } from '../animators/move-anim';
import { Assets } from '../constants';


export enum HeroState {
  WALKING,
  STANDING
}

export class HeroModel extends GameObjectModel {

  state: HeroState;
  // temporary target position for walking
  targetPos: Vec;
  walkingAnim: MoveAnim;

  constructor(gameModel: GameModel) {
    super(gameModel);
  }

  init() {
    this.state = HeroState.STANDING;
    let texture: PIXI.Texture;

    switch(this.gameModel.heroType) {
      case HeroType.MAGE:
        texture = PIXI.Texture.from(Assets.HERO_MAGE);
      break;
        case HeroType.ROGUE:
        texture = PIXI.Texture.from(Assets.HERO_ROGUE);
        break;
      case HeroType.WARRIOR:
        texture = PIXI.Texture.from(Assets.HERO_WARRIOR);
        break;
    }
    console.log(texture);
    texture = texture.clone();
    texture.frame = new PIXI.Rectangle(0, 11 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    let sprite = new PIXI.Sprite(texture);
    sprite.texture.frame = new PIXI.Rectangle(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    sprite.position.set(this.gameModel.heroPos.x * BLOCK_SIZE, this.gameModel.heroPos.y * BLOCK_SIZE);
    this.gameModel.root.addChild(sprite);
    this.pixiObj = sprite;
    this.mapPos = this.gameModel.heroPos.clone();
  }

  destroy() {

  }

  walkLeft(): boolean {
    return this.walk(new Vec(this.mapPos.x -1 , this.mapPos.y));
  }

  walkRight(): boolean {
    return this.walk(new Vec(this.mapPos.x +1, this.mapPos.y));
  }

  walkUp(): boolean {
    return this.walk(new Vec(this.mapPos.x, this.mapPos.y - 1));
  }

  walkDown(): boolean {
    return this.walk(new Vec(this.mapPos.x, this.mapPos.y + 1));
  }

  walk(targetPos: Vec): boolean {
    if (this.state === HeroState.STANDING && this.gameModel.gameMap.getTile(targetPos).isWalkable) {
      this.targetPos = targetPos;
      this.state = HeroState.WALKING;

      this.walkingAnim = new MoveAnim(this, (this.gameModel.isDay === false) ? 28 : 20, this.mapPos, this.targetPos, () => {
        this.state = HeroState.STANDING;
        this.mapPos = this.targetPos.clone();
        this.walkingAnim = null;
      });

      return true;
    } else {
      return false;
    }
  }

  update(delta: number, absolute: number) {
    if(this.state === HeroState.WALKING) {
      this.walkingAnim.update(delta, absolute);
    }
  }
}