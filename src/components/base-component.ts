
import * as ECSA from '../../libs/pixi-component';
import { Attributes } from '../entities/constants';
import { ResourceStorage } from '../services/resource-storage';

export class BaseComponent<T> extends ECSA.Component<T> {

    protected resourceStorage: ResourceStorage;

    onInit() {
        this.resourceStorage = this.scene.getGlobalAttribute<ResourceStorage>(Attributes.RESOURCES);
    }
}