import {Actor, Animation, CollisionType, range, SpriteSheet, Vector} from "excalibur";
import {Resources} from "./resources.js";
import {Background} from "./background.js";
import {Player} from "./player.js";

export class Rock extends Actor {
    constructor(scene, posX, posY, health) {
        super({
            pos: new Vector(posX, posY),
            width: 30,
            height: 30,
            collisionType: CollisionType.Active,
        });
        this.graphics.use(Resources.Rock.toSprite());

        this.scene = scene;
        this.health = health;
        this.collided = false;

        const runSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerRun,
            grid: { rows: 1, columns: 10, spriteWidth: 1000, spriteHeight: 1000 }
        });

        const hurtSheet = SpriteSheet.fromImageSource({
            image: Resources.playerHurt,
            grid: { rows: 1, columns: 10, spriteWidth: 1000, spriteHeight: 1000 }
        });

        this.playerRunAnimation = Animation.fromSpriteSheet(runSheet, range(1, 10), 80);
        this.playerHurtAnimation = Animation.fromSpriteSheet(hurtSheet, range(1, 10), 40);
    }

    onInitialize() {
        this.on('precollision', (event) => this.onPreCollision(event));
        this.scene.add(this);
    }

    update(engine, delta) {
        super.update(engine, delta);
        const backgroundVelocity = engine.currentScene.actors.find((actor) => actor instanceof Background)?.vel;

        if (backgroundVelocity) {
            this.pos.x += backgroundVelocity.x * delta / 1000;
        }
    }

    onPreCollision(event) {
        if (event.other instanceof Player && !this.collided) {
            const player = event.other;

            // Set the hurt animation for a certain duration
            player.graphics.use(this.playerHurtAnimation);
            player.scale.setTo(0.25, 0.25);

            // Start a timer to switch back to the running animation
            setTimeout(() => {
                player.graphics.use(this.playerRunAnimation);
                player.scale.setTo(0.25, 0.25);
            }, 400); // Replace 1000 with the desired duration of the hurt animation

            this.health.loseHealth();
            this.collided = true;
        }
    }

}
