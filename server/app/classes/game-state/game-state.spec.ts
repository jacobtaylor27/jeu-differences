import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { expect } from 'chai';
import { describe } from 'mocha';
import { GameState } from './game-state';

class MockGameState extends GameState {
    next(): void {
        return;
    }
    status(): GameStatus {
        return 'test' as GameStatus;
    }
}

describe('GameState', () => {
    let state: GameState;

    beforeEach(() => {
        state = new MockGameState();
    });

    it('should set the context', () => {
        const expectedGameContext = new GameContext(GameMode.Classic, state, true);
        state.setContext(expectedGameContext);
        expect(state.context).to.equal(expectedGameContext);
    });
});
