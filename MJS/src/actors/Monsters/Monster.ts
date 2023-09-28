import { NetworkUpdater } from './../../classes/NetworkUpdater';
import * as ex from "excalibur";
import { ANCHOR_CENTER, DIRECTION, DOWN, EVENT_NETWORK_MONSTER_UPDATE, LEFT, PAIN, RIGHT, SCALE, SCALE_2x, TAG_ANY_PLAYER, TAG_DAMAGES_PLAYER, TAG_PLAYER_WEAPON, UP, WALK } from "../../constants";
import { guidGenerator, randomFromArray } from "../../helper";
import { generateMonsterAnimations } from "../../character-animations";
import { NetworkPlayer } from "../Players/NetworkPlayer";
import { Player, painStateType } from "../Players/Player";
import { Sword } from '../Sword';
import { Explosion } from '../Explosion';

const MONSTER_WALK_VELOCITY = 30;
const MONSTER_CHASE_VELOCITY = 65;
const MONSTER_DETECT_PLAYER_RANGE = 150;      //in pixels

export class Monster extends ex.Actor {
    networkId: string;
    painState: null | painStateType;
    roamingPoint: null | ex.Vector;
    target: null | Player | NetworkPlayer;
    hp: number;
    facing: string;
    anims: { [x: string]: { [x: string]: ex.Animation; }; };
    networkUpdater: NetworkUpdater | null = null;
    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            width: 16,
            height: 16,
            scale: SCALE_2x,
            collider: ex.Shape.Box(11, 10, ANCHOR_CENTER, new ex.Vector(0, 4),),
            collisionType: ex.CollisionType.Active,
        });
        this.networkId = guidGenerator();
        this.painState = null;
        this.roamingPoint = null;
        this.target = null;
        this.hp = 3;
        this.facing = DOWN;
        this.anims = generateMonsterAnimations();
        this.on("collisionstart", (evt) => this.onCollisionStart(evt));
    }

    onCollisionStart(evt: ex.CollisionStartEvent<ex.Actor>): void {
        if (evt.other.hasTag(TAG_PLAYER_WEAPON)) {
            const weapon = evt.other as Sword;
            if (weapon.isUsed) {
                return;
            }
            weapon.onDamagedSomething();
            this.takeDamage(weapon.direction);
        }
    }

    takeDamage(otherDirection: DIRECTION) {
        if (this.painState) {
            return;
        }

        // Reduce HP
        this.hp -= 1;

        // Check for death
        if (this.hp === 0) {
            this.kill();
            const expl = new Explosion(this.pos.x, this.pos.y);
            this.scene.engine.add(expl);
            return;
        }

        let x = this.vel.x * -1;
        if (otherDirection === LEFT) {
            x = -300;
        }
        if (otherDirection === RIGHT) {
            x = 300;
        }
        let y = this.vel.y * -1;
        if (otherDirection === DOWN) {
            y = 300;
        }
        if (otherDirection === UP) {
            y = -300;
        }

        this.painState = {
            msLeft: 100,
            painVelX: x,
            painVelY: y,
        };
    }

    onInitialize(_engine: ex.Engine): void {
        // Add to enemy group
        this.addTag(TAG_DAMAGES_PLAYER);

        // Choose random roaming point
        this.chooseRoamingPoint();

        //Periodically query for a new target
        void this.queryForTarget();

        //Send network updates on move
        this.networkUpdater = new NetworkUpdater(_engine, EVENT_NETWORK_MONSTER_UPDATE);
    }

    onPreUpdate(engine: ex.Engine, delta: number) {
        // Handle the pain state first
        if (this.painState) {
            this.vel.x = this.painState.painVelX;
            this.vel.y = this.painState.painVelY;
            this.painState.msLeft -= delta;
            if (this.painState.msLeft <= 0) {
                this.painState = null;
            }
        } else {
            // Pursue target or roaming point
            if (this.target) {
                this.onPreUpdateMoveTowardsTarget();
            } else {
                this.onPreUpdateMoveTowardsRoamingPoint();
            }
        }

        // Show correct appearance
        this.onPreUpdateAnimation();
    }

    onPreUpdateMoveTowardsRoamingPoint() {
        if (!this.roamingPoint) {
            return;
        }

        // Move towards the point if far enough away
        const distance = this.roamingPoint.distance(this.pos);
        if (distance > 5) {
            if (this.pos.x < this.roamingPoint.x) {
                this.vel.x = MONSTER_WALK_VELOCITY;
            }
            if (this.pos.x > this.roamingPoint.x) {
                this.vel.x = -MONSTER_WALK_VELOCITY;
            }
            if (this.pos.y < this.roamingPoint.y) {
                this.vel.y = MONSTER_WALK_VELOCITY;
            }
            if (this.pos.y > this.roamingPoint.y) {
                this.vel.y = -MONSTER_WALK_VELOCITY;
            }
        } else {
            this.chooseRoamingPoint();
        }
    }

    onPreUpdateMoveTowardsTarget() {
        const target = this.target!;
        // Move towards the point if far enough away
        const dest = target.pos;
        const distance = target.pos.distance(this.pos);
        if (distance > 5) {
            if (this.pos.x < dest.x) {
                this.vel.x = MONSTER_CHASE_VELOCITY;
            }
            if (this.pos.x > dest.x) {
                this.vel.x = -MONSTER_CHASE_VELOCITY;
            }
            if (this.pos.y < dest.y) {
                this.vel.y = MONSTER_CHASE_VELOCITY;
            }
            if (this.pos.y > dest.y) {
                this.vel.y = -MONSTER_CHASE_VELOCITY;
            }
        }
    }

    faceTowardPosition(pos: ex.Vector) {
        const xDiff = Math.abs(this.pos.x - pos.x);
        const yDiff = Math.abs(this.pos.y - pos.y);

        // Use axis that has the greatest distance
        if (xDiff > yDiff) {
            this.facing = this.pos.x > pos.x ? LEFT : RIGHT;
        }
        else {
            this.facing = this.pos.y > pos.y ? UP : DOWN;
        }

        // Chooose the correct frame 
        const pose = this.painState ? PAIN : WALK;
        this.graphics.use(this.anims[pose][this.facing]);
    }

    onPreUpdateAnimation() {
        if (!this.target && !this.roamingPoint) {
            return;
        }
        const facePosition = this.target ? this.target.pos : this.roamingPoint;
        this.faceTowardPosition(facePosition!);
    }

    async queryForTarget() {
        // If we don't have a valid target
        if (!this.target || this.target?.isKilled()) {
            // Query all players on the map
            const playersQuery = this.scene.world.queryManager.getQuery([
                TAG_ANY_PLAYER,
            ]);
            // Filter down to nearby ones within pixel range
            const nearbyPlayers = playersQuery.getEntities().filter((entity) => {
                const actor = entity as Player | NetworkPlayer;
                const actorDistance = this.pos.distance(actor.pos);
                return actorDistance <= MONSTER_DETECT_PLAYER_RANGE;
            });
            // If we have results, choose a random one to target
            if (nearbyPlayers.length) {
                this.target = randomFromArray(nearbyPlayers as (Player | NetworkPlayer)[]);
            }
        }

        // Retry after X seconds
        await this.actions.delay(1500).toPromise();
        await this.queryForTarget();
    }

    chooseRoamingPoint() {
        const possibleRoamingPoint = [
            new ex.Vector(84 * SCALE, 96 * SCALE),
            new ex.Vector(210 * SCALE, 112 * SCALE),
            new ex.Vector(95 * SCALE, 181 * SCALE),
            new ex.Vector(224 * SCALE, 184 * SCALE),
        ];
        this.roamingPoint = randomFromArray(possibleRoamingPoint);
    }
}
