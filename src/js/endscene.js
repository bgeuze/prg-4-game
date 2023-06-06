import { Color, Font, FontUnit, Label, Scene, TextAlign, Vector } from 'excalibur';
import {Game} from "./game.js";

export class EndScene extends Scene {
    onInitialize(engine) {
        const gameOverLabel = new Label({
            text: 'GAME OVER',
            font: new Font({
                family: 'CustomFont',
                size: 100,
                unit: FontUnit.Px,
            }),
            fontFamily: 'CustomFont',
            textAlign: TextAlign.Center,
            color: Color.White,
            pos: new Vector(400, 300),
        });

        const retryButton = new Label({
            text: 'Retry',
            font: new Font({
                family: 'CustomFont',
                size: 40,
                unit: FontUnit.Px,
            }),
            color: Color.White,
            backgroundColor: Color.Green,
            textAlign: TextAlign.Center,
            pos: new Vector(630, 400),
        });

        this.add(gameOverLabel);
        this.add(retryButton);

        engine.input.pointers.primary.on('up', (evt) => {
            location.reload();
        });
    }
}
