import { GameState } from '@app/classes/game-state/game-state';

export class GameContext {
    private state: GameState;
    private mode: string;

    constructor(mode: string, state: GameState) {
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

    gameState(): string {
        return this.state.status();
    }
}
