import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameMode } from '@common/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Coordinate } from '@common/coordinate';
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
    private getNbDifferencesFound: Map<string, Set<Coordinate[]>>;
    private getNbDifferencesTotalFound: Set<Coordinate[]>;
    private context: GameContext;
    private initialTime: Date;

    constructor(mode: GameMode, playerInfo: { player: User; isMulti: boolean }, info: PrivateGameInformation) {
        this.info = info;
        this.mode = mode;
        this.players = new Map();
        this.isMulti = playerInfo.isMulti;
        this.getNbDifferencesFound = new Map();
        this.getNbDifferencesTotalFound = new Set();
        this.addPlayer(playerInfo.player);
        this.context = new GameContext(mode as GameMode, new InitGameState(), playerInfo.isMulti);
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

    get seconds() {
        return this.calculateTime();
    }

    setInfo(gameInfo: PrivateGameInformation) {
        this.info = gameInfo;
    }

    nextIndex() {
        this.currentIndex++;
    }

    setTimer() {
        this.initialTime = new Date();
        this.context.next();
    }

    calculateTime(): number {
        const presentTime = new Date();
        if (this.mode === GameMode.Classic) {
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            return Math.floor((presentTime.getTime() - this.initialTime.getTime()) / 1000);
        } else {
            // TO DO : ADD ADMINS TIME
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            const time = 60 - Math.floor((presentTime.getTime() - this.initialTime.getTime()) / 1000);
            if (time === 0) {
                this.context.end();
            }
            return time;
        }
    }

    findDifference(differenceCoords: Coordinate): Coordinate[] | undefined {
        return this.info.differences.find((difference: Coordinate[]) =>
            difference.find((coord: Coordinate) => coord.x === differenceCoords.x && coord.y === differenceCoords.y),
        );
    }

    isDifferenceFound(playerId: string, differenceCoords: Coordinate) {
        const differences = this.findDifference(differenceCoords);
        if (!differences || this.isDifferenceAlreadyFound(differences)) {
            return null;
        }
        this.addCoordinatesOnDifferenceFound(playerId, differences);
        return differences;
    }

    addCoordinatesOnDifferenceFound(playerId: string, differenceCoords: Coordinate[]) {
        const player = this.getNbDifferencesFound.get(playerId);
        if (this.isDifferenceAlreadyFound(differenceCoords) || !player) {
            return;
        }
        this.getNbDifferencesTotalFound.add(differenceCoords);
        player.add(differenceCoords);
        if (this.isAllDifferenceFound(playerId) && !this.isGameOver()) {
            this.context.end();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: Coordinate[]) {
        return this.getNbDifferencesTotalFound.has(differenceCoords);
    }

    next() {
        this.context.next();
    }

    isGameInitialize() {
        return this.status === GameStatus.InitGame || this.status === GameStatus.InitTimer;
    }

    isAllDifferenceFound(playerId: string): boolean {
        const player = this.getNbDifferencesFound.get(playerId);

        // if the game is already over all the differences are found and if the game is not initialize, 0 difference found
        if (this.isGameInitialize() || this.isGameOver() || !player) {
            return this.isGameOver();
        }

        return this.isMulti ? player.size === this.getNbDifferencesThreshold() : player.size === this.info.differences.length;
    }

    getNbDifferencesThreshold() {
        if (this.isEven(this.info.differences.length)) {
            return this.info.differences.length / 2;
        } else {
            return Math.trunc(this.info.differences.length / 2) + 1;
        }
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
