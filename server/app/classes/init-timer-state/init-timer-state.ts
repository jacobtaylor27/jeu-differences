import { GameState } from '@app/classes/game-state/game-state';
import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';

export class InitTimerState extends GameState {
    next(): void {
        if (this.context.gameMode === 'Classic') {
            this.context.transitionTo(new FindDifferenceState());
        } else {
            this.context.transitionTo(new PlayerOneTourState());
        }
    }

    status(): string {
        return 'InitTimer';
    }
}
