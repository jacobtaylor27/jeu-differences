import { GameState } from '@app/classes/game-state/game-state';
import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameStatus } from '@app/enum/game-status';

export class FindDifferenceState extends GameState {
    next() {
        this.context.transitionTo(new EndGameState());
    }
    status(): string {
        return GameStatus.FindDifference;
    }
}
