import * as ex from "excalibur";
import { DIRECTION, DOWN, UP, LEFT, RIGHT } from "../constants.ts";
import { directions, getAssociatedKey } from "../keyboard-actions-mapping.ts";

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

    // update(engine: ex.Engine) {
    //     [
    //         { key: ex.Keys.A, dir: LEFT },
    //         { key: ex.Keys.D, dir: RIGHT },
    //         { key: ex.Keys.W, dir: UP },
    //         { key: ex.Keys.S, dir: DOWN },
    //     ].forEach((group) => {
    //         if (engine.input.keyboard.wasPressed(group.key)) {
    //             this.add(group.dir);
    //         }
    //         if (engine.input.keyboard.wasReleased(group.key)) {
    //             this.remove(group.dir);
    //         }
    //     });
    // }

    update(engine: ex.Engine) {
        directions.forEach(dir => {
            if (engine.input.keyboard.wasPressed(getAssociatedKey(dir))) {
                this.add(dir);
            }
            if (engine.input.keyboard.wasReleased(getAssociatedKey(dir))) {
                this.remove(dir);
            }
        });
    }
}