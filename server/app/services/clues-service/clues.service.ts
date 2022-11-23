import { Coordinate } from '@common/coordinate';
import { GameManagerService } from '../game-manager-service/game-manager.service';

export class CluesService {
    constructor(private readonly gameManager: GameManagerService) {}

    findRandomDifference(gameId: string): Coordinate[] {
        this.gameManager.getGameInfo(gameId);
    }

    findRandomPixel(difference: Coordinate[]): Coordinate {
        console.log(difference);
    }

    // firstHintMethod() {}
    // secondHintMethod() {}
    // thirdHintMethod() {}
}
