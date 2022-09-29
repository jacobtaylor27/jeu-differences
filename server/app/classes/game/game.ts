import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { GameInfo } from '@common/game-info';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { uuid } from 'uuidv4';
export class Game {
    players: string[];
    private id: string;
    private info: GameInfo;
    private differenceFound: number;
    private context: GameContext;

    constructor(mode: string, players: string[], info: GameInfo) {
        this.info = info;
        this.players = players;
        this.differenceFound = 0;
        this.context = new GameContext(mode as GameMode, new InitGameState());
        this.id = uuid();
        this.context.next();
        this.context.next(); // go directly to the Found Difference State because timer is not initialize in the server for now
    }
