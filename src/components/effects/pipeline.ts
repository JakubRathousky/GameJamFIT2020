import * as ECSA from '../../../libs/pixi-component';

export class Pipeline {
    preAction: ECSA.ChainComponent;
    action: ECSA.ChainComponent;
    postAction: ECSA.ChainComponent;
    name: string;

    constructor(name: string) {
        this.name = name;
        this.preAction = new ECSA.ChainComponent(name);
        this.action = new ECSA.ChainComponent(name);
        this.postAction = new ECSA.ChainComponent(name);
    }

    executeUpon(obj: ECSA.Container) {
        obj.addComponentAndRun(new ECSA.ChainComponent(this.name)
            .addComponentAndWait(this.preAction)
            .addComponentAndWait(this.action)
            .addComponentAndWait(this.postAction));
    }
}