import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
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
}
