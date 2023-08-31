import * as ex from 'excalibur';
import { SCALE_2x } from '../../constants';

export class Player extends ex.Actor {
    constructor(x, y, skinId) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, Player, new ex.Vector(0, 6)),
            collisionType: ex.CollisionType.Active,
            color: ex.Color.Blue
        })
    }
}