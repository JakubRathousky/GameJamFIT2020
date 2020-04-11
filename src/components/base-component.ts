
import * as ECSA from '../../libs/pixi-component';
import { Attributes } from '../entities/constants';
import { ResourceStorage } from '../services/resource-storage';

/**
 * Base component that will fetch all important global attributes and services
 */
export class BaseComponent<T> extends ECSA.Component<T> {

    protected resourceStorage: ResourceStorage;

    onInit() {
        this.resourceStorage = this.scene.getGlobalAttribute<ResourceStorage>(Attributes.RESOURCES);
    }
}