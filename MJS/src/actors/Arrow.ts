import * as ex from "excalibur";
import { Images } from "../resources";
import { DIRECTION, DOWN, LEFT, RIGHT, SCALE, SCALE_2x, TAG_PLAYER_WEAPON, UP } from "../constants";
import { Player } from "./Players/Player";

const arrowSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Images.arrowSheetImage,
    grid: {
        columns: 1,
        rows: 4,
        spriteHeight: 16,
        spriteWidth: 16,
    },
});

const arrowDownAnim = ex.Animation.fromSpriteSheet(arrowSpriteSheet, [0], 100);
const arrowUpAnim = ex.Animation.fromSpriteSheet(arrowSpriteSheet, [1], 100);
const arrowLeftAnim = ex.Animation.fromSpriteSheet(arrowSpriteSheet, [2], 100);
const arrowRightAnim = ex.Animation.fromSpriteSheet(arrowSpriteSheet, [3], 100);

export class Arrow extends ex.Actor {
    owner: Player;
    msRemaining: number;
    constructor(x: number, y: number, direction: DIRECTION, creator: Player) {
        super({
            pos: new ex.Vector(x, y),
            width: 16,
            height: 16,
            scale: SCALE_2x
        })
        this.addTag(TAG_PLAYER_WEAPON);
        this.owner = creator;
        this.msRemaining = 2000;

        const ARROW_VELOCITY = 300;
        if (direction === DOWN) {
            this.graphics.use(arrowDownAnim);
            this.vel.y = ARROW_VELOCITY;
            this.pos.y += SCALE * 4;
        }
        if (direction === UP) {
            this.graphics.use(arrowUpAnim);
            this.vel.y = -ARROW_VELOCITY;
        }
        if (direction === LEFT) {
            this.graphics.use(arrowLeftAnim);
            this.vel.x = -ARROW_VELOCITY;
            this.pos.y += SCALE * 4;
        }
        if (direction === RIGHT) {
            this.graphics.use(arrowRightAnim);
            this.vel.x = ARROW_VELOCITY;
            this.pos.y += SCALE * 4;
        }
    }

    onDamageSomething() {
        this.kill();
    }

    onPreUpdate(_engine: ex.Engine, _delta: number): void {
        this.msRemaining -= _delta;
        if (this.msRemaining < 0) {
            this.kill();
        }
    }

}