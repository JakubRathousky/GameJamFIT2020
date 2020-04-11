import * as ECSA from '../../libs/pixi-component';
import { Keys } from '../../libs/pixi-component/components/key-input-component';

export const left = new ECSA.Vector(-1, 0);
export const right = new ECSA.Vector(1, 0);
export const up = new ECSA.Vector(0, -1);
export const down = new ECSA.Vector(0, 1);

export enum Attributes {
    RESOURCES = 'RESOURCES',
    GAME_MODEL = 'GAME_MODEL',
}

export enum Assets {
    FONTS_DATA = 'FONTS_DATA',
    GAME_CONFIG_DATA = 'GAME_CONFIG_DATA',
    MAPS_METADATA = 'MAPS_METADATA',
    MAPS_TILES = 'MAPS_TILES',
    SHEETS_DATA = 'SHEETS_DATA',
    SPRITES_DATA = 'SPRITES_DATA',
    TEXTS_DATA = 'TEXTS_DATA',
}

export enum PersonNames {
    PLAYER = 'player',
    DUDE = 'dude',
}

export enum Triggers {
    DOOR = 'door',
    INFO = 'info',
    DUDE = 'DudeTrigger'
}

export enum Items {
    DIALOG_FRAME = 'dialogFrame',
    DIALOG_HINT = 'dialogHint'
}

export enum MapNames {
    TOWN = 'town',
    LAB = 'lab',
    HOUSE_A_FLOOR_1 = 'houseA_1',
    HOUSE_A_FLOOR_2 = 'houseA_2',
    HOUSE_B_FLOOR_1 = 'houseB_1',
    HOUSE_B_FLOOR_2 = 'houseB_2',
}

export enum SceneObjects {
    LAYER_HUD = 'LAYER_HUD',
    LAYER_VIEWPORT = 'LAYER_VIEWPORT',
    PLAYER = 'player',
    MAP = 'map',
    NPCS = 'npcs',
    TRIGGERS = 'triggers'
}

export enum Messages {
    PERSON_STATE_CHANGED = 'PERSON_STATE_CHANGED',
    WALK_STEP_FINISHED = 'WALK_STEP_FINISHED',
    SCENE_SWITCHED = 'SCENE_SWITCHED',
    GAME_STARTED = 'GAME_STARTED',
    DOOR_OPENED = 'DOOR_OPENED',
    DOOR_CLOSED = 'DOOR_CLOSED',
    TALK_STARTED = 'TALK_STARTED',
    TALK_ENDED = 'TALK_ENDED'
}

export enum InputActions {
    ACTION_LEFT = 'action_left',
    ACTION_RIGHT = 'action_right',
    ACTION_UP = 'action_up',
    ACTION_DOWN = 'action_down',
    ACTION_INTERACT = 'action_interact',
    ACTION_OPEN = 'action_open',
}

export const keyboadMapping = {
    [InputActions.ACTION_LEFT] : Keys.KEY_LEFT,
    [InputActions.ACTION_RIGHT] : Keys.KEY_RIGHT,
    [InputActions.ACTION_UP] : Keys.KEY_UP,
    [InputActions.ACTION_DOWN] : Keys.KEY_DOWN,
    [InputActions.ACTION_INTERACT] : Keys.KEY_SPACE,
    [InputActions.ACTION_OPEN] : Keys.KEY_ENTER,
};