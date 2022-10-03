import { Bmp } from '@app/classes/bmp/bmp';
import { DB_GAME_COLLECTION, DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { GameInfo } from '@common/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
@Service()
export class GameService {
    private srcPath: string = DEFAULT_BMP_ASSET_PATH;

    // eslint-disable-next-line max-params
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter,
        private readonly idGeneratorService: IdGeneratorService,
    ) {}

    get collection(): Collection<GameInfo> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getAllGames(): Promise<GameInfo[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: string): Promise<GameInfo> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }

    async addGameWrapper(images: { original: Bmp; modify: Bmp }, name: string, radius: number): Promise<void> {
        const idOriginalBmp = await this.bmpService.addBmp(await images.original.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const idEditedBmp = await this.bmpService.addBmp(await images.modify.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const differences = await this.bmpDifferenceInterpreter.getCoordinates(
            await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius),
        );
        this.addGame({ name, idOriginalBmp, idEditedBmp, differenceRadius: radius, differences });
    }

    async addGame(game: GameInfo): Promise<void> {
        if (game.id === undefined) game.id = this.idGeneratorService.generateNewId();
        if (game.soloScore === undefined) game.soloScore = [];
        if (game.multiplayerScore === undefined) game.multiplayerScore = [];
        const originalBmp: Bmp = await this.bmpService.getBmpById(game.idOriginalBmp, this.srcPath);
        const modifiedBmp: Bmp = await this.bmpService.getBmpById(game.idEditedBmp, this.srcPath);
        const differenceBmp: Bmp = await this.bmpSubtractorService.getDifferenceBMP(originalBmp, modifiedBmp, game.differenceRadius);
        game.differences = await this.bmpDifferenceInterpreter.getCoordinates(differenceBmp);
        await this.collection.insertOne(game);
    }

    async deleteGameById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }

    async resetAllGame(): Promise<void> {
        await this.collection.deleteMany({});
    }
}
