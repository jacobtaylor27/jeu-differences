import { Bmp } from '@app/classes/bmp/bmp';
import { DB_GAME_COLLECTION, DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
// import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class GameInfoService {
    // private srcPath: string = DEFAULT_BMP_ASSET_PATH;

    // eslint-disable-next-line max-params
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter, // private readonly bmpEncoderService: BmpEncoderService,
    ) {}

    get collection(): Collection<PrivateGameInformation> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getAllGameInfos(): Promise<PrivateGameInformation[]> {
        return await this.collection.find({}).toArray();
    }

    async getGameInfoById(gameId: string): Promise<PrivateGameInformation> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }

    async addGameInfoWrapper(images: { original: Bmp; modify: Bmp }, name: string, radius: number): Promise<void> {
        const idOriginalBmp = await this.bmpService.addBmp(await images.original.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const idEditedBmp = await this.bmpService.addBmp(await images.modify.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const differences = await this.bmpDifferenceInterpreter.getCoordinates(
            await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius),
        );
        const difference = await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius);
        const idDifferenceBmp = await this.bmpService.addBmp(await difference.toImageData(), DEFAULT_BMP_ASSET_PATH);

        await this.addGameInfo({
            id: v4(),
            name,
            idOriginalBmp,
            idEditedBmp,
            // thumbnail:
            // 'data:image/png;base64,' +
            // (await this.bmpEncoderService.base64Encode(this.srcPath + '/' + ID_PREFIX + idOriginalBmp + BMP_EXTENSION)),
            thumbnail: 'data:image/png;base64,thumbnail',
            differenceRadius: radius,
            differences,
            idDifferenceBmp,
            soloScore: [],
            multiplayerScore: [],
        });
    }

    async addGameInfo(game: PrivateGameInformation): Promise<void> {
        await this.collection.insertOne(game);
    }

    async deleteGameInfoById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }

    async deleteAllGamesInfo(): Promise<void> {
        await this.collection.deleteMany({});
    }
}
