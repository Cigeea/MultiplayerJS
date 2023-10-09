import * as ex from "excalibur";
import { Images } from "../resources.ts";
import { DIRECTION, DOWN, LEFT, POSE, RIGHT, SCALE, SCALE_2x, TAG_PLAYER_WEAPON, UP } from "../constants.ts";
import { DrawShapeHelper } from "../classes/DrawShapeHelper.ts";

const swordSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Images.swordSheetImage,
    grid: {
        columns: 3,
        rows: 4,
        spriteWidth: 32,
        spriteHeight: 32
    }
})

export const SWORD_SWING_1 = "SWORD_SWING_1";
export const SWORD_SWING_2 = "SWORD_SWING_2";
export const SWORD_SWING_3 = "SWORD_SWING_3";

type SWORD_SWING_TYPE = "SWORD_SWING_1" | "SWORD_SWING_2" | "SWORD_SWING_3";

export class Sword extends ex.Actor {
    direction: DIRECTION;
    isUsed: boolean;
    owner: unknown;
    frames: Partial<Record<DIRECTION, Record<SWORD_SWING_TYPE, ex.Animation>>> = {};
    constructor(x: number, y: number, direction: DIRECTION) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(16, 16, ex.Vector.Zero, new ex.Vector(-8, -8)),
            // collider: ex.Shape.Box(16, 16, ex.Vector.Zero, new ex.Vector(0, 0)),
            collisionType: ex.CollisionType.Passive,
        });
        this.direction = direction;
        this.isUsed = false;  //Has it hit anything
        this.owner = null; // Assigned on creation
        this.addTag(TAG_PLAYER_WEAPON)

        this.frames = {
            [DOWN]: {
                [SWORD_SWING_1]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [0],
                    100
                ),
                [SWORD_SWING_2]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [1],
                    100
                ),
                [SWORD_SWING_3]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [2],
                    100
                ),
            },
            [UP]: {
                [SWORD_SWING_1]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [3],
                    100
                ),
                [SWORD_SWING_2]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [4],
                    100
                ),
                [SWORD_SWING_3]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [5],
                    100
                ),
            },
            [LEFT]: {
                [SWORD_SWING_1]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [6],
                    100
                ),
                [SWORD_SWING_2]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [7],
                    100
                ),
                [SWORD_SWING_3]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [8],
                    100
                ),
            },
            [RIGHT]: {
                [SWORD_SWING_1]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [9],
                    100
                ),
                [SWORD_SWING_2]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [10],
                    100
                ),
                [SWORD_SWING_3]: ex.Animation.fromSpriteSheet(
                    swordSpriteSheet,
                    [11],
                    100
                ),
            },
        };
        this.graphics.use(this.frames![this.direction]![SWORD_SWING_1]);

        //Nudge in initial direction to line up with Player sprite
        if (direction === DOWN) {
            this.pos.x -= 5 * SCALE;
            this.pos.y += 15 * SCALE;
            this.collider.set(ex.Shape.Box(24, 18, ex.Vector.Zero, new ex.Vector(-10, -2)));
        }
        if (direction === UP) {
            this.pos.x += 5 * SCALE;
            this.pos.y -= 6 * SCALE;
            this.collider.set(ex.Shape.Box(24, 18, ex.Vector.Zero, new ex.Vector(-10, -16)));
        }
        if (direction === LEFT) {
            this.pos.x -= 8 * SCALE;
            this.pos.y += 1 * SCALE;
            this.collider.set(ex.Shape.Box(18, 24, ex.Vector.Zero, new ex.Vector(-16, -10)));
        }
        if (direction === RIGHT) {
            this.pos.x += 8 * SCALE;
            this.pos.y += 1 * SCALE;
            this.collider.set(ex.Shape.Box(18, 24, ex.Vector.Zero, new ex.Vector(-2, -10)));
        }

    }

    onDamagedSomething() {
        this.isUsed = true;
    }

    useFrame(key: SWORD_SWING_TYPE, direction: DIRECTION) {
        this.graphics.use(this.frames![direction]![key]);
    }

    onInitialize(_engine: ex.Engine): void {
        new DrawShapeHelper(this, ex.Color.Red);
    }
}