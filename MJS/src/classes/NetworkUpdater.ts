import * as ex from "excalibur";

export class NetworkUpdater {
    engine: ex.Engine;
    // eventType: ex.EventKey<ex.EngineEvents>;
    eventType: string
    prevStr: string;
    constructor(engine: ex.Engine, eventType: string) {
        this.engine = engine;
        this.eventType = eventType;
        this.prevStr = '';
    }

    sendStateUpdate(newString: string) {
        if (this.prevStr === newString) {
            return;
        }
        this.engine.emit(this.eventType, newString);
        this.prevStr = newString;
    }
}