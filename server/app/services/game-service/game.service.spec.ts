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
        // databaseService.getGames.resolves(basicGames);)
        gameService = new GameService(databaseService);
    });

    it('addGame() should add a game to the game collection', async () => {
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
        expect(await gameService.addGame(game));
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAMES.length + 1);
    });
});
