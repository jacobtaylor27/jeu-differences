import { Game } from '@app/classes/game/game';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { Service } from 'typedi';

@Service()
export class TimerService {
    private timerConstant: Map<string, GameTimeConstants>;
    private initialTime: Map<string, Date>;

    constructor(private differences: DifferenceService, private timeConstant: GameTimeConstantService) {
        this.timerConstant = new Map();
        this.initialTime = new Map();
    }

    seconds(game: Game) {
        return this.calculateTime(game);
    }


    setTimer(game: Game) {
        this.initialTime.set(game.identifier, new Date());
        game.next();
    }

    calculateLimitedGameTimer(gameId: string): number {
        const presentTime = new Date();
        const time = this.gameTime(gameId);
        const totalDifferenceFound = this.differences.totalDifferenceFound(gameId);
        if (!time || !totalDifferenceFound) {
            return 0;
        }
        let timer =
            time.constant.gameTime -
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            Math.floor((presentTime.getTime() - time.init.getTime()) / 1000) +
            time.constant.successTime * totalDifferenceFound.size -
            time.constant.penaltyTime * 0; // TO DO : multiply by the nb of clue activate
        if (timer > 120) {
            const differenceLimitTime = timer - 120;
            time.init.setTime(time.init.getTime() - differenceLimitTime * 1000);
            timer -= differenceLimitTime;
        }
        return timer;
    }

    calculateTime(game: Game): number {
        const presentTime = new Date();
        const time = this.initialTime.get(game.identifier);
        if (!time) {
            return 0;
        }
        if (game.gameMode === GameMode.Classic) {
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            return Math.floor((presentTime.getTime() - time.getTime()) / 1000);
        } else {
            // TO DO : ADD ADMINS TIME
            const limitedTime = this.calculateLimitedGameTimer(game.identifier);
            if (limitedTime === 0) {
                game.setEndgame();
            }
            return limitedTime;
        }
    }
}
