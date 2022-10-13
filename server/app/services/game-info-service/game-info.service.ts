import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, DB_GAME_COLLECTION, DEFAULT_BMP_ASSET_PATH, ID_PREFIX } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { GameInfo } from '@common/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
@Service()
export class GameInfoService {
    private srcPath: string = DEFAULT_BMP_ASSET_PATH;

    // eslint-disable-next-line max-params
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter,
        private readonly idGeneratorService: IdGeneratorService,
        private readonly bmpEncoderService: BmpEncoderService,
    ) {}

    get collection(): Collection<GameInfo> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getAllGameInfos(): Promise<GameInfo[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameInfoById(gameId: string): Promise<GameInfo> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }

    async addGameInfoWrapper(images: { original: Bmp; modify: Bmp }, name: string, radius: number): Promise<void> {
        const idOriginalBmp = await this.bmpService.addBmp(await images.original.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const difference = await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius);

        await this.addGameInfo({
            id: this.idGeneratorService.generateNewId(),
            name,
            idOriginalBmp,
            idEditedBmp: await this.bmpService.addBmp(await images.modify.toImageData(), DEFAULT_BMP_ASSET_PATH),
            thumbnail:
                'data:image/png;base64,' +
                (await this.bmpEncoderService.base64Encode(this.srcPath + '/' + ID_PREFIX + idOriginalBmp + BMP_EXTENSION)),
            differenceRadius: radius,
            differences: await this.bmpDifferenceInterpreter.getCoordinates(difference), // WHAT IS THAT????
            idDifferenceBmp: await this.bmpService.addBmp(await difference.toImageData(), DEFAULT_BMP_ASSET_PATH),
            soloScore: [],
            multiplayerScore: [],
        });
    }

    async addGameInfo(game: GameInfo): Promise<void> {
        await this.collection.insertOne(game);
    }

    async deleteGameInfoById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }

    async resetAllGameInfos(): Promise<void> {
        await this.collection.deleteMany({});
    }
}
