import { GameContext } from '@app/classes/game-context/game-context';

export abstract class GameState {
    context: GameContext;

    setContext(context: GameContext) {
        this.context = context;
    }

    abstract next(): void;
    abstract status(): string;
}
