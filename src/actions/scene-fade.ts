import * as ECSA from '../../libs/pixi-component';

export const sceneFadeAction = (props: {
    scene: ECSA.Scene;
    fadeIn: boolean;
}): ECSA.ChainComponent => {
    const { scene, fadeIn } = props;

    return new ECSA.ChainComponent('SceneFade')
        .call(() => scene.stage.alpha = fadeIn ? 0 : 1)
        .beginWhile(() => scene.stage.alpha !== (fadeIn ? 1 : 0))
        .call(() => scene.stage.alpha = fadeIn ? Math.min(scene.stage.alpha + 0.2, 1) : Math.max(scene.stage.alpha - 0.2, 0))
        .waitFrames(2)
        .endWhile();
};