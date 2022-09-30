import { SinonSpiedInstance, stub, restore } from 'sinon';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { Game } from '@app/classes/game/game';
import { GameInfo } from '@common/game-info';

describe('GameManagerService', () => {
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameService>;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        const gameInfo = new GameService({} as DatabaseService, {} as IdGeneratorService);
        const differenceService = new BmpDifferenceInterpreter();
        gameInfoSpyObj = stub(gameInfo);
        // differenceSpyObj = spy(differenceService);
        gameManager = new GameManagerService(gameInfo, differenceService);
    });

    afterEach(() => {
        restore();
    });
});
