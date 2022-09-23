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

    get Name(): string {
        return this.playersName;
    }
    get Time(): number {
        return this.time;
    }
    get Category(): GameCategory {
        return this.category;
    }
}
