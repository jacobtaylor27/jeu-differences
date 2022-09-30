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

    it('should create a game', async () => {
        expect(await gameManager.createGame(['test'], 'classic', 0)).to.equal(gameManager['games'][0].identifier);
        expect(gameInfoSpyObj.getGameById.called).to.equal(true);
        expect(gameManager['games'].length).not.to.equal(0);
    });

    it('should check if the game is found', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => {
            return {} as Game;
        });
        expect(gameManager.isGameFound('')).to.equal(true);
        expect(findGameSpy.called).to.equal(true);

        findGameSpy.callsFake(() => {
            return undefined;
        });
        expect(gameManager.isGameFound('')).to.equal(false);
    });

    afterEach(() => {
        restore();
    });
});
