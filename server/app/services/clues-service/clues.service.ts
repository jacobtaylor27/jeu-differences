import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';
@Service()
export class CluesService {
    constructor(private readonly gameManager: GameManagerService) {}

    findRandomDifference(gameId: string): Coordinate[] {
        const gameDifferences = this.gameManager.getGameInfo(gameId)?.differences as Coordinate[][];
        return gameDifferences[this.findRandomIndex(gameDifferences.length)];
    }

    findRandomPixel(difference: Coordinate[]): Coordinate {
        return difference[this.findRandomIndex(difference.length)];
    }

    private findRandomIndex(length: number) {
        return Math.floor(Math.random() * length);
    }

    // firstHintMethod() {}
    // secondHintMethod() {}
    // thirdHintMethod() {}
}
