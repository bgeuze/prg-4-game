import {Actor, Random, Timer, Vector} from "excalibur";
import {Rock} from "./rock.js";

export class Spawner extends Actor {
    constructor(health) {
        super();
        this.random = new Random(1337);
        this.delay = 2000; // Set the initial delay between rock spawns (in milliseconds)
        this.minDelay = 3000; // Set the minimum delay value (in milliseconds)
        this.maxDelay = 4000; // Set the maximum delay value (in milliseconds)
        this.health = health;
    }

    onInitialize(engine) {
        this.timer = new Timer({
            fcn: () => this.spawn(engine),
            interval: this.delay,
            repeats: true,
        });
        engine.currentScene.add(this.timer);
        this.timer.start();
    }

    spawn(engine) {
        const rock = new Rock(engine.currentScene, 1280 + 300, 585, this.health);
        const minVelocity = -250; // Set the minimum velocity value
        const maxVelocity = -50; // Set the maximum velocity value (negative value greater than 0)
        const randomVelocity = Math.random() * (maxVelocity - minVelocity) + minVelocity;
        rock.vel = new Vector(randomVelocity, 0); // Assign the random velocity to the rock
        engine.currentScene.add(rock);

        this.delay = this.random.integer(this.minDelay, this.maxDelay); // Update the delay between spawns
        this.timer.interval = this.delay; // Update the timer interval
    }
}
