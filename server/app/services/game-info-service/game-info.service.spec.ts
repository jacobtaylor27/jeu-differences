import { Bmp } from '@app/classes/bmp/bmp';
import { DB_URL } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { DEFAULT_GAMES } from '@app/services/game-info-service/game-info.service.contants.spec';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { expect } from 'chai';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as sinon from 'sinon';
import { stub } from 'sinon';
import { Container } from 'typedi';

describe.only('GameInfo Service', async () => {
    let gameInfoService: GameInfoService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpService: BmpService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let databaseService: DatabaseServiceMock;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;
    let bmpEncoderService: BmpEncoderService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        databaseService = new DatabaseServiceMock();
        bmpEncoderService = Container.get(BmpEncoderService);
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        gameInfoService = new GameInfoService(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            databaseService as any,
            bmpService,
            bmpSubtractorService,
            bmpDifferenceService,
            idGeneratorService,
            bmpEncoderService,
        );

        gameInfoService['srcPath'] = tmpdir();
        await databaseService.start(DB_URL);
        await databaseService.initializeCollection();
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('getGameInfoById(id) should return a game according to a specific id', async () => {
        gameInfoService.getGameInfoById('0');
        gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        expect(await gameInfoService.getGameInfoById('0')).to.deep.equal(DEFAULT_GAMES[0]);
    });

    it('getGameInfoById(id) should return a game according to a specific id', async () => {
        gameInfoService.getGameInfoById('0');
        gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        expect(await gameInfoService.getGameInfoById('2')).to.deep.equal(DEFAULT_GAMES[2]);
    });

    it('getGameInfoById(id) should return undefined if the specific id is out of range', async () => {
        expect(await gameInfoService.getGameInfoById('5')).to.equal(undefined);
    });

    it('getAllGameInfos() should return all of the games', async () => {
        gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        const expectedGames = await gameInfoService.getAllGameInfos();
        expect(expectedGames.length).to.equal(DEFAULT_GAMES.length);
        for (let i = 0; i < DEFAULT_GAMES.length; i++) {
            expect(expectedGames[i]).to.deep.equal(DEFAULT_GAMES[i]);
        }
    });

    it('getAllGameInfos() should return all of the games after deleting one', async () => {
        gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        gameInfoService.deleteGameInfoById('0');
        const expectedGames = await gameInfoService.getAllGameInfos();
        expect(expectedGames.length).to.equal(DEFAULT_GAMES.length - 1);
        expect(expectedGames[0]).to.deep.equal(DEFAULT_GAMES[1]);
        expect(expectedGames[0]).to.deep.equal(DEFAULT_GAMES[2]);
    });

    it('addGame(game) should add a game to the game collection, getAllGames() should return them', async () => {
        const game: GameInfo = {
            id: '5',
            idOriginalBmp: '2',
            idEditedBmp: '3',
            idDifferenceBmp: '4',
            thumbnail: 'thumbnail',
            name: 'Mark',
            differenceRadius: 1,
            differences: [],
            soloScore: [],
            multiplayerScore: [],
        };
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(DEFAULT_GAMES.length);
        expect(await gameInfoService.addGameInfo(game));
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(DEFAULT_GAMES.length + 1);
    });

    it("addGame(game) shouldn't add a game twice", async () => {
        const game: GameInfo = {
            id: '5',
            idOriginalBmp: '2',
            idEditedBmp: '3',
            thumbnail: 'thumbnail',
            idDifferenceBmp: '4',
            name: 'Laurie',
            differenceRadius: 3,
            differences: [],
            soloScore: [],
            multiplayerScore: [],
        };
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(DEFAULT_GAMES.length);
        expect(await gameInfoService.addGameInfo(game));
        await expect(gameInfoService.addGameInfo(game)).to.eventually.be.rejectedWith(Error);
    });

    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        expect(await gameInfoService.deleteGameInfoById('0')).to.equal(true);
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(0);
    });

    it('deleteGameBy(id) should return false when trying to delete the same game twice', async () => {
        expect(await gameInfoService.deleteGameInfoById('0')).to.equal(true);
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(0);
        expect(await gameInfoService.deleteGameInfoById('0')).to.equal(false);
        expect(await gameInfoService.deleteGameInfoById('0')).to.equal(false);
    });

    it('resetAllGame() should reset all of the games', async () => {
        await gameInfoService.resetAllGameInfo();
        expect((await gameInfoService.getAllGameInfos()).length).to.equal(0);
    });

    it('should create a game from Bmp', async () => {
        const expectedCoordinates = [[{} as Coordinate]];
        const expectedId = '';
        stub(bmpService, 'addBmp').resolves(expectedId);
        stub(bmpDifferenceService, 'getCoordinates').resolves(expectedCoordinates);
        stub(bmpSubtractorService, 'getDifferenceBMP').resolves({
            toImageData: () => {
                return { width: 0, height: 0, data: new Uint8ClampedArray(), colorSpace: 'srgb' };
            },
        } as unknown as Bmp);
        const addGameSpy = stub(gameInfoService, 'addGameInfo').resolves();
        const bmpEncoderSpy = stub(bmpEncoderService, 'base64Encode').resolves();
        await gameInfoService
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .addGameInfoWrapper({ original: { toImageData: () => {} } as Bmp, modify: { toImageData: () => {} } as Bmp }, '', 0)
            .then(() => {
                expect(bmpEncoderSpy.called).to.equal(true);
                expect(addGameSpy.called).to.equal(true);
            });
    });
});
