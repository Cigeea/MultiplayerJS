import { NetworkMonster } from "../actors/Monsters/NetworkMonster";
import { NetworkPlayer } from "../actors/Players/NetworkPlayer";
import { Player } from "../actors/Players/Player";
import { DIRECTION, EVENT_NETWORK_MONSTER_UPDATE, EVENT_NETWORK_PLAYER_LEAVE, EVENT_NETWORK_PLAYER_UPDATE } from "../constants";

export class NetworkActorsMap {
    engine: ex.Engine;
    playerMap: Map<string, NetworkPlayer | NetworkMonster>;
    constructor(engine: ex.Engine) {
        this.engine = engine;
        this.playerMap = new Map();

        this.engine.on(EVENT_NETWORK_PLAYER_UPDATE, otherPlayer => {
            this.onUpdatedPlayer((otherPlayer as { id: string, data: string }).id, (otherPlayer as { id: string, data: string }).data)
        })

        this.engine.on(EVENT_NETWORK_PLAYER_LEAVE, otherPlayerIdWhoLeft => {
            this.removePlayer(otherPlayerIdWhoLeft as string);
        });

        this.engine.on(EVENT_NETWORK_MONSTER_UPDATE, (content) => {
            this.onUpdatedMonster(content as string);
        });
    }

    onUpdatedMonster(content: string) {
        const [_type, networkId, x, y, _velX, _velY, facing, hasPainState, hp] =
            content.split("|");

        let networkActor = this.playerMap.get(networkId) as NetworkMonster;

        // Add new if it doesn't exist
        if (!networkActor) {
            console.log('Add new monster if it doesnt exist ');
            networkActor = new NetworkMonster(Number(x), Number(y));
            this.playerMap.set(networkId, networkActor);
            this.engine.add(networkActor);
        }

        //Update the node ("Puppet style")
        networkActor.pos.x = Number(x);
        networkActor.pos.y = Number(y);
        networkActor.facing = facing;
        networkActor.hasPainState = hasPainState === "true";

        // Destroy if gone
        if (Number(hp) <= 0) {
            networkActor.tookFinalDamage();
            this.playerMap.delete(networkId);
        }
    }

    onUpdatedPlayer(id: string, content: string) {
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

        let otherPlayerActor = this.playerMap.get(id) as NetworkPlayer;
        if (!otherPlayerActor) {
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