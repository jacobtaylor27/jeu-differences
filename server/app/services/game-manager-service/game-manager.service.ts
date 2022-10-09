import { Game } from '@app/classes/game/game';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { Service } from 'typedi';

@Service()
export class GameManagerService {
    games: Game[] = [];
    constructor(private gameInfo: GameService, public differenceService: BmpDifferenceInterpreter) {}

    async createGame(players: string[], mode: string, gameCardId: string) {
        const gameCard: GameInfo = await this.gameInfo.getGameById(gameCardId);
        const game = new Game(mode, players, gameCard);
        this.games.push(game);
        return game.identifier;
    }

    isDifference(gameId: string, coord: Coordinate) {
        const game = this.findGame(gameId);
        return !game ? null : game.isDifferenceFound(coord);
    }

    isGameFound(gameId: string) {
        return this.findGame(gameId) !== undefined;
    }

    isGameOver(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isGameOver() : null;
    }

    differenceLeft(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).differenceLeft() : null;
    }

    private findGame(gameId: string): Game | undefined {
        return this.games.find((game: Game) => game.identifier === gameId);
    }
}
