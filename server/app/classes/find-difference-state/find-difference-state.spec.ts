import { SinonSpiedInstance, spy } from 'sinon';
import { GameContext } from '@app/classes/game-context/game-context';
import { expect } from 'chai';
import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { FindDifferenceState } from './find-difference-state';
import { GameMode } from '@app/enum/game-mode';

describe('PlayerOneTourState', () => {
    let state: FindDifferenceState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;
    beforeEach(() => {
        state = new FindDifferenceState();
        gameContext = new GameContext(GameMode.Classic, state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });
    it('should get a status', () => {
        expect(state.status()).to.equal('FindDifference');
    });
    it('should go to the next state', () => {
        const expectedNewState = new EndGameState();
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
