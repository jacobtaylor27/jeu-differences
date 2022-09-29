import { Service } from 'typedi';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';

@Service()
export class GameManagerService {
    // games = Games[];
    constructor(private gameInfo: GameService) {}

    async createGame(player: string[], mode: string, gameCardId: number) {
        const gameCard: GameInfo = await this.gameInfo.getGameById(gameCardId);
        // Todo: call Game constructor
    }
    isDifference(idGame: number, coord: Coordinate) {
        // Todo: get the game by id
        // Todo: get the region of difference
    }

    isGameOver(idGame: number) {
        //game.isAllDifferenceFound
    }

    differenceLeft(idGame: number) {
        // game.differenceLeft()
    }
}
