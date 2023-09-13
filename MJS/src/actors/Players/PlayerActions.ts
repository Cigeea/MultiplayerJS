import * as ex from 'excalibur';
import { SpriteSequence } from '../../classes/SpriteSequence';
import { SWORD1, SWORDACTION } from '../../constants';
import { Player } from './Player';

export class PlayerActions {

    actor: Player;
    engine: ex.Engine;

    constructor(actor: Player) {
        this.actor = actor;
        this.engine = actor.scene.engine;
    }

    actionSwingSword() {
        const SWORD_SWING_SPEED = 50;
        const { actor, engine } = this;

        //Create a new Sequence with dedicated call per frame
        actor.actionAnimation = new SpriteSequence(
            SWORDACTION,
            [
                {
                    frame: actor.skinAnims[actor.facing][SWORD1],
                    duration: SWORD_SWING_SPEED,
                    actorObjCallback: (swordInstance) => {
                        //change sword's frame to match character on frame 1
                        //swordInstance.useFrame(SWORD_SWING_1, actor.facing);
                    }
                }
            ],
            () => { }
        )
    }
}