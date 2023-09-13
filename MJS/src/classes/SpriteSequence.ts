import * as ex from "excalibur";

export class SpriteSequence {

    type: string;
    frameAnims: ex.Animation[];
    currentFrameIndex: number;
    currentFrameProgress: number;       //How much time is left on the frame
    isDone: boolean;
    onDone: () => void;
    actorObject: null;

    constructor(type: string, frameAnim = [], onDone: (actor: any) => void) {
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

    get frame() {
        return this.frameAnims[this.currentFrameIndex].frame;
    }

    work(delta) {
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
            this.currentFrameIndex++;
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