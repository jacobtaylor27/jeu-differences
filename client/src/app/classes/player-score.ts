import { GameCategory } from '@app/enums/game-category';

export class PlayerScore {
    private time: number;
    private playersName: string;
    private category: GameCategory;

    constructor(playersName: string, time: number, category: GameCategory) {
        this.playersName = playersName;
        this.time = time;
        this.category = category;
    }

    getName(): string {
        return this.playersName;
    }
    getTime(): number {
        return this.time;
    }
    getCategory(): GameCategory {
        return this.category;
    }
}
