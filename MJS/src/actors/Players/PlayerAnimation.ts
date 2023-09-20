import { WALK } from "../../constants";
import { Player } from "./Player";

export class PlayerAnimations {
    actor: Player;
    constructor(actor: Player) {
        this.actor = actor;
    }

    progressThroughActionAnimation(delta: number) {
        const { actor } = this;
        if (actor.actionAnimation) {
            actor.vel.x = 0;            //Freeze
            actor.vel.y = 0;
            actor.actionAnimation.work(delta);
        }
    }

    showRelevantAnim() {
        const { actor } = this;

        if (actor.actionAnimation) {
            actor.graphics.use(actor.actionAnimation.frame);
            return;
        }

        //Use correct directional frame
        actor.graphics.use(actor.skinAnims[actor.facing][WALK]);
        // const walkingMsLeft = actor.walkingMsLeft ?? 0;
        const walkingMsLeft = 0;
        const anim: ex.Animation = actor.graphics.current[0].graphic as ex.Animation;
        if (actor.vel.x !== 0 || actor.vel.y !== 0 || walkingMsLeft > 0) {
            anim.play();
            // actor.graphics.current[0].graphic.play();
            return;
        }


        anim.pause();
        anim.goToFrame(0);
        // actor.graphics.current[0].graphic.pause();
        // actor.graphics.current[0].graphic.goToFrame(0);

    }
}