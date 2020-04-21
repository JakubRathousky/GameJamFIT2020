import { MapNames } from '../constants';

export interface SceneSwitchMessage {
    previousScene: MapNames;
    nextScene: MapNames;
}