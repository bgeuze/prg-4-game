import { ScreenElement, Vector, Color, Rectangle } from 'excalibur';
import {EndScene} from "./endscene.js";

export class HealthBar extends ScreenElement {
    healthrectangle;
    borderrectangle;
    gameInstance;
    constructor(game) {
        super();
        this.gameInstance = game;

        this.healthrectangle = new Rectangle({
            width: 400,
            height: 30,
            color: Color.Red,
        });

        // Create the border rectangle
        this.borderrectangle = new Rectangle({
            width: this.healthrectangle.width + 5,
            height: this.healthrectangle.height + 5,
            color: Color.Black,
        });

        this.pos = new Vector((1400 - this.healthrectangle.width) / 2, 50);

        this.graphics.add(this.borderrectangle);
        this.graphics.add(this.healthrectangle);
    }

    resetHealth() {
        this.healthrectangle.width = 400;
    }

    loseHealth() {
        console.log(this.healthrectangle.width);
        if (this.healthrectangle.width <= 380) {
            console.log('game over');
            const endgame = new EndScene(this.gameInstance.savedData.getScore(), this.gameInstance.savedData.getUserId());
            this.gameInstance.add('gameover', endgame);
            this.gameInstance.goToScene('gameover');
            this.gameInstance.stopGame(); // Call the stopGame method on the gameInstance
        } else {
            this.healthrectangle.width -= 20;
        }
    }
}
