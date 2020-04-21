import { TriggerCondition, TriggerDirection } from '../constants';

export interface RawMapsData {
    name: string;
    tileset: string;
    playerPos: [number, number];
    npcs: {
        name: string;
        position: [number, number];
        behavior: string;
        trigger: string;
    }[];
    staticTriggers: {
        name: string;
        position?: [number, number];
        condition?: TriggerCondition;
        direction?: TriggerDirection;
        props?: any;
    }[];
}