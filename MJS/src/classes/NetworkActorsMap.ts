import { NetworkPlayer } from "../actors/Players/NetworkPlayer";
import { Player } from "../actors/Players/Player";
import { DIRECTION, EVENT_NETWORK_PLAYER_LEAVE, EVENT_NETWORK_PLAYER_UPDATE } from "../constants";

export class NetworkActorsMap {
    engine: ex.Engine;
    playerMap: Map<string, NetworkPlayer>;
    constructor(engine: ex.Engine) {
        this.engine = engine;
        this.playerMap = new Map();

        this.engine.on(EVENT_NETWORK_PLAYER_UPDATE, otherPlayer => {
            console.log('on EVENT_NETWORK_PLAYER_UPDATE dans NetworkActorsMap');
            this.onUpdatedPlayer((otherPlayer as { id: string, data: string }).id, (otherPlayer as { id: string, data: string }).data)
        })

        this.engine.on(EVENT_NETWORK_PLAYER_LEAVE, otherPlayerIdWhoLeft => {
            this.removePlayer(otherPlayerIdWhoLeft as string);
        });
    }

    toto = (otherPlayer: { id: string, data: string }) => {
        this.onUpdatedPlayer(otherPlayer.id, otherPlayer.data)
    }

    onUpdatedPlayer(id: string, content: string) {
        console.log('ON UPDATE PLAYER in NetworkActorsMap');
        //Decode what was sent here
        const [
            actionType,
            x,
            y,
            velX,
            velY,
            skinId,
            facing,
            isInPain,
            isPainFlashing,
        ] = content.split("|");

        const stateUpdate: stateUpdateType = {
            actionType,
            x: Number(x),
            y: Number(y),
            skinId,
            facing,
            isInPain: isInPain === "true",
            isPainFlashing: isPainFlashing === "true"
        };

        if (isInPain) {
            stateUpdate.velX = Number(velX);
            stateUpdate.velY = Number(velY);
        }

        let otherPlayerActor = this.playerMap.get(id);
        if (!otherPlayerActor) {
            console.log('Creating new NetworkPlayer in NetworkActorsMap');
            otherPlayerActor = new NetworkPlayer(stateUpdate.x, stateUpdate.y, this.engine);
            this.playerMap.set(id, otherPlayerActor);
            this.engine.add(otherPlayerActor);
        }

        otherPlayerActor.onStateUpdate(stateUpdate);

    }



    removePlayer(id: string) {
        const actorToRemove = this.playerMap.get(id);
        if (actorToRemove) {
            actorToRemove.kill();
        }
        this.playerMap.delete(id);
    }
}

export interface stateUpdateType {
    actionType: string,
    x: number,
    y: number,
    skinId: string,
    facing: DIRECTION,
    isInPain: boolean,
    isPainFlashing: boolean,
    velX?: number
    velY?: number
}