import { WALK } from "../../constants";
import { Player } from "./Player";

export class PlayerAnimations {
    actor: Player;
    constructor(actor: Player) {
        this.actor = actor;
    }

    showRelevantAnim() {
        const { actor } = this;

        //Use correct directional frame
        actor.graphics.use(actor.skinAnims[actor.facing][WALK]);
    }
}