import Peer, { DataConnection } from "peerjs";
import { guidGenerator } from "../helper";
import { EVENT_NETWORK_MONSTER_UPDATE, EVENT_NETWORK_PLAYER_LEAVE, EVENT_NETWORK_PLAYER_UPDATE } from "../constants";

//This class manages the raw connections

const PORT = 9002;

const LOCALHOST_CONFIG = {
    host: "localhost",
    key: "demodemo",
    port: PORT,
    path: "/myapp"
}

const LOCALHOST_URL = `http://localhost:${PORT}`;

const PROD_URL = `peerjs-82ns.onrender.com`

const PROD_CONFIG = {
    host: PROD_URL,
    key: "demodemo",
    port: "",
    path: "/myapp",
    secure: true
}




export class NetworkClient {
    engine: ex.Engine;
    peerId: string;
    connectionMap: Map<string, DataConnection>;            //ID -> Conenction
    peer: Peer | null = null;
    constructor(engine: ex.Engine) {
        this.engine = engine;
        this.peerId = "Player_" + guidGenerator();
        this.connectionMap = new Map();
        void this.init();
    }

    async init() {
        this.peer = new Peer(this.peerId, PROD_CONFIG);

        this.peer.on("error", (err) => {
            console.log(err.message);
        })

        //Be ready to hear from incoming connections
        this.peer.on("connection", async (conn) => {
            //A new player has connected to me
            conn.on("open", () => {
                console.log("SOMEBODY CONNECTED TO ME")
                this.connectionMap.set(conn.peer, conn);
            })

            conn.on("close", () => {
                this.engine.emit(EVENT_NETWORK_PLAYER_LEAVE, conn.peer)
            })

            conn.on("data", (data) => {
                this.handleIncomingData(conn, data as string);
            })

            //Close the connection if I leave
            window.addEventListener("unload", () => {
                conn.close();
            })

        })

        //Make all outgoing connections
        const otherPeerIds = await this.getAllPeerIds();

        await timeout(1000);

        for (let i = 0; i < otherPeerIds.length; i++) {
            const id = otherPeerIds[i];

            //I joined and reached out to all the other players
            const conn = this.peer.connect(id);

            //Register to each player I know about
            conn.on("open", () => {
                console.log("CONNECT TO ", id);
                this.connectionMap.set(id, conn);
            });

            //Know when it's closed
            conn.on("close", () => {
                this.engine.emit(EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
            });

            //Subscribe to their updates
            conn.on("data", (data) => {
                this.handleIncomingData(conn, data as string);
            });

            //Close the connection if I leave
            window.addEventListener("unload", () => {
                conn.close();
            });

            await timeout(200);
        }
    }

    handleIncomingData(conn: DataConnection, data: string) {
        //HANDLE THE DATA HERE
        // throw new Error("Method not implemented.");

        // Handle MONSTER updates (detect by prefix)
        if (data.startsWith("MONSTER")) {
            this.engine.emit(EVENT_NETWORK_MONSTER_UPDATE, data);
            return;
        }

        //Handle player prefix
        this.engine.emit(EVENT_NETWORK_PLAYER_UPDATE, {
            id: conn.peer,
            data
        });

    }

    async getAllPeerIds() {
        // const response = await fetch(`${LOCALHOST_URL}/myapp/demodemo/peers`);          //only if allow_discovery = true
        //const response = await fetch(`${LOCALHOST_URL}/myapp/demodemo/peers`);
        const response = await fetch(`https://${PROD_URL}/myapp/demodemo/peers`);
        const peersArray: string[] = await response.json();
        const list = peersArray ?? [];
        return list.filter((id) => id !== this.peerId);
    }

    sendUpdate(update: unknown) {
        this.connectionMap.forEach((conn) => {
            conn.send(update);
        })
    }
}

function timeout(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}