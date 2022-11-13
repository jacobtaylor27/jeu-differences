import { GameContext } from '@app/classes/game-context/game-context';
import { PlayerOneTurnState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { PlayerTwoTurnState } from '@app/classes/player-two-tour-state/player-two-tour-state';
import { GameMode } from '@common/game-mode';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';

describe('PlayerTwoTour', () => {
    let state: PlayerTwoTurnState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new PlayerTwoTurnState();
        gameContext = new GameContext(GameMode.Classic, state, true);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });

    it('should get a status', () => {
        expect(state.status()).to.equal('PlayerTwoTour');
    });

    it('should go to the next state', () => {
        const expectedNewState = new PlayerOneTurnState();
        state.next(true);
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
