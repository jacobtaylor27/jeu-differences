import { GameState } from '@app/classes/game-state/game-state';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { GameStatus } from '@app/enum/game-status';

export class InitGameState extends GameState {
    next() {
        this.context.transitionTo(new InitTimerState());
    }
    status(): string {
        return GameStatus.InitGame;
    }
}
