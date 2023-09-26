import { NetworkClient } from './src/classes/NetworkClient';
import { Player_CameraStrategy } from './src/classes/Player_CameraStrategy';
import { Map_Indoor } from './src/maps/Map_Indoor';
import { Floor } from './src/actors/Floor';
import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE, EVENT_SEND_PLAYER_UPDATE } from "./src/constants";
import { Player } from "./src/actors/Players/Player";
import { loader } from './src/resources';
import { NetworkActorsMap } from './src/classes/NetworkActorsMap';

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false
});

const map = new Map_Indoor();
game.add(map);

const player = new Player(200, 200, game, "GRAY");
game.add(player);

game.on("initialize", () => {
    //Add custom Camera behaviour, following player and being limited to the map bounds
    const cameraStrategy = new Player_CameraStrategy(player, map);
    game.currentScene.camera.addStrategy(cameraStrategy);

    //Create player state list and network listener
    new NetworkActorsMap(game);
    const peer = new NetworkClient(game);

    //When one of my nodes updates, send it to all peers
    game.on(EVENT_SEND_PLAYER_UPDATE, (update) => {
        peer.sendUpdate(update);
    })
})


game.start(loader);