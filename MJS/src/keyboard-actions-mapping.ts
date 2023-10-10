import { PlayerActions } from './actors/Players/PlayerActions';
import * as ex from 'excalibur';

//Directions de déplacement possibles 
export const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
//Actions que peut faire le joueur
export const actions = ['SWORDACTION', 'ARROWACTION'] as const;
//Etat dans lequel le joueur peut être (animations à l'écran)
export const poses = ['WALK', 'SWORD1', 'SWORD2', 'PAIN'] as const;
//Liste des skins possibles
export const skins = ['RED', 'GRAY', 'BLUE', 'YELLOW'] as const;

export type ACTION = typeof actions[number];
export type DIRECTION = typeof directions[number];
export type POSE = typeof poses[number];
export type SKIN = typeof skins[number];

export function getAssociatedKey(command: DIRECTION | SKIN | ACTION): ex.Keys {
    switch (command) {
        case 'UP': return ex.Keys.W;
        case 'DOWN': return ex.Keys.S;
        case 'LEFT': return ex.Keys.A;
        case 'RIGHT': return ex.Keys.D;
        case 'RED': return ex.Keys.Digit1;
        case 'GRAY': return ex.Keys.Digit2;
        case 'BLUE': return ex.Keys.Digit3;
        case 'YELLOW': return ex.Keys.Digit4;
        case 'SWORDACTION': return ex.Keys.Space;
        case 'ARROWACTION': return ex.Keys.E;
    }
}

export function getAssociatedUnitaryVector(dir: DIRECTION): ex.Vector {
    switch (dir) {
        case 'UP': return new ex.Vector(0, -1);
        case 'DOWN': return new ex.Vector(0, 1);;
        case 'LEFT': return new ex.Vector(-1, 0);;
        case 'RIGHT': return new ex.Vector(1, 0);;
    }
}

export function executeAssociatedAction(act: ACTION, pa: PlayerActions): void {
    switch (act) {
        case 'SWORDACTION': pa.actionSwingSword();
            break;
        case 'ARROWACTION': pa.actionShootArrow();
            break;
    }
}

