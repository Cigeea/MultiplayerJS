import { Monster } from './src/actors/Monsters/Monster';
import { NetworkClient } from './src/classes/NetworkClient';
import { Player_CameraStrategy } from './src/classes/Player_CameraStrategy';
import { Map_Indoor } from './src/maps/Map_Indoor';
import { Floor } from './src/actors/Floor';
import * as ex from "excalibur";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, SCALE, EVENT_SEND_PLAYER_UPDATE, TAG_ANY_PLAYER, EVENT_SEND_MONSTER_UPDATE } from "./src/constants";
import { Player } from "./src/actors/Players/Player";
import { loader } from './src/resources';
import { NetworkActorsMap } from './src/classes/NetworkActorsMap';
import { DisplayMode } from 'excalibur';

const game = new ex.Engine({
    width: VIEWPORT_WIDTH * SCALE,
    height: VIEWPORT_HEIGHT * SCALE,
    fixedUpdateFps: 60,
    antialiasing: false,
    displayMode: DisplayMode.FillScreen
});

const map = new Map_Indoor();
game.add(map);

const player = new Player(200, 200, game, "GRAY");
game.add(player);

game.on("initialize", () => {
    //Add custom Camera behaviour, following player and being limited to the map bounds
    const cameraStrategy = new Player_CameraStrategy(player, map);
    game.currentScene.camera.addStrategy(cameraStrategy);

    // Set up ability to query for certain actors on the fly
    game.currentScene.world.queryManager.createQuery([TAG_ANY_PLAYER]);

    //Create player state list and network listener
    new NetworkActorsMap(game);
    const peer = new NetworkClient(game);

    //When one of my nodes updates, send it to all peers
    game.on(EVENT_SEND_PLAYER_UPDATE, (update) => {
        peer.sendUpdate(update);
    })

    game.on(EVENT_SEND_MONSTER_UPDATE, (update) => {
        peer.sendUpdate(update);
    });
})


game.start(loader);


const createAddMonsterButton = () => {
    const button = document.createElement("button");
    button.onclick = () => {
        const monster = new Monster(100, 100);
        game.add(monster);
    }
    button.style.display = "block";
    button.innerText = "ADD MONSTER";
    document.body.append(button);
}

createAddMonsterButton();