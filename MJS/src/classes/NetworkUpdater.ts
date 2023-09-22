import * as ex from "excalibur";

export class NetworkUpdater {
    engine: ex.Engine;
    // eventType: ex.EventKey<ex.EngineEvents>;
    eventType: unknown
    prevStr: string;
    constructor(engine: ex.Engine, eventType: unknown) {
        this.engine = engine;
        this.eventType = eventType;
        this.prevStr = '';
    }

    sendStateUpdate(newString: string) {
        if (this.prevStr === newString) {
            return;
        }
        console.log(newString);
        this.engine.emit(this.eventType, newString);
        this.prevStr = newString;
    }
}