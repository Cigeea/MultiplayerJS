import { Floor } from './src/actors/Floor';
import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE } from "./src/constants";
import { Player } from "./src/actors/Players/Player";

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false
});

const player = new Player(200, 200);
game.add(player);

const floor = new Floor(1, 1, 1, 6);
game.add(floor);
game.start();