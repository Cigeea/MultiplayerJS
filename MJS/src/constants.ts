import * as ex from "excalibur";

export const VIEWPORT_WIDTH = 160 + 48;
export const VIEWPORT_HEIGHT = 144 + 48;

// export const VIEWPORT_WIDTH = 400;
// export const VIEWPORT_HEIGHT = 300;

export const SCALE = 2;
export const SCALE_2x = new ex.Vector(2, 2);

export const ANCHOR_CENTER = new ex.Vector(0.5, 0.5);
export const ANCHOR_TOP_LEFT = new ex.Vector(0, 0);

export type DIRECTION = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
export const LEFT: DIRECTION = "LEFT";
export const RIGHT: DIRECTION = "RIGHT";
export const UP: DIRECTION = "UP";
export const DOWN: DIRECTION = "DOWN";

export type POSE = "WALK" | "SWORD1" | "SWORD2" | "PAIN";
export const WALK: POSE = "WALK";
export const SWORD1: POSE = "SWORD1";
export const SWORD2: POSE = "SWORD2";
export const PAIN: POSE = "PAIN";

export const SWORDACTION = "SWORDACTION";
export const ARROWACTION = "ARROWACTION";

export const EVENT_SEND_PLAYER_UPDATE = "EVENT_SEND_PLAYER_UPDATE";
export const EVENT_SEND_MONSTER_UPDATE = "EVENT_SEND_MONSTER_UPDATE";
export const EVENT_INITIAL_DATA_REQUESTED = "EVENT_INITIAL_DATA_REQUESTED";

export const EVENT_NETWORK_PLAYER_UPDATE = "EVENT_NETWORK_PLAYER_UPDATE";
export const EVENT_NETWORK_PLAYER_LEAVE = "EVENT_NETWORK_PLAYER_LEAVE";

export const EVENT_NETWORK_MONSTER_UPDATE = "EVENT_NETWORK_MONSTER_UPDATE";

export const TAG_ANY_PLAYER = "TAG_ANY_PLAYER";
export const TAG_PLAYER_WEAPON = "TAG_PLAYER_WEAPON";
export const TAG_DAMAGES_PLAYER = "TAG_DAMAGES_PLAYER";
