import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, DB_URL, DEFAULT_BMP_TEST_PATH, ID_PREFIX } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import * as bmp from 'bmp-js';
import { expect } from 'chai';
import { promises as fs } from 'fs';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as path from 'path';
import * as sinon from 'sinon';
import { stub } from 'sinon';
import { Container } from 'typedi';

describe('GameInfo service', async () => {
    let gameService: GameService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpService: BmpService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let databaseService: DatabaseServiceMock;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;
    let bmpDecoderService: BmpDecoderService;
    let bmpEncoderService: BmpEncoderService;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        bmpService = Container.get(BmpService);
        bmpDecoderService = Container.get(BmpDecoderService);
        bmpEncoderService = Container.get(BmpEncoderService);
        gameService = new GameService(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            databaseService as any,
            bmpService,
            bmpSubtractorService,
            bmpDifferenceService,
            idGeneratorService,
            bmpEncoderService,
        );
        gameService['srcPath'] = tmpdir();
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();

        const bmpObj = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + '/test_bmp_original.bmp');
        const buffer = bmp.encode(await bmpObj.toBmpImageData());
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '1' + BMP_EXTENSION), buffer.data);
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '2' + BMP_EXTENSION), buffer.data);
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '3' + BMP_EXTENSION), buffer.data);
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '4' + BMP_EXTENSION), buffer.data);
    });

    afterEach(async () => {
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '1' + BMP_EXTENSION));
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '2' + BMP_EXTENSION));
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '3' + BMP_EXTENSION));
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '4' + BMP_EXTENSION));
        await databaseService.close();
    });

    it('getGameById(id) should return a game according to a specific id', async () => {
        expect(await gameService.getGameInfoById('0')).to.deep.equal(DEFAULT_GAME[0]);
    });

    it('getGameById(id) should return undefined if the specific id is out of range', async () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(await gameService.getGameInfoById('5')).to.equal(undefined);
    });

    it('getAllGame() should return all of the games', async () => {
        expect((await gameService.getAllGameInfos()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.deleteGameInfoById('0')).to.equal(true);
        expect(await gameService.getAllGameInfos()).to.deep.equal([]);
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
        expect((await gameService.getAllGameInfos()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGameInfo(game));
        expect((await gameService.getAllGameInfos()).length).to.equal(DEFAULT_GAME.length + 1);
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
        expect((await gameService.getAllGameInfos()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGameInfo(game));
        await expect(gameService.addGameInfo(game)).to.eventually.be.rejectedWith(Error);
    });

    it('deleteGameBy(id) should delete a game according to a specific id', async () => {
        expect(await gameService.deleteGameInfoById('0')).to.equal(true);
        expect((await gameService.getAllGameInfos()).length).to.equal(0);
    });

    it('deleteGameBy(id) should return false when trying to delete the same game twice', async () => {
        expect(await gameService.deleteGameInfoById('0')).to.equal(true);
        expect((await gameService.getAllGameInfos()).length).to.equal(0);
        expect(await gameService.deleteGameInfoById('0')).to.equal(false);
        expect(await gameService.deleteGameInfoById('0')).to.equal(false);
    });

    it('resetAllGame() should reset all of the games', async () => {
        await gameService.resetAllGameInfo();
        expect((await gameService.getAllGameInfos()).length).to.equal(0);
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
        const addGameSpy = stub(gameService, 'addGameInfo').resolves();
        const bmpEncoderSpy = stub(bmpEncoderService, 'base64Encode').resolves();
        await gameService
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .addGameInfoWrapper({ original: { toImageData: () => {} } as Bmp, modify: { toImageData: () => {} } as Bmp }, '', 0)
            .then(() => {
                expect(bmpEncoderSpy.called).to.equal(true);
                expect(addGameSpy.called).to.equal(true);
            });
    });
});
