import { Game } from '@app/classes/game/game';
import { Coordinate } from '@common/coordinate';

export class CluesService {
    constructor(private readonly game: Game){}

    findRandomDifference(): Coordinate[] {
        this.game.
    }

    findRandomPixel(difference: Coordinate[]): Coordinate {
        console.log(difference);
    }

    // firstHintMethod() {}
    // secondHintMethod() {}
    // thirdHintMethod() {}
}
