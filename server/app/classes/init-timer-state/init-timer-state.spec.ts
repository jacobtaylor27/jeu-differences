import { SinonSpiedInstance, spy } from 'sinon';
import { GameContext } from '@app/classes/game-context/game-context';
import { expect } from 'chai';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';

describe('InitialTimerState', () => {
    let state: InitTimerState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;
    beforeEach(() => {
        state = new InitTimerState();
        gameContext = new GameContext('Classic', state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });
    it('should get a status', () => {
        expect(state.status()).to.equal('InitTimer');
    });
    it('should go to the next state', () => {
        const expectedNewStateClassic = new FindDifferenceState();
        const expectedNewStateOther = new PlayerOneTourState();
        gameContext['mode'] = 'Classic';
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewStateClassic.status());
        gameContext['mode'] = '';
        state.next();
        expect(gameContextSpyObj.transitionTo.callCount).to.equal(2);
        expect(gameContext.gameState()).to.equal(expectedNewStateOther.status());
    });
});
