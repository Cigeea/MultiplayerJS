import * as ex from 'excalibur';
import { SCALE_2x, DIRECTION, ANCHOR_CENTER, DOWN, WALK, POSE } from '../../constants';
import { DirectionQueue } from '../../classes/DirectionQueue';
import { DrawShapeHelper } from '../../classes/DrawShapeHelper';
import { generateCharacterAnimations } from "../../character-animations.js";
import { PlayerAnimations } from './PlayerAnimation.js';
import { PlayerActions } from './PlayerActions.js';
import { SpriteSequence } from '../../classes/SpriteSequence.js';

const ACTION_1_KEY = ex.Keys.Space;
const ACTION_2_KEY = ex.Keys.X;

export class Player extends ex.Actor {
    engine: ex.Engine;
    directionQueue: DirectionQueue;
    facing: DIRECTION;
    skinAnims: Record<DIRECTION, Record<POSE, ex.Animation>>;
    playerAnimations: PlayerAnimations;
    playerActions: PlayerActions;
    actionAnimation: SpriteSequence | null;
    skinId: "RED" | "GRAY" | "BLUE" | "YELLOW";

    constructor(x: number, y: number, engine: ex.Engine, skinId: "RED" | "GRAY" | "BLUE" | "YELLOW") {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 6)),
            collisionType: ex.CollisionType.Active,
            color: ex.Color.Blue
        });
        this.engine = engine;
        this.directionQueue = new DirectionQueue();
        this.facing = 'DOWN';
        this.skinId = skinId;
        this.skinAnims = generateCharacterAnimations(skinId);
        this.graphics.use(this.skinAnims[DOWN][WALK]);
        this.playerAnimations = new PlayerAnimations(this);
        this.playerActions = new PlayerActions(this);
        this.actionAnimation = null;
    }

    onInitialize(_engine: ex.Engine): void {
        // new DrawShapeHelper(this);
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        this.directionQueue.update(engine);

        //Work on dedicated animation if we are doing one
        this.playerAnimations.progressThroughActionAnimation(delta);

        if (!this.actionAnimation) {
            this.onPreUpdateMovementKeys(engine, delta);
            this.onPreUpdateActionKeys(engine);
        }

        //Show right frames
        this.playerAnimations.showRelevantAnim();
    }

    onPreUpdateMovementKeys(engine: ex.Engine, delta: number) {
        const keyboard = engine.input.keyboard;
        const WALKING_SPEED = 160;

        this.vel.x = 0;
        this.vel.y = 0;
        if (keyboard.isHeld(ex.Keys.Left)) {
            this.vel.x = -1;
        }
        if (keyboard.isHeld(ex.Keys.Right)) {
            this.vel.x = 1;
        }
        if (keyboard.isHeld(ex.Keys.Up)) {
            this.vel.y = -1;
        }
        if (keyboard.isHeld(ex.Keys.Down)) {
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

    onPreUpdateActionKeys(engine: ex.Engine) {
        //Register action keys
        if (engine.input.keyboard.wasPressed(ACTION_1_KEY)) {
            this.playerActions.actionSwingSword();
            return;
        }
        if (engine.input.keyboard.wasPressed(ACTION_2_KEY)) {
            this.playerActions.actionShootArrow();
            return;
        }
        [
            { key: ex.Keys.Digit1, skinId: "RED" },
            { key: ex.Keys.Digit2, skinId: "GRAY" },
            { key: ex.Keys.Digit3, skinId: "BLUE" },
            { key: ex.Keys.Digit4, skinId: "YELLOW" }
        ].forEach(({ key, skinId }) => {
            if (engine.input.keyboard.wasPressed(key)) {
                this.skinId = skinId;
                this.skinAnims = generateCharacterAnimations(skinId);
            }
        })
        return;
    }
}