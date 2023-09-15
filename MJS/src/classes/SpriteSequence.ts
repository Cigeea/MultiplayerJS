import * as ex from "excalibur";

interface Frame {
    frame: ex.Animation,
    duration: number,
    actorObjCallback: (arg0: unknown) => void
}
export class SpriteSequence {

    type: string;
    frameAnims: Frame[];
    currentFrameIndex: number;
    currentFrameProgress: number;       //How much time is left on the frame
    isDone: boolean;
    onDone: () => void;
    actorObject: unknown;

    constructor(type: string, frameAnim: Frame[] = [], onDone: (actor: unknown) => void) {
        this.type = type;
        this.frameAnims = frameAnim;
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
        return this.frameAnims[this.currentFrameIndex].frame;
    }

    work(delta: number) {
        if (this.isDone) {
            return true;
        }

        const currentFrameDuration = this.frameAnims[this.currentFrameIndex].duration;

        //work on current frame
        if (this.currentFrameProgress < currentFrameDuration) {
            this.currentFrameProgress += delta;
            return;
        }

        if (this.currentFrameIndex + 1 < this.frameAnims.length) {
            console.log('Work ' + this.currentFrameIndex);
            this.currentFrameIndex += 1;
            this.currentFrameProgress = 0;
            //Do new frame callback
            const nextConfig = this.frameAnims[this.currentFrameIndex];
            if (nextConfig.actorObjCallback) {
                nextConfig.actorObjCallback(this.actorObject);
            }
            return;
        }
        this.onDone();


    }
}