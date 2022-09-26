import { DatabaseService } from '@app/services/database-service/database.service';
import { GameService } from '@app/services/game-service/game.service';
import { Game } from '@common/game';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

describe('Game service', () => {
    let gameService: GameService;
    let databaseService: SinonStubbedInstance<DatabaseService>;

    beforeEach(async () => {
        const game0: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            bestScores: [],
            name: 'firstGame',
            differences: [],
        };
        const game1: Game = {
            id: 1,
            idOriginalBmp: 1,
            idEditedBmp: 1,
            idDifferenceBmp: 1,
            bestScores: [],
            name: 'secondGame',
            differences: [],
        };
        const game2: Game = {
            id: 2,
            idOriginalBmp: 2,
            idEditedBmp: 2,
            idDifferenceBmp: 2,
            bestScores: [],
            name: 'thirdGame',
            differences: [],
        };
        const basicGames: Game[] = [game0, game1, game2];

        databaseService = createStubInstance(DatabaseService);
        databaseService.getGames.resolves(basicGames);
        gameService = new GameService(databaseService);
    });

    it('initiation should fill the array of games with 3 basic games', async () => {
        expect((await gameService.getAllGames()).length).to.equal(0);
        await gameService.initialiseGames();
        expect((await gameService.getAllGames()).length).to.equal(3);
    });
});
