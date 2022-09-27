import { GameState } from './game-state';
import { expect } from 'chai';
import { describe } from 'mocha';
import { GameContext } from '@app/classes/game-context/game-context';

class MockGameState extends GameState {
    next(): void {
        return;
    }
    status(): string {
        return 'test';
    }
}

describe('GameState', () => {
    let state: GameState;

    beforeEach(() => {
        state = new MockGameState();
    });

    it('should set the context', () => {
        const expectedGameContext = new GameContext('', state);
        state.setContext(expectedGameContext);
        expect(state.context).to.equal(expectedGameContext);
    });
});
