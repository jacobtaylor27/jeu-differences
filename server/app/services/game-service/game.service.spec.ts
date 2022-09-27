import { DB_URL } from '@app/constants/database';
import { DEFAULT_GAMES } from '@app/constants/default-games';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameService } from '@app/services/game-service/game.service';
import { Game } from '@common/game';
import { Score } from '@common/score';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

describe('Game service', () => {
    let gameService: GameService;
    let databaseService: SinonStubbedInstance<DatabaseService>;

    beforeEach(async () => {
        databaseService = createStubInstance(DatabaseService);
        gameService = new GameService(databaseService);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
        // databaseService.getGames.resolves(basicGames);)
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('addGame() should add a game to the game collection, getAllGames() should return them', async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differences: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length);
        await gameService.addGame(game);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length + 1);
    });

    it("addGame() should't add a game twice", async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differences: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length);
        await gameService.addGame(game);
        await gameService.addGame(game);
        await gameService.addGame(game);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length + 1);
    });

    it('getGameById(id) should return a game according to a specific id', async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differences: [],
        };
        expect(await gameService.getGameById(0)).to.deep.equal(game);
    });
    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differences: [],
        };
        expect(await gameService.addGame(game));
        await gameService.deleteGameById(0);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length);
    });
});
