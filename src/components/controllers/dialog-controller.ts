import { BaseComponent } from '../base-component';
import { KeyInputComponent } from '../../../libs/pixi-component/components/key-input-component';
import * as ECSA from '../../../libs/pixi-component';
import { GenericComponent } from '../../../libs/pixi-component/components/generic-component';
import { Font } from '../../entities/functional/font';
import { Items, InputActions, keyboadMapping } from '../../entities/constants';
import { RawGameConfig } from '../../entities/parsed/game-config';

export enum DialogState {
    ANIMATING,
    WAITING_FOR_INPUT,
    FINISHED
}


interface DialogModelProps {
    font: Font;
    originalText: string;
    dialogWidth: number;
    letterSpacing: number;
    maxRowsVisible: number;
}

class DialogModel {

    private props: DialogModelProps;
    // divided text so that it will fit
    private wrappedText: string;
    // text split by new lines
    private splitText: string[];

    // text currently visible
    private visibleText: string;
    // text just being displayed by animation
    private _displayedText: string;

    private rowsNum: number;
    private currentRow: number;

    constructor(props: DialogModelProps) {
        this.props = props;
        this.wrappedText = this.wrapText(this.props.originalText, this.props.dialogWidth, this.props.letterSpacing);
        this.splitText = this.wrappedText.split('\n');
        this.rowsNum = this.splitText.length;
        this.currentRow = 0;
        this._displayedText = '';
        this.calcVisibleText();
    }

    get displayedText() {
        return this._displayedText;
    }

    canShowNewLetters() {
        return this.displayedText.length < this.visibleText.length;
    }

    showNewLetters(letterNum: number) {
        if(this.canShowNewLetters()) {
            letterNum = Math.min(letterNum, this.visibleText.length - this._displayedText.length);
            this._displayedText = this.visibleText.substr(0, this._displayedText.length + letterNum);
            return this._displayedText.substring(this._displayedText.length - letterNum);
        }
        return null;
    }

    canShowNewLines() {
        return (this.currentRow + this.props.maxRowsVisible) < this.rowsNum;
    }

    showNewLines() {
        if (this.canShowNewLines()) {
            this.currentRow += this.props.maxRowsVisible;
            this._displayedText = '';
            this.calcVisibleText();
            return true;
        }
        return false;
    }

    calcVisibleText() {
        const visibleRowsNum = Math.max(this.props.maxRowsVisible, (this.currentRow + this.props.maxRowsVisible) - this.splitText.length);
        this.visibleText = this.splitText.slice(this.currentRow, this.currentRow + visibleRowsNum).join('\n');
    }

    wrapText(text: string, maxWidth: number, letterSpacing: number) {
        let output = '';

        const words = text.split(' ');
        const spaceLength = this.props.font.getChar(' ').width;
        let currentLine = '';
        let lineLength = 0;

        // we need to get the width of each letter as it may vary
        for (let word of words) {
            const wordLength = this.props.font.calcWordLength(word, letterSpacing);
            if ((lineLength + wordLength) > maxWidth) {
                // append new line
                output += (output.length === 0 ? currentLine : `\n${currentLine}`);
                currentLine = '';
                lineLength = 0;
            }

            // append new word
            if (currentLine.length === 0) {
                currentLine += word;
            } else {
                currentLine += ' ' + word;
            }
            lineLength += (wordLength + spaceLength + letterSpacing);
        }

        // append last line
        output += (output.length === 0 ? currentLine : `\n${currentLine}`);

        return output;
    }
}

export interface DialogControllerProps {
    text: string;
    fontName: string;
    gameConfig: RawGameConfig;
    isPlayer: boolean;
}

/**
 * Controller that displays a dialog panel and animates the text
 */
export class DialogController extends BaseComponent<DialogControllerProps> {

    private font: Font;
    private fontTexture: PIXI.Texture;
    private hintTexture: PIXI.Texture;

    private state: DialogState;
    private model: DialogModel;
    private dialog: ECSA.Container;
    private keyInputCmp: KeyInputComponent;

    private currentOffsetX = 0;
    private currentRow = 0;


    onInit() {
        super.onInit();
        const { text, fontName } = this.props;
        const { dialogHeight, dialogTextMargin, dialogLetterSpacing } = this.props.gameConfig;

        this.font = this.resourceStorage.getFont(fontName);
        this.fontTexture = new PIXI.Texture(this.resourceStorage.getFontTexture(this.font.name));
        this.hintTexture = this.resourceStorage.createItemTexture(Items.DIALOG_HINT);

        this.dialog = new ECSA.NineSlicePlane('dialog_plane', this.resourceStorage.createItemTexture(this.props.isPlayer ? Items.DIALOG_FRAME_PLAYER : Items.DIALOG_FRAME_NPC), 18, 10, 18, 10);
        this.dialog.width = this.scene.width; // cover the whole scene
        this.dialog.height = dialogHeight;
        this.dialog.position.y = this.scene.height - dialogHeight - 5; // show it 5 pixels from the bottom
        this.scene.stage.addChild(this.dialog);
        this.keyInputCmp = this.scene.findGlobalComponentByName(KeyInputComponent.name);
        this.state = DialogState.ANIMATING;

        const maxRowsVisible = Math.floor((dialogHeight - dialogTextMargin) / this.font.charDefaultHeight);
        this.model = new DialogModel({ font: this.font, originalText: text,
            dialogWidth: (this.scene.width - 2 * dialogTextMargin), letterSpacing: dialogLetterSpacing, maxRowsVisible });
    }

    onUpdate() {
        if (this.state === DialogState.WAITING_FOR_INPUT && this.keyInputCmp.isKeyPressed(keyboadMapping[InputActions.ACTION_INTERACT])) {
            this.keyInputCmp.handleKey(keyboadMapping[InputActions.ACTION_INTERACT]);
            if (this.model.canShowNewLines()) {
                this.displayNewLines();
            } else {
                this.state = DialogState.FINISHED;
                this.dialog.destroy();
                this.finish();
            }
        }

        if (this.state === DialogState.ANIMATING) {
            let newLettersNum = 0;
            if (this.keyInputCmp.isHandledKeyPressed(keyboadMapping[InputActions.ACTION_INTERACT])) {
                this.keyInputCmp.handleKey(keyboadMapping[InputActions.ACTION_INTERACT]);
                newLettersNum =2; // if the key is pressed, animate with a higher speed
            } else {
                newLettersNum = 1; // show 1 new letter each frame
            }

            const newLetters = this.model.showNewLetters(newLettersNum);
            this.displayNewLetters(newLetters);

            if (!this.model.canShowNewLetters()) {
                // wait until the player has pressed a button
                this.state = DialogState.WAITING_FOR_INPUT;
            }
        }
    }

    private displayNewLetters(letters: string) {
        for (let char of letters) {
            if (char === '\n') {
                this.currentOffsetX = 0;
                this.currentRow++;
                continue;
            }

            const letter = this.font.getChar(char);
            const txt = this.fontTexture.clone();
            const spr = new PIXI.Sprite(txt);
            spr.position.x = this.props.gameConfig.dialogTextMargin + this.currentOffsetX + letter.offsetX;
            spr.position.y = this.props.gameConfig.dialogTextMargin + this.currentRow * (this.font.charDefaultHeight + 1) + letter.offsetY;

            txt.frame = this.font.getCharRectangle(char);
            this.dialog.addChild(spr);

            this.currentOffsetX += (letter.width + this.props.gameConfig.dialogLetterSpacing);
        }

        if (!this.model.canShowNewLetters() && this.model.canShowNewLines()) {
            // display animated hint
            this.displayDialogHint();
        }
    }
    private displayNewLines() {
        this.model.showNewLines();
        this.state = DialogState.ANIMATING;
        this.dialog.destroyChildren();
        this.currentOffsetX = 0;
        this.currentRow = 0;
    }

    private displayDialogHint() {
        const spr = new ECSA.Sprite('hint', this.hintTexture.clone());
        spr.position.x = this.props.gameConfig.dialogTextMargin + this.currentOffsetX;
        spr.position.y = this.props.gameConfig.dialogTextMargin + this.currentRow * (this.font.charDefaultHeight + 1);
        this.dialog.addChild(spr);

        const initPos = spr.position.y;
        // add flickering animation
        spr.addComponent(new GenericComponent('animator').setFixedFrequency(10).doOnFixedUpdate(() => {
            spr.position.y = initPos + (spr.position.y - initPos + 1) % 5;
        }));
    }
}