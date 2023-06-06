import { Color, Font, FontUnit, Label, Scene, TextAlign, Vector } from 'excalibur';
import { Resources } from "./resources.js";

export class EndScene extends Scene {
    score;
    playerId;

    constructor(score, playerId) {
        super({});
        this.score = score;
        this.playerId = playerId;
    }

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

        const scoreLabel = new Label({
            text: `Score: ${this.score}`,
            font: new Font({
                family: 'CustomFont',
                size: 40,
                unit: FontUnit.Px,
            }),
            color: Color.White,
            textAlign: TextAlign.Center,
            pos: new Vector(590, 400),
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
            pos: new Vector(620, 500),
        });

        this.add(gameOverLabel);
        this.add(scoreLabel);
        this.add(retryButton);

        fetch('https://stud.hosted.hr.nl/1036494/prg4/getScores.php')
            .then(response => response.json())
            .then(data => {
                let scores = Array.isArray(data.scores) ? data.scores : [];

                const playerData = {
                    playerId: this.playerId,
                    score: this.score
                };

                let existingPlayerIndex = -1;
                for (let i = 0; i < scores.length; i++) {
                    if (scores[i].playerId === this.playerId) {
                        existingPlayerIndex = i;
                        break;
                    }
                }

                if (existingPlayerIndex !== -1) {
                    const existingPlayer = scores[existingPlayerIndex];
                    if (existingPlayer.score < this.score) {
                        existingPlayer.score = this.score;
                    }
                } else {
                    scores.push(playerData);
                }

                saveScoresToServer({ scores });

            })
            .catch(error => {
                console.error('Error loading high scores:', error);
            });

        function saveScoresToServer(scores) {
            const jsonString = JSON.stringify(scores);

            // Use the Fetch API to send the scores to the server-side endpoint
            fetch('https://stud.hosted.hr.nl/1036494/prg4/saveScores.php', {
                method: 'POST',
                body: jsonString,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log(response);
                        console.log('High scores saved successfully.');
                    } else {
                        console.error('Failed to save high scores:', response.status, response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error saving high scores:', error);
                });
        }

        engine.input.pointers.primary.on('up', (evt) => {
            location.reload();
        });
    }
}