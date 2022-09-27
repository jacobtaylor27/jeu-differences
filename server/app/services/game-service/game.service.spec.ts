import { DB_URL } from '@app/constants/database';
import { DEFAULT_GAMES } from '@app/constants/default-games';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameService } from '@app/services/game-service/game.service';
import { Game } from '@common/game';
import { Score } from '@common/score';
import { expect } from 'chai';

describe('Game service', () => {
    let gameService: GameService;
    let databaseService: DatabaseService;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameService = new GameService(databaseService as any);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('getGameById(id) should return a game according to a specific id', async () => {
        expect(await gameService.getGameById(0)).to.deep.equals(DEFAULT_GAMES[0]);
    });

    it('getGameById(id) should return undefined if the specific id is out of range', async () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(await gameService.getGameById(5)).to.equal(undefined);
    });

    it('addGame() should add a game to the game collection, getAllGames() should return them', async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: Game = {
            id: 1,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differences: [],
        };
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length);
        await gameService.addGame(game);
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length + 1);
    });

    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        await gameService.deleteGameById(1);
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length);
    });

    it("addGame() shouldn't add a game twice", async () => {
        const score: Score = {
            playerName: 'Laurie',
            time: 22,
        };
        const game: Game = {
            id: 2,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Laurie',
            differences: [],
        };
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length);
        expect(await gameService.addGame(game)).to.equal(true);
        expect(await gameService.addGame(game)).to.equal(false);
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length + 1);
    });

    it('deleteGameBy(id) should throw an error when trying to delete the same game twice', async () => {
        await gameService.deleteGameById(2);
        expect((await gameService.getAllGames())?.length).to.equal(DEFAULT_GAMES.length);

        try {
            await gameService.deleteGameById(2);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
