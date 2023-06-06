import { Actor, Vector, Input, SpriteSheet, range, Animation } from "excalibur";
import { Resources } from "./resources.js";

export class Player extends Actor {
    constructor(posX, posY) {
        super({
            width: Resources.PlayerRun.width / 10000, // divide on the actual width of sprite
            height: Resources.PlayerRun.height / 10000
        });

        const runSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerRun,
            grid: { rows: 1, columns: 10, spriteWidth: 1000, spriteHeight: 1000 }
        });

        const hurtSheet = SpriteSheet.fromImageSource({
            image: Resources.playerHurt,
            grid: { rows: 1, columns: 10, spriteWidth: 1000, spriteHeight: 1000 }
        });

        const idle = runSheet.sprites[0];
        const playerRun = Animation.fromSpriteSheet(runSheet, range(1, 10), 80);
        const playerHurt = Animation.fromSpriteSheet(hurtSheet, range(1, 10), 80);

        this.graphics.add("idle", idle);
        this.graphics.add("playerRun", playerRun);
        this.graphics.add("playerHurt", playerHurt);

        this.graphics.use("idle");

        this.initialPos = new Vector(posX, posY);
        this.resetPlayer();
        this.jumpForce = -300;
        this.flyForce = -600;
        this.gravity = 700;

        this.graphics.use("playerRun");
        this.scale.setTo(0.25, 0.25);
    }

    jump() {
        if (!this.isJumping && !this.isFlying) {
            this.vel.y = this.jumpForce;
            this.isJumping = true;
        }
    }

    fly() {
        if (!this.isFlying) {
            this.vel.y = this.flyForce;
            this.isFlying = true;
        }
    }

    resetPlayer() {
        this.pos = this.initialPos.clone();
        this.vel.setTo(0, 0);
        this.isJumping = false;
        this.isFlying = false;
    }

    update(engine, delta) {
        super.update(engine, delta);

        if (engine.input.keyboard.wasPressed(Input.Keys.Space)) {
            this.jump();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.ArrowUp)) {
            this.fly();
        }

        if (this.isJumping || this.isFlying) {
            this.vel.y += this.gravity * delta / 1000;
            this.pos.y += this.vel.y * delta / 1000;

            // Check if the player has landed on the ground
            if (this.pos.y >= this.initialPos.y) {
                this.pos.y = this.initialPos.y;
                this.vel.y = 0;
                this.isJumping = false;
                this.isFlying = false;
            }
        }
    }
}
