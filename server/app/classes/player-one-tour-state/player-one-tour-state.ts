import { GameState } from '@app/classes/game-state/game-state';

export class PlayerOneTourState extends GameState {
    next(): void {
        this.context.transitionTo(new GameState());
    }
    status(): string {
        return 'PlayerOneTour';
    }
}
