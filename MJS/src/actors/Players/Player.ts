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
    engine: ex.Engine | null;
    directionQueue: DirectionQueue;
    facing: DIRECTION;
    // skinAnims: { [direction: string]: { [posture: string]: ex.Animation } };
    // skinAnims: { [direction in DIRECTION]: { [posture in POSE]: ex.Animation } };
    // skinAnims: Partial<{ [direction in DIRECTION]: Partial<{ [posture in POSE]: ex.Animation }> }>
    skinAnims: Partial<Record<DIRECTION, Partial<Record<POSE, ex.Animation>>>> = {};
    playerAnimations: PlayerAnimations;
    playerActions: PlayerActions;
    actionAnimation: SpriteSequence | null;

    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 6)),
            collisionType: ex.CollisionType.Active,
            color: ex.Color.Blue
        });
        this.engine = null;
        this.directionQueue = new DirectionQueue();
        this.facing = 'DOWN';
        this.skinAnims = generateCharacterAnimations("RED");
        this.graphics.use(this.skinAnims![DOWN]![WALK]!);                   //FUCKING BS ! 
        this.playerAnimations = new PlayerAnimations(this);
        this.playerActions = new PlayerActions(this);
        this.actionAnimation = null;
        // this.actionAnimation = new SpriteSequence('', [], () => {

        // });

    }

    onInitialize(_engine: ex.Engine): void {
        // new DrawShapeHelper(this);
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        console.log("UPDATE")
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
        return;
    }
}