import { GameState } from '@app/classes/game-state/game-state';
import { GameStatus } from '@app/enum/game-status';

export class EndGameState extends GameState {
    next(): void {
        return;
    }
    status(): GameStatus {
        return GameStatus.EndGame;
    }
}
