import * as ex from 'excalibur';
import { SCALE_2x } from '../../constants';
import { DirectionQueue } from '../../classes/DirectionQueue';

export class Player extends ex.Actor {
    directionQueue: DirectionQueue;

    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, new ex.Vector(x, y), new ex.Vector(0, 6)),
            collisionType: ex.CollisionType.Active,
            color: ex.Color.Green
        });

        this.directionQueue = new DirectionQueue();
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        this.directionQueue.update(engine);
        // this.onPreUpdateMovementKeys(engine, delta);
    }
}