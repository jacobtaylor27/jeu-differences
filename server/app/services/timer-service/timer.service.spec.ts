import { Game } from '@app/classes/game/game';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { TimerService } from '@app/services/timer-service/timer.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { User } from '@common/user';
import { expect } from 'chai';
import { restore, SinonFakeTimers, stub, useFakeTimers } from 'sinon';
import { Container } from 'typedi';

describe('TimerService', () => {
    let gameTimerConstant: GameTimeConstantService;
    let difference: DifferenceService;
    let timer: TimerService;
    let clock: SinonFakeTimers;
    let game: Game;

    beforeEach(() => {
        difference = Container.get(DifferenceService);
        gameTimerConstant = Container.get(GameTimeConstantService);
        timer = new TimerService(difference, gameTimerConstant);
        game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        clock = useFakeTimers();
    });

    afterEach(() => {
        restore();
        clock.restore();
    });

    it('should set timer', () => {
        timer.setTimer(game);
        expect(timer['initialTime'].get(game.identifier)?.getDate()).to.equal(new Date().getDate());
        expect(game.status).to.equal(GameStatus.FindDifference);
    });

    it('should get the seconds of the timer of the game', () => {
        stub(timer, 'calculateTime').callsFake(() => 2);
        expect(timer.seconds(game)).to.equal(2);
    });

});
