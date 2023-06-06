import '../css/style.css';
import {Engine, Label, Color, TextAlign, Font, FontUnit} from "excalibur";
import { ResourceLoader } from './resources.js';
import { Background } from "./background.js";
import { Player } from "./player.js";
import { Spawner } from "./spawner.js";
import { HealthBar } from "./HealthBar.js";
import { EndScene } from "./endscene.js";

export class Game extends Engine {
    timerLabel;
    startTime;
    timerInterval;
    canvasWidth;
    canvasHeight;

    constructor() {
        super({ width: 1400, height: 730 });
        this.start(ResourceLoader).then(() => {
            this.startGame();
        });
    }

    startGame() {
        const background = new Background();
        this.add(background);

        const health = new HealthBar(this);
        this.add(health);

        const spawner = new Spawner(health);
        spawner.onInitialize(this); // Pass the current instance of the engine
        this.currentScene.add(spawner);

        const player = new Player(400, 580);
        this.add(player);

        const customFont = new Font({
            family: 'CustomFont',
            size: 10,
            unit: FontUnit.Px
        });

        this.timerLabel = new Label("");
        this.timerLabel.font = customFont;
        this.timerLabel.textAlign = TextAlign.Right;
        this.timerLabel.color = Color.White;
        this.timerLabel.pos.setTo(this.drawWidth - 230, 70);

        this.add(this.timerLabel);

        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            this.timerLabel.text = `Score: ${elapsedTime}s`;

            // Scale up the font size
            const scaleFactor = 3; // Adjust the scale factor as needed
            this.timerLabel.scale.setTo(scaleFactor, scaleFactor);
        }, 1000);
    }

    cleanup() {
        clearInterval(this.timerInterval);
    }
}

const game = new Game();
game.start().then(() => {
    // Cleanup when the game is done
    game.cleanup();
});
