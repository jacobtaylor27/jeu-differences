import { GameCategory } from '@app/enums/game-category';

export class PlayerScore {
    time: number;
    playerName: string;
    category: GameCategory;

    constructor(playersName: string, time: number, category: GameCategory) {
        this.playerName = playersName;
        this.time = time;
        this.category = category;
    }
}
