import { Map_Indoor } from './src/maps/Map_Indoor';
import { Floor } from './src/actors/Floor';
import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE } from "./src/constants";
import { Player } from "./src/actors/Players/Player";
import { loader } from './src/resources';

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false
});

const map = new Map_Indoor();
game.add(map);

const player = new Player(200, 200);
game.add(player);



game.start(loader);