import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE } from "./src/constants";

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false
});