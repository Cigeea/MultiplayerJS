import { EVENT_SEND_PLAYER_UPDATE, TAG_ANY_PLAYER, TAG_DAMAGES_PLAYER, TAG_PLAYER_WEAPON, WALKING_SPEED } from './../../constants';
import { NetworkUpdater } from './../../classes/NetworkUpdater';
import * as ex from 'excalibur';
import { SCALE_2x, DIRECTION, ANCHOR_CENTER, DOWN, WALK, POSE, LEFT, UP } from '../../constants';
import { DirectionQueue } from '../../classes/DirectionQueue';
import { DrawShapeHelper } from '../../classes/DrawShapeHelper';
import { generateCharacterAnimations } from "../../character-animations.js";
import { PlayerAnimations } from './PlayerAnimation.js';
import { PlayerActions } from './PlayerActions.js';
import { SpriteSequence } from '../../classes/SpriteSequence.js';
import { Sword } from '../Sword.js';
import { directions, getAssociatedKey, getAssociatedUnitaryVector } from '../../keyboard-actions-mapping.js';

const ACTION_1_KEY = ex.Keys.Space;
const ACTION_2_KEY = ex.Keys.X;

export interface painStateType {
    msLeft: number
    painVelX: number
    painVelY: number
}

export class Player extends ex.Actor {
    engine: ex.Engine;
    directionQueue: DirectionQueue;
    facing: DIRECTION;
    skinAnims: Record<DIRECTION, Record<POSE, ex.Animation>>;
    playerAnimations: PlayerAnimations;
    playerActions: PlayerActions | null;
    actionAnimation: SpriteSequence | null;
    walkingMsLeft: number = 0;
    skinId: "RED" | "GRAY" | "BLUE" | "YELLOW";
    isPainFlashing: boolean;
    painState: painStateType | null;
    hasGhostPainState: boolean = false;
    networkUpdater: NetworkUpdater;

    constructor(x: number, y: number, engine: ex.Engine, skinId: "RED" | "GRAY" | "BLUE" | "YELLOW") {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 6)),
            // collider: ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 0)),
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
        this.actionAnimation = null;
        this.isPainFlashing = false;
        this.painState = null;
        this.networkUpdater = new NetworkUpdater(engine, EVENT_SEND_PLAYER_UPDATE);
        this.addTag(TAG_ANY_PLAYER);
        this.on("collisionstart", (evt) => this.onCollisionStart(evt));
    }

    onInitialize(_engine: ex.Engine): void {
        // new DrawShapeHelper(this);
        this.playerActions = new PlayerActions(this);
    }

    onCollisionStart(evt: ex.CollisionStartEvent<ex.Actor>): void {
        // Take damage from other Player's weapons
        if (evt.other.hasTag(TAG_PLAYER_WEAPON)) {
            const sword = evt.other as Sword;
            if (sword.owner !== this) {
                this.takeDamage();
                sword.onDamagedSomething();
            }
        }

        // Take damage from external things (Enemies, etc)
        if (evt.other.hasTag(TAG_DAMAGES_PLAYER)) {
            this.takeDamage();
        }
    }

    createNetworkUpdateString() {
        const actionType = this.actionAnimation?.type ?? "NULL";
        const isInPain = Boolean(this.painState);
        const x = Math.round(this.pos.x);
        const y = Math.round(this.pos.y);
        return `${actionType}|${x}|${y}|${this.vel.x}|${this.vel.y}|${this.skinId}|${this.facing}|${isInPain}|${this.isPainFlashing}`;
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        this.directionQueue.update(engine);

        //Work on dedicated animation if we are doing one
        this.playerAnimations.progressThroughActionAnimation(delta);

        if (!this.actionAnimation) {
            this.onPreUpdateMovement(engine, delta);
            this.onPreUpdateActionKeys(engine);
        }

        //Show right frames
        this.playerAnimations.showRelevantAnim();

        //Update everybody else
        const networkUpdateStr = this.createNetworkUpdateString();
        this.networkUpdater.sendStateUpdate(networkUpdateStr);
    }

    onPreUpdateMovement(engine: ex.Engine, delta: number) {
        const keyboard = engine.input.keyboard;

        //Handle Pain State
        if (this.painState) {
            this.vel.x = this.painState.painVelX;
            this.vel.y = this.painState.painVelY;

            //Work on getting rid of the pain
            this.painState.msLeft -= delta;
            if (this.painState.msLeft <= 0) {
                this.painState = null;
            }
            return;
        }

        //Handle walking speed
        this.vel.setTo(0, 0);
        directions.forEach(dir => {
            if (keyboard.isHeld(getAssociatedKey(dir))) {
                this.vel = this.vel.add(getAssociatedUnitaryVector(dir))
            }
        })

        // Normalize walking speed
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            this.vel = this.vel.normalize();
            this.vel.scale(WALKING_SPEED, this.vel)
        }

        this.facing = this.directionQueue.direction ?? this.facing;
    }

    onPreUpdateActionKeys(engine: ex.Engine) {
        //Register action keys
        if (engine.input.keyboard.wasPressed(ACTION_1_KEY)) {
            this.playerActions?.actionSwingSword();
            return;
        }
        if (engine.input.keyboard.wasPressed(ACTION_2_KEY)) {
            this.playerActions?.actionShootArrow();
            return;
        }
        if (engine.input.keyboard.wasPressed(ex.Keys.Q)) {
            //Use this key to debug whatever you feel like
        }
        [
            { key: ex.Keys.Digit1, skinId: "RED" },
            { key: ex.Keys.Digit2, skinId: "GRAY" },
            { key: ex.Keys.Digit3, skinId: "BLUE" },
            { key: ex.Keys.Digit4, skinId: "YELLOW" }
        ].forEach(({ key, skinId }) => {
            if (engine.input.keyboard.wasPressed(key)) {
                this.skinId = skinId as "RED" | "GRAY" | "BLUE" | "YELLOW";
                this.skinAnims = generateCharacterAnimations(skinId);
            }
        })
        return;
    }
    takeDamage() {
        //No pain if already in pain
        if (this.isPainFlashing) {
            return;
        }

        //Start new pain moment
        const PAIN_VELOCITY = 150;
        this.painState = {
            msLeft: 220,
            painVelX: this.facing === LEFT ? PAIN_VELOCITY : -PAIN_VELOCITY,
            painVelY: this.facing === UP ? PAIN_VELOCITY : -PAIN_VELOCITY
        }

        //Flash for a little bit
        this.playerActions?.flashSeries();
    }

}