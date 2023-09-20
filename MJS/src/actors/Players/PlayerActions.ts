import * as ex from 'excalibur';
import { SpriteSequence } from '../../classes/SpriteSequence';
import { SWORD1, SWORD2, SWORDACTION } from '../../constants';
import { Player } from './Player';
import { SWORD_SWING_1, SWORD_SWING_2, SWORD_SWING_3, Sword } from '../Sword';
export class PlayerActions {

    actor: Player;
    engine: ex.Engine;

    constructor(actor: Player) {
        this.actor = actor;
        // this.engine = actor.scene.engine;
        this.engine = actor.engine;
    }

    actionSwingSword() {
        const SWORD_SWING_SPEED = 350;
        const { actor, engine } = this;

        //Create a new Sequence with dedicated callback per frame
        actor.actionAnimation = new SpriteSequence(
            SWORDACTION,
            [
                {
                    animation: actor.skinAnims[actor.facing][SWORD1],
                    duration: SWORD_SWING_SPEED,
                    actorObjCallback: (swordInstance: Sword | null) => {
                        //change sword's frame to match character on frame 1
                        swordInstance?.useFrame(SWORD_SWING_1, actor.facing);
                    }
                },
                {
                    animation: actor.skinAnims[actor.facing][SWORD2],
                    duration: SWORD_SWING_SPEED,
                    actorObjCallback: (swordInstance) => {
                        //change sword's frame to match character on frame 1
                        swordInstance?.useFrame(SWORD_SWING_2, actor.facing);
                    }
                },
                {
                    animation: actor.skinAnims[actor.facing][SWORD2],
                    duration: SWORD_SWING_SPEED * 2,
                    actorObjCallback: (swordInstance) => {
                        //change sword's frame to match character on frame 1
                        swordInstance?.useFrame(SWORD_SWING_3, actor.facing);
                    }
                }
            ],
            (swordInstance) => {
                actor.actionAnimation = null;
            }
        )

        //Create the sword here...
        const sword = new Sword(actor.pos.x, actor.pos.y, actor.facing);
        engine.add(sword);
        sword.owner = actor;

        // Assign this sword instance to be controllable by each frame above
        actor.actionAnimation.actorObject = sword;
    }
}