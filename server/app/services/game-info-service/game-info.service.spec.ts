import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, DB_URL, DEFAULT_BMP_TEST_PATH, ID_PREFIX } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameService = new GameService(databaseService as any, bmpService, bmpSubtractorService, bmpDifferenceService, idGeneratorService);
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
        const game: GameInfo = {
            idOriginalBmp: '2',
            idEditedBmp: '3',
            idDifferenceBmp: '4',
            name: 'Mark',
            differenceRadius: 1,
            differences: [],
            soloScore: [],
            multiplayerScore: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGame(game));
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length + 1);
    });

    it("addGame(game) shouldn't add a game twice", async () => {
        const game: GameInfo = {
            idOriginalBmp: '2',
            idEditedBmp: '3',
            idDifferenceBmp: '4',
            name: 'Laurie',
            differenceRadius: 3,
            differences: [],
            soloScore: [],
            multiplayerScore: [],
        };
        expect((await gameService.getAllGames()).length).to.equal(DEFAULT_GAME.length);
        expect(await gameService.addGame(game));
        await expect(gameService.addGame(game)).to.eventually.be.rejectedWith(Error);
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

    it('resetAllGame() should reset all of the games', async () => {
        await gameService.resetAllGame();
        expect((await gameService.getAllGames()).length).to.equal(0);
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
        const addGameSpy = stub(gameService, 'addGame').resolves();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await gameService.addGameWrapper({ original: { toImageData: () => {} } as Bmp, modify: { toImageData: () => {} } as Bmp }, '', 0).then(() => {
            expect(addGameSpy.called).to.equal(true);
        });
    });
});
