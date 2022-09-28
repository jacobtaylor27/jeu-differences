import { GameState } from '@app/classes/game-state/game-state';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';

export class GameContext {
    private state: GameState;
    private mode: GameMode;

    constructor(mode: GameMode, state: GameState) {
        this.state = state;
        this.mode = mode;
    }

    get gameMode() {
        return this.mode;
    }

    next() {
        this.state.next();
    }

    transitionTo(newState: GameState) {
        this.state = newState;
    }

    gameState(): GameStatus {
        return this.state.status();
    }
}
