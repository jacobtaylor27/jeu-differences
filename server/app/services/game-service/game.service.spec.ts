import { DatabaseService } from '@app/services/database-service/database.service';
import { GameService } from '@app/services/game-service/game.service';
import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
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

    it('initialiseGames() should fill the array of games with 3 basic games', async () => {
        expect((await gameService.getAllGames()).length).to.equal(0);
        await gameService.initialiseGames();
        expect((await gameService.getAllGames()).length).to.equal(3);
    });

    it('addGame(game) should add a game to the array of games', async () => {
        await gameService.initialiseGames();
        expect((await gameService.getAllGames()).length).to.equal(3);
        const newGame: Game = {
            id: 3,
            idOriginalBmp: 3,
            idEditedBmp: 3,
            idDifferenceBmp: 3,
            bestScores: [],
            name: 'fourthGame',
            differences: [],
        };
        expect(await gameService.addGame(newGame)).to.equal(true);
        expect(await gameService.addGame(newGame)).to.equal(false);
        const resultingNbOfGame = 4;
        const resultingGames = await gameService.getAllGames();
        expect(resultingGames.length).to.equal(resultingNbOfGame);
        expect(resultingGames[3]).to.deep.equal(newGame);
    });

    it('getGameById(id) should return the proper game according to an id', async () => {
        await gameService.initialiseGames();
        const game0: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            bestScores: [],
            name: 'firstGame',
            differences: [],
        };
        const correspondingId = 0;
        expect(await gameService.getGameById(correspondingId)).to.deep.equal(game0);
        const missingId = 10;
        expect(await gameService.getGameById(missingId)).to.equal(undefined);
    });

    it('getGameCardbyId(id) should return the corresponding gameCard', async () => {
        await gameService.initialiseGames();

        const expectedGameCard: GameCard = {
            id: 0,
            idOriginalBmp: 0,
            bestScores: [],
            name: 'firstGame',
        };
        expect(await gameService.getGameCardById(0)).to.deep.equal(expectedGameCard);
        const missingId = 10;
        expect(await gameService.getGameCardById(missingId)).to.equal(undefined);
    });
});

/*
    .getGameCardById
    .getAllGameCards
    .deleteGameById
*/
