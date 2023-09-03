import * as ex from 'excalibur';
import { SCALE_2x, DIRECTION, ANCHOR_CENTER } from '../../constants';
import { DirectionQueue } from '../../classes/DirectionQueue';
import { DrawShapeHelper } from '../../classes/DrawShapeHelper';

export class Player extends ex.Actor {
    directionQueue: DirectionQueue;
    facing: DIRECTION;

    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 0)),
            collisionType: ex.CollisionType.Active,
            color: ex.Color.Blue
        });
        this.directionQueue = new DirectionQueue();
        this.facing = 'DOWN';
    }

    onInitialize(_engine: ex.Engine): void {
        new DrawShapeHelper(this);
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        console.log("UPDATE")
        this.directionQueue.update(engine);

        this.onPreUpdateMovementKeys(engine, delta);
    }

    onPreUpdateMovementKeys(engine: ex.Engine, delta: number) {
        const keyboard = engine.input.keyboard;
        const WALKING_SPEED = 160;

        this.vel.x = 0;
        this.vel.y = 0;
        if (keyboard.isHeld(ex.Input.Keys.Left)) {
            this.vel.x = -1;
        }
        if (keyboard.isHeld(ex.Input.Keys.Right)) {
            this.vel.x = 1;
        }
        if (keyboard.isHeld(ex.Input.Keys.Up)) {
            this.vel.y = -1;
        }
        if (keyboard.isHeld(ex.Input.Keys.Down)) {
            this.vel.y = 1;
        }

        // Normalize walking speed
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            this.vel = this.vel.normalize();
            this.vel.x = this.vel.x * WALKING_SPEED;
            this.vel.y = this.vel.y * WALKING_SPEED;
        }

        this.facing = this.directionQueue.direction ?? this.facing;
    }
}