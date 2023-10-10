import * as ex from "excalibur";

//Directions de déplacement possibles 
export const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
//Actions que peut faire le joueur
export const actions = ['SWORDACTION', 'ARROWACTION'] as const;
//Etat dans lequel le joueur peut être (animations à l'écran)
export const poses = ['WALK', 'SWORD1', 'SWORD2', 'PAIN'] as const;

export type ACTION = typeof actions[number];
export type DIRECTION = typeof directions[number];
export type POSE = typeof poses[number];

export function getAssociatedKey(dir: DIRECTION): ex.Keys {
    switch (dir) {
        case "UP": return ex.Keys.W;
        case "DOWN": return ex.Keys.S;
        case "LEFT": return ex.Keys.A;
        case "RIGHT": return ex.Keys.D;
    }
}

export function getAssociatedUnitaryVector(dir: DIRECTION): ex.Vector {
    switch (dir) {
        case "UP": return new ex.Vector(0, -1);
        case "DOWN": return new ex.Vector(0, 1);;
        case "LEFT": return new ex.Vector(-1, 0);;
        case "RIGHT": return new ex.Vector(1, 0);;
    }
}