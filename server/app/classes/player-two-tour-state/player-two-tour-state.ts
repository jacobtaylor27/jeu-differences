import { GameState } from '@app/classes/game-state/game-state';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';

export class PlayerTwoTourState extends GameState {
    next(): void {
        // check if the game is not finish
        this.context.transitionTo(new PlayerOneTourState());
    }

    status(): string {
        return 'PlayerTwoTour';
    }
}
