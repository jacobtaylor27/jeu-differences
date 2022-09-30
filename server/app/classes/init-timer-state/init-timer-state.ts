import { GameState } from '@app/classes/game-state/game-state';
import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { GameStatus } from '@app/enum/game-status';
import { GameMode } from '@app/enum/game-mode';

export class InitTimerState extends GameState {
    next(): void {
        if (this.context.gameMode === GameMode.Classic) {
            this.context.transitionTo(new FindDifferenceState());
        } else {
            this.context.transitionTo(new PlayerOneTourState());
        }
    }

    status(): GameStatus {
        return GameStatus.InitTimer;
    }
}
