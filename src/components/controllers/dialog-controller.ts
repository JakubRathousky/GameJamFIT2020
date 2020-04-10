import { BaseComponent } from '../base-component';
import { KeyInputComponent, Keys } from '../../../libs/pixi-component/components/key-input-component';
import * as ECSA from '../../../libs/pixi-component';
import { GenericComponent } from '../../../libs/pixi-component/components/generic-component';
import { Font } from '../../entities/functional/font';
import { Items } from '../../entities/constants';

export enum DialogState {
    ANIMATING,
    WAITING_FOR_INPUT,
    FINISHED
}

const dialogHeight = 42;
const dialogTextMargin = 8;
const letterSpacing = 0;
const maxRowsVisible = 2;

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
    }

    init() {
        this.wrappedText = this.wrapText(this.props.originalText, this.props.dialogWidth, this.props.letterSpacing);
        this.splitText = this.wrappedText.split('\n');
        this.rowsNum = this.splitText.length;
        this.currentRow = 0;
        this._displayedText = '';
        this.calcVisibleText();
    }

    animateVisibleText(speed: number) {
        this._displayedText = this.visibleText.substr(0, Math.min(this._displayedText.length + speed, this.visibleText.length));
    }

    isFullyVisible() {
        return this.displayedText.length === this.visibleText.length;
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

    get displayedText() {
        return this._displayedText;
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
}

export class DialogController extends BaseComponent<DialogControllerProps> {

    font: Font;
    fontTexture: PIXI.Texture;
    hintTexture: PIXI.Texture;
    dialogWidth: number;

    state: DialogState;
    model: DialogModel;
    dialog: PIXI.Container;

    keyInputCmp: KeyInputComponent;

    onInit() {
        super.onInit();
        const { text, fontName } = this.props;
        this.dialogWidth = this.scene.width;
        this.font = this.resourceStorage.getFont(fontName);

        this.fontTexture = new PIXI.Texture(this.resourceStorage.getFontTexture(this.font.name));
        this.hintTexture = this.resourceStorage.createItemTexture(Items.DIALOG_HINT);

        this.dialog = new ECSA.NineSlicePlane('dialog_plane', this.resourceStorage.createItemTexture(Items.DIALOG_FRAME), 18, 10, 18, 10);
        this.dialog.width = this.scene.width;
        this.dialog.height = dialogHeight;
        this.dialog.position.y = this.scene.height - dialogHeight - 5;
        this.scene.stage.addChild(this.dialog);
        this.keyInputCmp = this.scene.findGlobalComponentByName(KeyInputComponent.name);
        this.state = DialogState.ANIMATING;

        this.model = new DialogModel({ font: this.font, originalText: text, dialogWidth: (this.dialogWidth - 2 * dialogTextMargin), letterSpacing, maxRowsVisible });
        this.model.init();
    }

    showMore() {
        if (this.model.canShowNewLines()) {
            this.model.showNewLines();
            this.state = DialogState.ANIMATING;
        } else {
            this.state = DialogState.FINISHED;
            this.dialog.destroy();
            this.finish();
        }
    }

    onUpdate() {
        if (this.state === DialogState.WAITING_FOR_INPUT && this.keyInputCmp.isKeyPressed(Keys.KEY_SPACE)) {
            this.keyInputCmp.handleKey(Keys.KEY_SPACE);
            this.showMore();
        }

        if (this.state === DialogState.ANIMATING) {
            if (this.keyInputCmp.isHandledKeyPressed(Keys.KEY_SPACE)) {
                this.keyInputCmp.handleKey(Keys.KEY_SPACE);
                this.model.animateVisibleText(2);
            } else {
                this.model.animateVisibleText(1);
            }

            this.displayText();

            if (this.model.isFullyVisible()) {
                this.state = DialogState.WAITING_FOR_INPUT;
            }
        }
    }

    private displayText() {
        this.dialog.removeChildren();
        let rowCounter = 0;
        let offsetX = 0;

        for (let char of this.model.displayedText) {
            if (char === '\n') {
                offsetX = 0;
                rowCounter++;
                continue;
            }

            const letter = this.font.getChar(char);
            const txt = this.fontTexture.clone();
            const spr = new PIXI.Sprite(txt);
            spr.position.x = dialogTextMargin + offsetX + letter.offsetX;
            spr.position.y = dialogTextMargin + rowCounter * (this.font.charDefaultHeight + 1) + letter.offsetY;

            txt.frame = this.font.getCharRectangle(char);
            this.dialog.addChild(spr);

            offsetX += (letter.width + letterSpacing);
        }

        if (this.model.isFullyVisible() && this.model.canShowNewLines()) {
            // display animated hint
            this.displayDialogHint(offsetX, rowCounter);
        }
    }

    private displayDialogHint(offsetX: number, row: number) {
        const spr = new ECSA.Sprite('hint', this.hintTexture);
        spr.texture.frame = new PIXI.Rectangle(0, 0, 7, 7);
        spr.position.x = dialogTextMargin + offsetX;
        spr.position.y = dialogTextMargin + row * (this.font.charDefaultHeight + 1);
        this.dialog.addChild(spr);

        const initPos = spr.position.y;
        spr.addComponent(new GenericComponent('animator').setFixedFrequency(10).doOnFixedUpdate(() => {
            spr.position.y = initPos + (spr.position.y - initPos + 1) % 5;
        }));
    }
}