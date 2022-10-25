import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { GameState } from '@app/classes/game-state/game-state';
import { PlayerOneTurnState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class InitTimerState extends GameState {
    next(isMulti: boolean): void {
        if (isMulti) {
            this.context.transitionTo(new PlayerOneTurnState());
            return;
        }
        this.context.transitionTo(new FindDifferenceState());
    }

    status(): GameStatus {
        return GameStatus.InitTimer;
    }
}
