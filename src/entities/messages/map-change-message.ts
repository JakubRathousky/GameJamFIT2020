import { MapNames } from '../constants';

export interface MapChangeMessage {
    sourceMap: MapNames;
    targetMap: MapNames;
}