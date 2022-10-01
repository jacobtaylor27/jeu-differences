import { DB_URL } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameInfo } from '@common/game-info';
import { Score } from '@common/score';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('GameInfo service', async () => {
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

    it('getGameById(id) should return a game according to a specific id', async () => {
        expect(await gameService.getGameById('0')).to.deep.equal(DEFAULT_GAME[0]);
    });

    it('getGameById(id) should return undefined if the specific id is out of range', async () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(await gameService.getGameById('5')).to.equal(undefined);
    });

    it('getAllGame() should return all of the games', async () => {
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.deleteGameById('0')).to.equal(true);
        expect(await gameService.getAllGames()).to.deep.equal([]);
    });

    it('addGame(game) should add a game to the game collection, getAllGames() should return them', async () => {
        const score: Score = {
            playerName: 'Jacob',
            time: 22,
        };
        const game: GameInfo = {
            id: '1',
            idOriginalBmp: '0',
            idEditedBmp: '0',
            idDifferenceBmp: '0',
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Mark',
            differenceRadius: 1,
            differences: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGame(game)).to.equal(true);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length + 1);
    });

    it("addGame(game) shouldn't add a game twice", async () => {
        const score: Score = {
            playerName: 'Laurie',
            time: 22,
        };
        const game: GameInfo = {
            id: '2',
            idOriginalBmp: '0',
            idEditedBmp: '0',
            idDifferenceBmp: '0',
            soloScore: [score],
            multiplayerScore: [score],
            name: 'Laurie',
            differenceRadius: 3,
            differences: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGame(game)).to.equal(true);
        expect(await gameService.addGame(game)).to.equal(false);
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length + 1);
    });

    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        expect(await gameService.deleteGameById('0')).to.equal(true);
        expect((await gameService.getAllGames()).length).to.equal(0);
    });

    it('deleteGameBy(id) should return false when trying to delete the same game twice', async () => {
        expect(await gameService.deleteGameById('0')).to.equal(true);
        expect((await gameService.getAllGames()).length).to.equal(0);
        expect(await gameService.deleteGameById('0')).to.equal(false);
        expect(await gameService.deleteGameById('0')).to.equal(false);
    });
});
