import { GameState } from '@app/classes/game-state/game-state';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';

export class InitGameState extends GameState {
    next() {
        this.context.transitionTo(new InitTimerState());
    }
    status(): string {
        return 'InitGame';
    }
}
