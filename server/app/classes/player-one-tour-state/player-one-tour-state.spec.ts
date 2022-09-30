import { SinonSpiedInstance, spy } from 'sinon';
import { GameContext } from '@app/classes/game-context/game-context';
import { expect } from 'chai';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { PlayerTwoTourState } from '@app/classes/player-two-tour-state/player-two-tour-state';
import { GameMode } from '@app/enum/game-mode';

describe('PlayerOneTourState', () => {
    let state: PlayerOneTourState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new PlayerOneTourState();
        gameContext = new GameContext(GameMode.Classic, state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });

    it('should get a status', () => {
        expect(state.status()).to.equal('PlayerOneTour');
    });

    it('should go to the next state', () => {
        const expectedNewState = new PlayerTwoTourState();
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
