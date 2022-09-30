import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { SinonSpiedInstance, spy } from 'sinon';
import { GameContext } from '@app/classes/game-context/game-context';
import { expect } from 'chai';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { GameMode } from '@app/enum/game-mode';

describe('InitialGameState', () => {
    let state: InitGameState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new InitGameState();
        gameContext = new GameContext(GameMode.Classic, state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });

    it('should get a status', () => {
        expect(state.status()).to.equal('InitGame');
    });

    it('should go to the next state', () => {
        const expectedNewState = new InitTimerState();
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
