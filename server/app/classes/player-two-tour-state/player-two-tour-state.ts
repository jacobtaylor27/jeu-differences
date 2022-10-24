import { GameState } from '@app/classes/game-state/game-state';
import { PlayerOneTurnState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class PlayerTwoTurnState extends GameState {
    // eslint-disable-next-line no-unused-vars
    next(isMulti: boolean): void {
        this.context.transitionTo(new PlayerOneTurnState());
    }

    status(): GameStatus {
        return GameStatus.PlayerTwoTour;
    }
}
