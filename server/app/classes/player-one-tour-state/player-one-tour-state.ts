import { GameState } from '@app/classes/game-state/game-state';
import { PlayerTwoTourState } from '@app/classes/player-two-tour-state/player-two-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class PlayerOneTourState extends GameState {
    // eslint-disable-next-line no-unused-vars
    next(isMulti: boolean): void {
        this.context.transitionTo(new PlayerTwoTourState());
    }

    status(): GameStatus {
        return GameStatus.PlayerOneTour;
    }
}
