import { GameController } from './game-controller';
import { HeroModel, HeroState } from '../models/hero-model';
import { MapModel } from '../models/map-model';
import { Keys } from './key-controller';
import { Assets, BLOCK_SIZE } from '../constants';
import { ComplexDialog } from '../models/complex-dialog';
import * as PIXI from 'pixi.js';
import Vec from '../utils/vec';

export class HeroController {
  private gameController: GameController;
  private heroModel: HeroModel;
  private mapModel: MapModel;

  constructor(gameController: GameController) {
    this.gameController = gameController;
    this.heroModel = this.gameController.gameModel.hero;
    this.mapModel = this.gameController.gameModel.gameMap;
  }

  lastNPCInterractionCell: Vec = null;

  update(delta: number, absolute: number) {
    if(this.gameController.gameModel.isPaused) {
      return;
    }
    console.log(this);
    if (this.heroModel.state === HeroState.STANDING) {
      if (this.gameController.isKeyPressed(Keys.KEY_LEFT)) {
        if(this.mapModel.canGoLeft(this.heroModel.mapPos)) {
          this.heroModel.walkLeft();
        } else {
          (this.heroModel.pixiObj as PIXI.Sprite).texture.frame = new PIXI.Rectangle(0, BLOCK_SIZE * 9, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      if (this.gameController.isKeyPressed(Keys.KEY_RIGHT)) {
        if(this.mapModel.canGoRight(this.heroModel.mapPos)) {
          this.heroModel.walkRight();
        } else {
          (this.heroModel.pixiObj as PIXI.Sprite).texture.frame = new PIXI.Rectangle(0, BLOCK_SIZE * 11, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      if (this.gameController.isKeyPressed(Keys.KEY_UP)) {
        if(this.mapModel.canGoUp(this.heroModel.mapPos)) {
          this.heroModel.walkUp();
        } else {
          (this.heroModel.pixiObj as PIXI.Sprite).texture.frame = new PIXI.Rectangle(0, BLOCK_SIZE * 8, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      if (this.gameController.isKeyPressed(Keys.KEY_DOWN)) {
        if(this.mapModel.canGoDown(this.heroModel.mapPos)) {
          this.heroModel.walkDown();
        } else {
          (this.heroModel.pixiObj as PIXI.Sprite).texture.frame = new PIXI.Rectangle(0, BLOCK_SIZE * 10, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      if (this.mapModel.isItemTile(this.heroModel.mapPos)) {
        this.gameController.gameModel.itemManager.collectItem(this.heroModel.mapPos);
      }

      if(this.mapModel.isTreasureTile(this.heroModel.mapPos)) {
        this.gameController.gameModel.initVictory();
        return;
      }

      // still standing -> check NPC proximity
      if(this.heroModel.state === HeroState.STANDING) {
        if(this.lastNPCInterractionCell && this.lastNPCInterractionCell.equals(this.heroModel.mapPos)) {
          return;
        }
        let dirOffset = Math.floor((this.heroModel.pixiObj as PIXI.Sprite).texture.frame.y / BLOCK_SIZE);
        if(dirOffset === 8 && this.mapModel.isNPCTile(new Vec(this.heroModel.mapPos.x, this.heroModel.mapPos.y - 1))) {
          // direction up
          this.lastNPCInterractionCell = this.heroModel.mapPos.clone();
          this.gameController.gameModel.interractWithNpc(new Vec(this.heroModel.mapPos.x, this.heroModel.mapPos.y - 1));
        }
        if(dirOffset === 9 && this.mapModel.isNPCTile(new Vec(this.heroModel.mapPos.x - 1, this.heroModel.mapPos.y))) {
          // direction left
          this.lastNPCInterractionCell = this.heroModel.mapPos.clone();
          this.gameController.gameModel.interractWithNpc(new Vec(this.heroModel.mapPos.x - 1, this.heroModel.mapPos.y));
        }
        if(dirOffset === 10 && this.mapModel.isNPCTile(new Vec(this.heroModel.mapPos.x, this.heroModel.mapPos.y + 1))) {
          // direction down
          this.lastNPCInterractionCell = this.heroModel.mapPos.clone();
          this.gameController.gameModel.interractWithNpc(new Vec(this.heroModel.mapPos.x, this.heroModel.mapPos.y + 1));
        }
        if(dirOffset === 11 && this.mapModel.isNPCTile(new Vec(this.heroModel.mapPos.x + 1, this.heroModel.mapPos.y))) {
          // direction right
          this.lastNPCInterractionCell = this.heroModel.mapPos.clone();
          this.gameController.gameModel.interractWithNpc(new Vec(this.heroModel.mapPos.x + 1, this.heroModel.mapPos.y));
        }
      }
    }
  }
}