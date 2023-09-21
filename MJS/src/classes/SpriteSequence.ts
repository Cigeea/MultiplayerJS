import * as ex from "excalibur";
import { Sword } from "../actors/Sword";

interface Anim {
    animation: ex.Animation,
    duration: number,
    actorObjCallback: (arg0: Sword | null) => void
}
export class SpriteSequence {
    type: string;
    animations: Anim[];
    currentFrameIndex: number;
    currentFrameProgress: number;       //How much time is left on the frame
    isDone: boolean;
    onDone: () => void;
    actorObject: Sword | null;

    constructor(type: string, frameAnim: Anim[] = [], onDone: (actor: Sword | null) => void) {
        this.type = type;
        this.animations = frameAnim;
        this.currentFrameIndex = 0;
        this.currentFrameProgress = 0;
        this.isDone = false;
        this.onDone = () => {
            this.isDone = true;
            onDone(this.actorObject)
        };
        this.actorObject = null;    //A sword for example
    }

    get frame(): ex.Animation {
        return this.animations[this.currentFrameIndex].animation;
    }

    work(delta: number) {
        if (this.isDone) {
            return true;
        }

        const currentFrameDuration = this.animations[this.currentFrameIndex].duration;

        //work on current frame
        if (this.currentFrameProgress < currentFrameDuration) {
            this.currentFrameProgress += delta;
            return;
        }

        if (this.currentFrameIndex + 1 < this.animations.length) {
            this.currentFrameIndex += 1;
            this.currentFrameProgress = 0;
            //Do new frame callback
            const nextConfig = this.animations[this.currentFrameIndex];
            if (nextConfig.actorObjCallback) {
                nextConfig.actorObjCallback(this.actorObject);
            }
            return;
        }
        this.onDone();


    }
}