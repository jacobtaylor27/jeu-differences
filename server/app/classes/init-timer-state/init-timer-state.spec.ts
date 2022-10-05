import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { GameMode } from '@app/enum/game-mode';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';

describe('InitialTimerState', () => {
    let state: InitTimerState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;
    beforeEach(() => {
        state = new InitTimerState();
        gameContext = new GameContext(GameMode.Classic, state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });
    it('should get a status', () => {
        expect(state.status()).to.equal('InitTimer');
    });
    it('should go to the next state', () => {
        const expectedNewStateClassic = new FindDifferenceState();
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewStateClassic.status());
    });
});
