import { GameState } from '@app/classes/game-state/game-state';
import { PlayerTwoTourState } from '@app/classes/player-two-tour-state/player-two-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class PlayerOneTourState extends GameState {
    next(): void {
        this.context.transitionTo(new PlayerTwoTourState());
    }
    status(): string {
        return GameStatus.PlayerOneTour;
    }
}
