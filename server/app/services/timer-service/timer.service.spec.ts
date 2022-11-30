import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { TimerService } from '@app/services/timer-service/timer.service';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { restore, SinonFakeTimers, useFakeTimers } from 'sinon';
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
});
