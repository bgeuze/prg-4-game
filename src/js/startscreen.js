import { Color, Font, FontUnit, Label, Scene, TextAlign, Vector } from 'excalibur';

export class StartScreen extends Scene {
    highScore = 'No High Score Yet! Start Playing :)'; // Assign a default value to handle cases where the player ID does not exist in the scores data
    constructor(game, playerId, score) {
        super();
        this.gameInstance = game;
        this.userScore = null;
        this.playerId = playerId;
        this.score = score;
    }

    onInitialize(engine) {
        const welcomeLabel = new Label({
            text: 'Welcome!', // Default text for new users
            font: new Font({
                family: 'CustomFont',
                size: 100,
                unit: FontUnit.Px,
            }),
            fontFamily: 'CustomFont',
            textAlign: TextAlign.Center,
            color: Color.White,
            pos: new Vector(450, 300),
        });

        const scoreLabel = new Label({
            text: `${this.highScore}`, // Use this.highScore as the initial score value
            font: new Font({
                family: 'CustomFont',
                size: 40,
                unit: FontUnit.Px,
            }),
            color: Color.White,
            textAlign: TextAlign.Center,
            pos: new Vector(300, 400),
        });

        const startButton = new Label({
            text: 'Start Game',
            font: new Font({
                family: 'CustomFont',
                size: 40,
                unit: FontUnit.Px,
            }),
            color: Color.White,
            backgroundColor: Color.Green,
            textAlign: TextAlign.Center,
            pos: new Vector(580, 500),
        });

        this.add(welcomeLabel);
        this.add(scoreLabel);
        this.add(startButton);

        fetch('https://stud.hosted.hr.nl/1036494/prg4/getScores.php')
            .then(response => response.json())
            .then(data => {
                let scores = Array.isArray(data.scores) ? data.scores : [];

                let existingPlayerIndex = -1;
                for (let i = 0; i < scores.length; i++) {
                    if (scores[i].playerId === this.playerId) {
                        existingPlayerIndex = i;
                        break;
                    }
                }

                if (existingPlayerIndex !== -1) {
                    const existingPlayer = scores[existingPlayerIndex];
                    // Update the scoreLabel text
                    scoreLabel.text = `Your High Score: ${existingPlayer.score}`;
                    scoreLabel.pos = new Vector(480, 400)
                    welcomeLabel.text = 'Welcome back!'; // Change the welcome text for returning users
                    welcomeLabel.pos = new Vector(300, 300)
                }
            })
            .catch(error => {
                console.error('Error loading high scores:', error);
            });

        engine.input.pointers.primary.on('up', (evt) => {
            this.gameInstance.startGame();
        });
    }
}
