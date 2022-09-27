import { GameState } from '@app/classes/game-state/game-state';

export class EndGameState extends GameState {
    next(): void {
        return;
    }
    status(): string {
        return 'EndGame';
    }
}
