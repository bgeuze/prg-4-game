import { ImageSource, Loader, Color } from 'excalibur';
import playerRun from '../images/player-run.png';
import playerHurt from '../images/player-hurt.png';
import bgImage from '../images/gamebg.png';
import rockImage from '../images/rock.png';
import titleImage from '../images/logogame.png';

const Resources = {
    PlayerRun: new ImageSource(playerRun),
    playerHurt: new ImageSource(playerHurt),
    Background: new ImageSource(bgImage),
    Rock: new ImageSource(rockImage)
};

const ResourceLoader = new Loader([Resources.PlayerRun, Resources.playerHurt, Resources.Background, Resources.Rock]);

ResourceLoader.startButtonFactory = () => {
    let container = document.createElement('div');
    container.classList.add('customContainer');

    let logo = document.createElement('img');
    logo.src = titleImage;
    logo.classList.add('customLogo');
    container.appendChild(logo);

    let btn = document.createElement('button');
    btn.classList.add('customButton');
    btn.innerText = "new game";
    container.appendChild(btn);

    return container;
};

export { Resources, ResourceLoader };
