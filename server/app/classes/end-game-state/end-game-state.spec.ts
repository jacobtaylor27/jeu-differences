import { SinonSpiedInstance, spy } from 'sinon';
import { GameContext } from '@app/classes/game-context/game-context';
import { expect } from 'chai';
import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameMode } from '@app/enum/game-mode';

describe('EndGame', () => {
    let state: EndGameState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new EndGameState();
        gameContext = new GameContext(GameMode.Classic, state);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });

    it('should get a status', () => {
        expect(state.status()).to.equal('EndGame');
    });

    it('should go to the next state', () => {
        state.next();
        expect(gameContextSpyObj.transitionTo.called).to.equal(false);
    });
});
