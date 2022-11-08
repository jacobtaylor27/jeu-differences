import { GameState } from '@app/classes/game-state/game-state';
import { PlayerTwoTurnState } from '@app/classes/player-two-tour-state/player-two-tour-state';
import { GameStatus } from '@app/enum/game-status';

export class PlayerOneTurnState extends GameState {
    // eslint-disable-next-line no-unused-vars -- need multi elsewhere
    next(isMulti: boolean): void {
        this.context.transitionTo(new PlayerTwoTurnState());
    }

    status(): GameStatus {
        return GameStatus.PlayerOneTour;
    }
}
