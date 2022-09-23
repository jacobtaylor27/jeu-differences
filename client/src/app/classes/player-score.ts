import { GameCategory } from '@app/enums/game-category';

export class PlayerScore {
    private _time: number;
    private _playerName: string;
    private _category: GameCategory;

    constructor(playersName: string, time: number, category: GameCategory) {
        this._playerName = playersName;
        this._time = time;
        this._category = category;
    }

    get name(): string {
        return this._playerName;
    }
    get time(): number {
        return this._time;
    }
    get category(): GameCategory {
        return this._category;
    }
}
