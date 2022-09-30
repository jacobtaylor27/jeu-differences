import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { GameInfo } from '@common/game-info';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { uuid } from 'uuidv4';
import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';

export class Game {
    players: string[];
    private id: string;
    private info: GameInfo;
    private differenceFound: Set<BmpCoordinate[]>;
    private context: GameContext;

    constructor(mode: string, players: string[], info: GameInfo) {
        this.info = info;
        this.players = players;
        this.differenceFound = new Set();
        this.context = new GameContext(mode as GameMode, new InitGameState());
        this.id = uuid();
        this.context.next();
        this.context.next(); // go directly to the Found Difference State because timer is not initialize in the server for now
    }

    get identifier() {
        return this.id;
    }

    status(): GameStatus {
        return this.context.gameState();
    }

    differenceFounded() {
        this.differenceFound++;
        if (this.isAllDifferenceFound() && !this.isGameOver()) {
            this.context.next();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: BmpCoordinate[]) {
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
