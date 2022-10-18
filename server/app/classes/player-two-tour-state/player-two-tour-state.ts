import { GameState } from '@app/classes/game-state/game-state';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class PlayerTwoTourState extends GameState {
    // eslint-disable-next-line no-unused-vars
    next(isMulti: boolean): void {
        this.context.transitionTo(new PlayerOneTourState());
    }

    status(): GameStatus {
        return GameStatus.PlayerTwoTour;
    }
}
