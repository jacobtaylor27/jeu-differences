import { GameContext } from '@app/classes/game-context/game-context';
import { GameStatus } from '@app/enum/game-status';

export abstract class GameState {
    context: GameContext;

    setContext(context: GameContext) {
        this.context = context;
    }

    abstract next(): void;
    abstract status(): GameStatus;
}
