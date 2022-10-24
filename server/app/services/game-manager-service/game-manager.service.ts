import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { User } from '@app/interface/user';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { Service } from 'typedi';

@Service()
export class GameManagerService {
    games: Set<Game> = new Set();
    constructor(private gameInfo: GameInfoService, public differenceService: BmpDifferenceInterpreter) {}

    async createGame(playerInfo: { player: User; isMulti: boolean }, mode: string, gameCardId: string) {
        const gameCard: PrivateGameInformation = await this.gameInfo.getGameInfoById(gameCardId);
        const game = new Game(mode, playerInfo, gameCard);
        this.games.add(game);
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

    isGameAlreadyFull(gameId: string) {
        const game = this.findGame(gameId);
        return !game || game.isGameFull();
    }

    addPlayer(player: User, gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        game.addJoinPlayer(player);
    }

    isGameMultiPlayer(gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        return game.multi;
    }

    leaveGame(playerId: string, gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        game.leaveGame(playerId);
        if (game.hasNoPlayer()) {
            this.games.delete(game);
        }
    }

    differenceFound(coord: Coordinate, isPlayerFoundDifference: boolean, gameId: string): DifferenceFound {
        return {
            difference: { coords: this.isDifference(gameId, coord) as Coordinate[], isPlayerFoundDifference },
            isGameOver: this.isGameOver(gameId) as boolean,
            differenceLeft: this.differenceLeft(gameId) as number,
        };
    }

    private findGame(gameId: string): Game | undefined {
        return Array.from(this.games.values()).find((game: Game) => game.identifier === gameId);
    }
}
