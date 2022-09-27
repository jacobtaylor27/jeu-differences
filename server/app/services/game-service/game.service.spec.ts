import { DB_URL } from '@app/constants/database';
import { DEFAULT_GAMES } from '@app/constants/default-games';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { GameService } from '@app/services/game-service/game.service';
import { Game } from '@common/game';
import { Score } from '@common/score';
import { expect } from 'chai';

describe('Game service', () => {
    let gameService: GameService;
    let databaseService: DatabaseServiceMock;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameService = new GameService(databaseService as any);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
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

    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        await gameService.deleteGameById(0);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length);
    });

    it("addGame() shouldn't add a game twice", async () => {
        const score: Score = {
            playerName: 'Laurie',
            time: 22,
        };
        const game: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Laurie',
            differences: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length);
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
});
