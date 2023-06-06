import '../css/style.css';
import { Engine, Label, Color, TextAlign, Font, FontUnit, Physics, Vector } from "excalibur";
import { ResourceLoader } from './resources.js';
import { Background } from "./background.js";
import { Player } from "./player.js";
import { Spawner } from "./spawner.js";
import { HealthBar } from "./HealthBar.js";
import { savedData } from "./savedData.js";
import { StartScreen } from "./startscreen.js";
import {EndScene} from "./endscene.js";

export class Game extends Engine {
    timerLabel;
    startTime;
    timerInterval;
    canvasWidth;
    canvasHeight;
    savedData = new savedData();

    constructor() {
        super({ width: 1400, height: 730 });
        this.start(ResourceLoader).then(() => {

            let userId = localStorage.getItem('userId');
            if (!userId) {
                userId = Math.random().toString(36).substring(7);
                localStorage.setItem('userId', userId);
            }
            this.savedData.setUserId(userId);

            const startScreen = new StartScreen(this, this.savedData.getUserId())
            this.add('startscreen', startScreen);
            this.goToScene('startscreen');
        });
    }

    startGame() {
        const background = new Background();
        this.add(background);

        const health = new HealthBar(this); // Pass the game instance to the HealthBar constructor
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
            this.timerLabel.text = `Score: ${elapsedTime}`;

            // Scale up the font size
            const scaleFactor = 3; // Adjust the scale factor as needed
            this.timerLabel.scale.setTo(scaleFactor, scaleFactor);

            this.savedData.setScore(elapsedTime);

        }, 1000);
    }

    stopGame() {
        clearInterval(this.timerInterval);
    }

    cleanup() {
        // Cleanup any resources or event handlers
    }
}

const game = new Game();
game.start().then(() => {
    // Cleanup when the game is done
    game.cleanup();
});
