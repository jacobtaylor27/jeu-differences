import { GameCategory } from '@app/enums/game-category';

export class Score {
    time: number;
    name: string;
    category: GameCategory;

    constructor(name: string, time: number, category: GameCategory) {
        this.name = name;
        this.time = time;
        this.category = category;
    }

    convertTime(): string {
        const minutes: string = Math.floor(this.time / 60).toString();
        const seconds: string = (this.time % 60).toString();
        return `${minutes}:${seconds.padStart(2, '0')}`;
    }
}
