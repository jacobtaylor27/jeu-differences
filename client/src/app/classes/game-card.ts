import { Score } from '@app/classes/score';

export class GameCard {
    isShown: boolean = false;
    gameName: string;
    imgSource: string;
    scoresSolo: Score[];
    scoresMultiplayer: Score[];
}
