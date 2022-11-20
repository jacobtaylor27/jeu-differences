import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { Server } from 'socket.io';
import { Service } from 'typedi';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';

@Service()
export class GameManagerService {
    games: Map<string, Game> = new Map();
    constructor(
        private gameInfo: GameInfoService,
        public differenceService: BmpDifferenceInterpreter,
        private readonly limitedTimeGame: LimitedTimeGame,
    ) {}

    async createGame(playerInfo: { player: User; isMulti: boolean }, mode: GameMode, gameCardId: string) {
        let gameCard: PrivateGameInformation;
        if (mode === GameMode.LimitedTime) {
            const gamesRandomized = await this.limitedTimeGame.generateGames();
            gameCard = gamesRandomized[0];
        } else {
            gameCard = await this.gameInfo.getGameInfoById(gameCardId);
        }
        const game = new Game(mode, playerInfo, gameCard);
        this.games.set(game.identifier, game);
        return game.identifier;
    }

    getGameInfo(gameId: string) {
        return this.findGame(gameId)?.information;
    }

    setNextGame(gameId: string) {
        this.findGame(gameId)?.nextGame();
    }

    setTimer(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).setTimer() : null;
    }

    sendTimer(sio: Server, gameId: string, playerId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }

        game.timerId = setInterval(() => {
            if (game.gameMode === GameMode.LimitedTime && this.isGameOver(gameId)) {
                // high scores to handle here
                sio.sockets.to(gameId).emit(SocketEvent.Lose);
                this.leaveGame(playerId, gameId);
                this.deleteTimer(gameId);
            } else {
                sio.sockets.to(gameId).emit(SocketEvent.Clock, this.getTime(gameId));
            }
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- one second is 1000 ms
        }, 1000);
    }

    deleteTimer(gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        clearInterval(game.timerId);
    }

    getTime(gameId: string) {
        return this.findGame(gameId) ? (this.findGame(gameId) as Game).seconds : null;
    }

    isDifference(gameId: string, playerId: string, coord: Coordinate) {
        const game = this.findGame(gameId);
        return !game ? null : game.isDifferenceFound(playerId, coord);
    }

    isGameFound(gameId: string) {
        return this.findGame(gameId) !== undefined;
    }

    isGameOver(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isGameOver() : null;
    }

    nbDifferencesLeft(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).nbDifferencesLeft() : null;
    }

    isGameAlreadyFull(gameId: string) {
        const game = this.findGame(gameId);
        return !game || game.isGameFull();
    }

    addPlayer(player: User, gameId: string) {
        const game = this.findGame(gameId);

        game?.addPlayer(player);
    }

    hasSameName(roomId: string, playersName: string) {
        const game = this.findGame(roomId);
        if (game) {
            for (const [, value] of game.players.entries()) {
                if (value === playersName) {
                    return true;
                }
            }
        }
        return false;
    }

    isGameMultiplayer(gameId: string) {
        const game = this.findGame(gameId);
        return game?.multi;
    }

    leaveGame(playerId: string, gameId: string) {
        const game = this.findGame(gameId);
        game?.leaveGame(playerId);
        this.deleteTimer(gameId);
        if (game && game.hasNoPlayer()) {
            this.games.delete(gameId);
        }
    }

    getNbDifferencesFound(differenceCoords: Coordinate[], gameId: string, isPlayerFoundDifference?: boolean): DifferenceFound {
        return isPlayerFoundDifference !== undefined
            ? {
                  coords: differenceCoords,
                  nbDifferencesLeft: this.nbDifferencesLeft(gameId) as number,
                  isPlayerFoundDifference,
              }
            : {
                  coords: differenceCoords,
                  nbDifferencesLeft: this.nbDifferencesLeft(gameId) as number,
              };
    }

    findPlayer(gameId: string, playerId: string) {
        return this.findGame(gameId)?.findPlayer(playerId);
    }

    findGameMode(gameId: string) {
        return this.findGame(gameId)?.gameMode;
    }

    private findGame(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }
}
