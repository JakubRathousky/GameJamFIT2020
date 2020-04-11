import * as ECSA from '../../libs/pixi-component';

export const sceneFadeAction = (scene: ECSA.Scene, fadeIn: boolean = true) => {
    // handle fading animation
    const cmp = new ECSA.ChainComponent()
        .execute(() => scene.stage.alpha = fadeIn ? 0 : 1)
        .beginWhile(() => cmp.scene.stage.alpha !== (fadeIn ? 1 : 0))
        .execute(() => cmp.scene.stage.alpha = fadeIn ? Math.min(cmp.scene.stage.alpha + 0.2, 1) : Math.max(cmp.scene.stage.alpha - 0.2, 0))
        .waitFrames(2)
        .endWhile();

    scene.stage.addComponentAndRun(cmp);
    return cmp;
};