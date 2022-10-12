import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { GameState } from '@app/classes/game-state/game-state';
import { GameStatus } from '@app/enum/game-status';

export class InitTimerState extends GameState {
    next(): void {
        this.context.transitionTo(new FindDifferenceState()); // change to switch limited or classic mode different state machine
    }

    status(): GameStatus {
        return GameStatus.InitTimer;
    }
}
