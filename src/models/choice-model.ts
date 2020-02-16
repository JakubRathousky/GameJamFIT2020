import { GameObjectModel } from './game-object-model';
import GameModel from './game-model';
import * as PIXI from 'pixi.js';
import { Assets, DIALOG_SIZE, FONT_SIZE, FONT_DIALOG_OFFSET_X, FONT_DIALOG_OFFSET_Y } from '../constants';
import * as helpers from '../utils/helpers';

export class ChoiceModel extends GameObjectModel {
  choiceYes: PIXI.Text;
  choiceNo: PIXI.Text;
  currentChoiceYes: boolean = true;

  constructor(gameModel: GameModel) {
    super(gameModel);
  }

  init() {
    let texture = PIXI.Texture.from(Assets.DIALOG);
    texture = texture.clone();
    let sprite = new PIXI.NineSlicePlane(texture, 60, 60, 60, 60);
    sprite.position.set(this.gameModel.screenWidth / 2, this.gameModel.screenHeight/2);
    sprite.pivot.y = DIALOG_SIZE * 2;
    sprite.pivot.x = 0;
    this.gameModel.stage.addChild(sprite);
    this.pixiObj = sprite;
    sprite.width = this.gameModel.screenWidth / 2;
    sprite.height = DIALOG_SIZE * 2;

    this.choiceYes = new PIXI.Text('ANO', new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 100 , align: 'left' }));
    this.choiceYes.position.set(DIALOG_SIZE, 100);
    sprite.addChild(this.choiceYes);

    this.choiceNo = new PIXI.Text('NE', new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 100 , align: 'left' }));
    this.choiceNo.position.set(sprite.width - DIALOG_SIZE - 120, 100);
    sprite.addChild(this.choiceNo);
  }

  showChoice() {
    this.currentChoiceYes = true;
    this.pixiObj.visible = true;
  }

  selectChoice(yes: boolean) {
    this.currentChoiceYes = yes;
  }

  destroy() {

  }

  hide() {
    this.pixiObj.visible = false;
  }

  get isHidden() {
    return !this.pixiObj.visible;
  }

  updateCounter = 0;

  update(delta: number, absolute: number) {
    if(this.currentChoiceYes) {
      this.choiceNo.visible = true;
    } else {
      this.choiceYes.visible = true;
    }

    if(!this.isHidden && (this.updateCounter++) % 5 === 0) {
      if(this.currentChoiceYes) {
        this.choiceYes.visible = !this.choiceYes.visible;
      } else {
        this.choiceNo.visible = !this.choiceNo.visible;
      }
    }
  }
}