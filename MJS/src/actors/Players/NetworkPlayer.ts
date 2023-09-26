import { PlayerActions } from './PlayerActions';
import * as ex from "excalibur";
import { ARROWACTION, DIRECTION, DOWN, POSE, SCALE_2x, SWORDACTION } from "../../constants";
import { generateCharacterAnimations } from "../../character-animations";
import { SpriteSequence } from "../../classes/SpriteSequence";
import { PlayerAnimations } from './PlayerAnimation';
import { painStateType } from './Player';
import { stateUpdateType } from '../../classes/NetworkActorsMap';

//These are just ghosts of other players. They don't collide they ony update based on network updates
export class NetworkPlayer extends ex.Actor {
    engine: ex.Engine;
    skinId: string;
    skinAnims: Record<DIRECTION, Record<POSE, ex.Animation>>;
    facing: DIRECTION;
    walkingMsLeft: number;
    actionAnimation: SpriteSequence | null;
    hasGhostPainState: boolean;
    isPainFlashing: boolean;
    playerAnimations: PlayerAnimations;
    playerActions: PlayerActions;
    painState: painStateType | null;

    constructor(x: number, y: number, engine: ex.Engine,) {
        super({
            pos: new ex.Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x
        });
        this.engine = engine;
        this.skinId = "BLUE";
        this.skinAnims = generateCharacterAnimations(this.skinId);
        this.facing = DOWN;
        this.walkingMsLeft = 0;     //if position just changed, make the sprite walk for a little bit
        this.actionAnimation = null;
        this.hasGhostPainState = false;
        this.isPainFlashing = false;
        this.playerAnimations = new PlayerAnimations(this);
        this.playerActions = new PlayerActions(this);
        this.painState = null;
    }

    regenAnims(newSkinId: string) {
        this.skinId = newSkinId;
        this.skinAnims = generateCharacterAnimations(this.skinId);
    }

    //Convert a network update to friendly values for this actor
    onStateUpdate(newUpdate: stateUpdateType) {
        if (newUpdate.actionType === SWORDACTION && !this.actionAnimation) {
            this.playerActions?.actionSwingSword();
        }
        if (newUpdate.actionType === ARROWACTION && !this.actionAnimation) {
            this.playerActions?.actionShootArrow();
        }

        //Reset timer to show Walking Ms for a bit if we have moved since last update
        const wasX = this.pos.x;
        const wasY = this.pos.y;
        this.pos.x = newUpdate.x;
        this.pos.y = newUpdate.y;
        const hasPosDiff = wasX !== this.pos.x || wasY !== this.pos.y;
        if (hasPosDiff) {
            this.walkingMsLeft = 100;       //Assume walking for this time if new pos came in
        }

        //If we are newly in pain flashing kick off a flash series
        const wasPainFlashing = this.isPainFlashing;
        if (!wasPainFlashing && newUpdate.isPainFlashing) {
            this.playerActions?.flashSeries();
        }

        //Redefine internal animations to new skin if a new one has come in
        if (this.skinId !== newUpdate.skinId) {
            this.regenAnims(newUpdate.skinId);
        }
    }

    onPreUpdate(_engine: ex.Engine, delta: number): void {
        //Work on dedicated animation if we are doing one
        this.playerAnimations.progressThroughActionAnimation(delta);

        //work down walking
        if (this.walkingMsLeft > 0) {
            this.walkingMsLeft -= delta;
        }

        //Update current animation according to state
        this.playerAnimations.showRelevantAnim();

    }


}