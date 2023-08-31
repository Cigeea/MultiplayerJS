import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE } from "./src/constants";
import { Player } from "./src/actors/Players/player";

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false
});

const player = new Player(200, 200, "BLUE");
game.add(player);
console.log('starting game')
game.start();