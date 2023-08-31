import * as ex from "excalibur";
import { DIRECTION, DOWN, UP, LEFT, RIGHT } from "../constants.ts";

export class DirectionQueue {
    heldDirections: DIRECTION[];

    constructor() {
        this.heldDirections = [];
    }

    get direction() {
        return this.heldDirections[0] ?? null;
    }

    add(dir: DIRECTION) {
        const exists = this.heldDirections.includes(dir);
        if (exists) {
            return;
        }
        this.heldDirections.unshift(dir);
    }

    remove(dir: DIRECTION) {
        this.heldDirections = this.heldDirections.filter((d) => d !== dir);
    }

    update(engine: ex.Engine) {
        [
            { key: ex.Input.Keys.Left, dir: LEFT },
            { key: ex.Input.Keys.Right, dir: RIGHT },
            { key: ex.Input.Keys.Up, dir: UP },
            { key: ex.Input.Keys.Down, dir: DOWN },
        ].forEach((group) => {
            if (engine.input.keyboard.wasPressed(group.key)) {
                this.add(group.dir);
            }
            if (engine.input.keyboard.wasReleased(group.key)) {
                this.remove(group.dir);
            }
        });
    }
}