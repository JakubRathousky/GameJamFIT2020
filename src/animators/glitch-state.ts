import * as PIXI from 'pixi.js';
import { GlitchFilter } from '@pixi/filter-glitch';

class GlitchState {
    public isActive = false;

    switch(): PIXI.Filter {

        let glitchOptions = {
            slices:  3,
            offset: 50,
            direction: -50,
            fillMode: 3,
            seed: 1,
            red: new PIXI.Point(20, 30),
            green: new PIXI.Point(20, 30),
            blue: new PIXI.Point(-10, -10),
            average: false,
            minSize: 30,
            sampleSize: 30
        };
        let glitch = new GlitchFilter(glitchOptions);
        return glitch;
    }
}

export default GlitchState;