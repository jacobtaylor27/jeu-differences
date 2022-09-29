import { Service } from 'typedi';
import { GameService } from '@app/services/game-info-service/game-info.service';
// import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { Game } from '@app/classes/game/game';

@Service()
export class GameManagerService {
    games: Game[] = [];
    constructor(private gameInfo: GameService) {}

    async createGame(players: string[], mode: string, gameCardId: number) {
        const gameCard: GameInfo = await this.gameInfo.getGameById(gameCardId);
        const game = new Game(mode, players, gameCard);
        this.games.push(game);
        return game.identifier;
    }
    isDifference(idGame: number, coord: Coordinate) {
        // Todo: get the game by id
        // Todo: get the region of difference
    }

    isGameFound(gameId: string) {
        return this.findGame(gameId) !== undefined;
    }
    differenceLeft(gameId: string) {
        return this.isGameFound(gameId) ? this.findGame(gameId)?.differenceLeft() : null;
    }

    private findGame(gameId: string): Game | undefined {
        return this.games.find((game: Game) => game.identifier === gameId);
    }
}
