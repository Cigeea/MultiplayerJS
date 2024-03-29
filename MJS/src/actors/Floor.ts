import * as ex from "excalibur";
import { ANCHOR_TOP_LEFT, SCALE, SCALE_2x } from "../constants";

export class Floor extends ex.Actor {
    constructor(x: number, y: number, cols: number, rows: number) {
        const SIZE = 16;            //size in pixels

        super({
            width: SIZE * cols,
            height: SIZE * rows,
            pos: new ex.Vector(x * SIZE * SCALE, y * SIZE * SCALE),
            scale: SCALE_2x,
            anchor: ANCHOR_TOP_LEFT,
            collider: ex.Shape.Box(SIZE * cols, SIZE * rows, ex.Vector.Zero),
            collisionType: ex.CollisionType.Fixed,
            // color: ex.Color.Red,
        });

        this.graphics.opacity = 0.7;
    }
}