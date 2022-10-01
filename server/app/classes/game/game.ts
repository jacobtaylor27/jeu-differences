import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { GameInfo } from '@common/game-info';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { v4 } from 'uuid';
import { Coordinate } from '@common/coordinate';

export class Game {
    players: string[];
    private id: string;
    private info: GameInfo;
    private differenceFound: Set<Coordinate[]>;
    private context: GameContext;

    constructor(mode: string, players: string[], info: GameInfo) {
        this.info = info;
        this.players = players;
        this.differenceFound = new Set();
        this.context = new GameContext(mode as GameMode, new InitGameState());
        this.id = v4();
        this.context.next();
        this.context.next(); // go directly to the Found Difference State because timer is not initialize in the server for now
    }

    get identifier() {
        return this.id;
    }

    get information() {
        return this.info;
    }

    status(): GameStatus {
        return this.context.gameState();
    }

    findDifference(differenceCoords: Coordinate) {
        return this.info.differences.find((difference: Coordinate[]) => difference.find((coord: Coordinate) => coord === differenceCoords));
    }

    isDifferenceFound(differenceCoords: Coordinate) {
        const differences = this.findDifference(differenceCoords);
        if (!differences || this.isDifferenceAlreadyFound(differences)) {
            return null;
        }
        this.differenceFounded(differences);
        return differences;
    }

    differenceFounded(differenceCoords: Coordinate[]) {
        if (this.isDifferenceAlreadyFound(differenceCoords)) {
            return;
        }
        this.differenceFound.add(differenceCoords);
        if (this.isAllDifferenceFound() && !this.isGameOver()) {
            this.context.next();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: Coordinate[]) {
        return this.differenceFound.has(differenceCoords);
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
        return this.info.differences.length === this.differenceFound.size;
    }

    isGameOver() {
        return this.context.gameState() === GameStatus.EndGame;
    }

    differenceLeft(): number {
        return this.info.differences.length - this.differenceFound.size;
    }
}
