import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { v4 } from 'uuid';

export class Game {
    players: Map<string, string>;
    timerId: NodeJS.Timer;
    currentIndex: number = 0;
    private id: string;
    private mode: GameMode;
    private isMulti: boolean;
    private info: PrivateGameInformation;
    private context: GameContext;

    constructor(
        player: { player: User; isMulti: boolean },
        game: { info: PrivateGameInformation; mode: GameMode; timerConstant?: GameTimeConstants },
    ) {
        if (game.mode === GameMode.LimitedTime) {
            this.timerConstant = game.timerConstant as GameTimeConstants;
        }
        this.info = game.info;
        this.mode = game.mode;
        this.players = new Map();
        this.isMulti = player.isMulti;
        this.getNbDifferencesFound = new Map();
        this.getNbDifferencesTotalFound = new Set();
        this.addPlayer(player.player);
        this.context = new GameContext(game.mode as GameMode, new InitGameState(), player.isMulti);
        this.id = v4();
        this.context.next();
    }

    get identifier() {
        return this.id;
    }

    get gameMode() {
        return this.mode;
    }

    get multi() {
        return this.isMulti;
    }

    get information() {
        return this.info;
    }

    get status(): GameStatus {
        return this.context.gameState();
    }

    setEndgame() {
        this.context.end();
    }

    setInfo(gameInfo: PrivateGameInformation) {
        this.info = gameInfo;
    }

    nextIndex() {
        this.currentIndex++;
    }

    isDifferenceFound(playerId: string, differenceCoords: Coordinate) {
        const differences = this.findDifference(differenceCoords);
        if (!differences || this.isDifferenceAlreadyFound(differences)) {
            return null;
        }
        this.addCoordinatesOnDifferenceFound(playerId, differences);
        return differences;
    }

    next() {
        this.context.next();
    }

    isGameInitialize() {
        return this.status === GameStatus.InitGame || this.status === GameStatus.InitTimer;
    }

    getNbDifferencesThreshold() {
        if (this.isEven(this.info.differences.length)) {
            return this.info.differences.length / 2;
        } else {
            return Math.trunc(this.info.differences.length / 2) + 1;
        }
    }

    getAllDifferencesNotFound() {
        return this.info.differences.filter((difference: Coordinate[]) => !this.getNbDifferencesTotalFound.has(difference));
    }

    isEven(number: number) {
        return number % 2 === 0;
    }

    isGameOver() {
        return this.context.gameState() === GameStatus.EndGame;
    }

    nbDifferencesLeft(): number {
        return this.info.differences.length - this.getNbDifferencesTotalFound.size;
    }

    isGameFull() {
        return (!this.isMulti && this.players.size === 1) || (this.isMulti && this.players.size === 2);
    }

    addPlayer(player: User) {
        if (this.isGameFull()) {
            return;
        }
        this.players.set(player.id, player.name);
        this.getNbDifferencesFound.set(player.id, new Set());
    }

    findPlayer(playerId: string) {
        return this.players.get(playerId);
    }

    leaveGame(playerId: string) {
        const player = this.findPlayer(playerId);
        if (!player) {
            return;
        }
        this.players.delete(playerId);
        this.context.transitionTo(new EndGameState());
    }

    hasNoPlayer() {
        return this.players.size === 0;
    }
}
