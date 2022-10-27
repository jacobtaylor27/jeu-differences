import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { User } from '@app/interface/user';
import { Coordinate } from '@common/coordinate';
import { v4 } from 'uuid';

export class Game {
    players: Map<string, string>;
    private id: string;
    private isMulti: boolean;
    private info: PrivateGameInformation;
    private getNbDifferencesFound: Set<Coordinate[]>;
    private context: GameContext;
    private initialTime: Date;

    constructor(mode: string, playerInfo: { player: User; isMulti: boolean }, info: PrivateGameInformation) {
        this.info = info;
        this.players = new Map();
        this.players.set(playerInfo.player.id, playerInfo.player.name);
        this.isMulti = playerInfo.isMulti;
        this.getNbDifferencesFound = new Set();
        this.context = new GameContext(mode as GameMode, new InitGameState(), playerInfo.isMulti);
        this.id = v4();
        this.context.next();
        // go directly to the Found Difference State because timer is not initialize in the server for now
    }

    get identifier() {
        return this.id;
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

    setTimer() {
        this.initialTime = new Date();
        this.context.next();
    }

    calculateTime(): number {
        const presentTime = new Date();
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
        return Math.floor((presentTime.getTime() - this.initialTime.getTime()) / 1000);
    }

    findDifference(differenceCoords: Coordinate): Coordinate[] | undefined {
        return this.info.differences.find((difference: Coordinate[]) =>
            difference.find((coord: Coordinate) => coord.x === differenceCoords.x && coord.y === differenceCoords.y),
        );
    }

    isDifferenceFound(differenceCoords: Coordinate) {
        const differences = this.findDifference(differenceCoords);
        if (!differences || this.isDifferenceAlreadyFound(differences)) {
            return null;
        }
        this.addCoordinatesOnDifferenceFound(differences);
        return differences;
    }

    addCoordinatesOnDifferenceFound(differenceCoords: Coordinate[]) {
        if (this.isDifferenceAlreadyFound(differenceCoords)) {
            return;
        }
        this.getNbDifferencesFound.add(differenceCoords);
        if (this.isAllDifferenceFound() && !this.isGameOver()) {
            this.context.next();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: Coordinate[]) {
        return this.getNbDifferencesFound.has(differenceCoords);
    }

    next() {
        this.context.next();
    }

    isGameInitialize() {
        return this.context.gameState() === GameStatus.InitGame || this.context.gameState() === GameStatus.InitTimer;
    }

    isAllDifferenceFound(): boolean {
        if (this.isGameInitialize() || this.isGameOver()) {
            return this.isGameOver(); // if the game is already over all the difference are found and if the game is not initialize 0 difference found
        }
        return this.info.differences.length === this.getNbDifferencesFound.size;
    }

    isGameOver() {
        return this.context.gameState() === GameStatus.EndGame;
    }

    nbDifferencesLeft(): number {
        return this.info.differences.length - this.getNbDifferencesFound.size;
    }

    isGameFull() {
        return (!this.isMulti && this.players.size === 1) || (this.isMulti && this.players.size === 2);
    }

    addPlayer(player: User) {
        if ((this.isMulti && this.isGameFull()) || !this.isMulti) {
            return;
        }
        this.players.set(player.id, player.name);
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
